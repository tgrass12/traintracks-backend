const bcrypt = require('bcrypt');
const { AuthenticationError, ForbiddenError } = require('apollo-server-errors');
const { startCase, isUserAuthenticated } = require('../shared/util');

async function signup(parent, args, ctx) {
  const existingUser = await ctx.prisma.user.findOne({
    where: { username: args.username },
  });

  if (existingUser) {
    throw new ForbiddenError(
      `User with username '${args.username}' already exists`,
    );
  }
  const password = await bcrypt.hash(args.password, 10);
  const user = await ctx.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });

  ctx.request.session.userId = user.id;
  ctx.request.session.username = user.username;
  return user;
}

async function login(parent, args, ctx) {
  const user = await ctx.prisma.user.findOne({
    where: { username: args.username },
  });

  if (!user) {
    throw new AuthenticationError(`Error Authenticating ${args.username}`);
  }

  const isValid = await bcrypt.compare(args.password, user.password);

  if (!isValid) {
    throw new AuthenticationError(`Error Authenticating ${args.username}`);
  }

  ctx.request.session.userId = user.id;
  ctx.request.session.username = user.username;

  return user;
}

function logout(parent, args, ctx) {
  const { username } = ctx.request.session;
  if (ctx.request.session) {
    ctx.request.session.destroy();
  }

  return username || '';
}

// TODO: Update when user auth implemented
async function updateWaterConsumptionForDate(parent, args, ctx) {
  const { username, date, waterConsumed } = args;

  const user = await ctx.prisma.user.findOne({
    where: { username },
    select: { id: true },
  });

  if (!user) throw new Error(`User ${username} doesn't exist`);

  const { id: userId } = user;
  const journalEntry = await ctx.prisma.journalEntry.findOne({
    where: {
      userEntryDateUnique: {
        userId,
        entryDate: date,
      },
    },
    select: { id: true },
  });

  if (!journalEntry) {
    return ctx.prisma.nutritionLog.create({
      data: {
        waterConsumed,
        journalEntry: {
          connectOrCreate: {
            where: {
              userJournalDateUnique: {
                userId,
                entryDate: date,
              },
            },
            create: {
              user: { connect: { id: userId } },
              entryDate: date,
            },
          },
        },
      },
    });
  }

  return ctx.prisma.nutritionLog.upsert({
    where: {
      journalId: journalEntry.id,
    },
    update: { waterConsumed: { increment: waterConsumed } },
    create: { waterConsumed },
  });
}

async function addFood(parent, args, ctx) {
  if (!isUserAuthenticated(ctx)) {
    throw new AuthenticationError('User not authenticated');
  }

  const nutrientAmountsPartials = args.food.nutrients.map((nutrient) => {
    return {
      amount: nutrient.amount,
      nutrientInfo: {
        connect: { name: startCase(nutrient.name) },
      },
    };
  });

  const food = await ctx.prisma.food.create({
    data: {
      name: args.food.name,
      foodNutrientAmounts: {
        create: nutrientAmountsPartials,
      },
    },
    include: {
      foodNutrientAmounts: {
        include: {
          nutrientInfo: true,
        },
      },
    },
  });

  return {
    name: food.name,
    nutrients: food.foodNutrientAmounts.map((nutrient) => {
      return {
        name: nutrient.nutrientInfo.name,
        amount: nutrient.amount,
        unit: nutrient.nutrientInfo.unit,
      };
    }),
  };
}

module.exports = {
  signup,
  login,
  logout,
  addFood,
  updateWaterConsumptionForDate,
};

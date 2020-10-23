const bcrypt = require('bcrypt');
const {
  AuthenticationError,
  ForbiddenError,
  ApolloError,
} = require('apollo-server-errors');
const { startCase, isUserAuthenticated } = require('../shared/util');
const { PrismaUniqueConstraintError } = require('../shared/constants');

async function signup(parent, args, ctx) {
  const password = await bcrypt.hash(args.password, 10);
  try {
    const user = await ctx.prisma.user.create({
      data: {
        ...args,
        password,
      },
    });
  } catch (e) {
    const {
      code,
      meta: { target },
    } = e;
    if (code === PrismaUniqueConstraintError) {
      if (target[0] === 'email') {
        throw new ApolloError('Email is already taken', 'USER_EXISTS');
      }
      [];
      if (target[0] === 'username') {
        throw new ApolloError('Username is already taken', 'USER_EXISTS');
      }
    }

    throw e;
  }

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

async function updateWaterConsumptionForDate(parent, args, ctx) {
  if (!isUserAuthenticated(ctx)) {
    throw new AuthenticationError('User not authenticated');
  }

  const { date: entryDate, waterConsumed } = args;
  const { userId } = ctx.request.session;
  const journalEntry = await ctx.prisma.journalEntry.findOne({
    where: {
      userEntryDateUnique: {
        userId,
        entryDate,
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
              userEntryDateUnique: {
                userId,
                entryDate,
              },
            },
            create: {
              user: { connect: { id: userId } },
              entryDate,
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

async function logFoodForDate(parent, args, ctx) {
  if (!isUserAuthenticated(ctx)) {
    throw new AuthenticationError('User not authenticated');
  }

  const {
    mealOccasion: occasionName,
    date: entryDate,
    foodId,
    servings,
  } = args;

  const logFoodCreatePartial = {
    create: {
      servings,
      food: {
        connect: { id: Number(foodId) },
      },
    },
  };

  const mealOccasionsCreatePartial = {
    create: {
      name: occasionName,
      foods: logFoodCreatePartial,
    },
  };

  const { userId } = ctx.request.session;
  const journalEntry = await ctx.prisma.journalEntry.findOne({
    where: {
      userEntryDateUnique: {
        userId,
        entryDate,
      },
    },
    include: {
      nutritionLog: {
        include: {
          mealOccasions: true,
        },
      },
    },
  });

  if (!journalEntry) {
    return await ctx.prisma.nutritionLog.create({
      data: {
        mealOccasions: mealOccasionsCreatePartial,
        journalEntry: {
          connectOrCreate: {
            where: {
              userEntryDateUnique: {
                userId,
                entryDate,
              },
            },
            create: {
              user: { connect: { id: userId } },
              entryDate,
            },
          },
        },
      },
    });
  }

  const { id: nutritionLogId, mealOccasions } = journalEntry.nutritionLog;

  const { id: mealOccasionId } = mealOccasions.find(
    (occasion) => occasion.name === occasionName,
  );

  const updatedMealOccasion = await ctx.prisma.logMealOccasion.upsert({
    where: { id: mealOccasionId },
    create: mealOccasionsCreatePartial.create,
    update: {
      foods: logFoodCreatePartial,
    },
  });

  return ctx.prisma.nutritionLog.findOne({ where: { id: nutritionLogId } });
}

module.exports = {
  signup,
  login,
  logout,
  addFood,
  updateWaterConsumptionForDate,
  logFoodForDate,
};

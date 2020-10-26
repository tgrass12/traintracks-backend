const bcrypt = require('bcrypt');
const {
  AuthenticationError,
  ForbiddenError,
  ApolloError,
  UserInputError,
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

    ctx.request.session.userId = user.id;
    ctx.request.session.username = user.username;
    return user;
  } catch (e) {
    const {
      code,
      meta: { target },
    } = e;
    if (code === PrismaUniqueConstraintError) {
      if (target[0] === 'email') {
        throw new ApolloError('Email is already taken', 'USER_EXISTS');
      }
      if (target[0] === 'username') {
        throw new ApolloError('Username is already taken', 'USER_EXISTS');
      }
    }

    throw e;
  }
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

async function updateWaterIntakeForDate(parent, args, ctx) {
  if (!isUserAuthenticated(ctx)) {
    throw new AuthenticationError('User not authenticated');
  }

  const { date: entryDate, intakeAmount: waterIntake } = args;
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
        waterIntake,
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
      journalEntryId: journalEntry.id,
    },
    update: { waterIntake },
    create: {
      waterIntake,
      journalEntry: { connect: { id: journalEntry.id } },
    },
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

  return food;
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

  const food = await ctx.prisma.food.findOne({ where: { id: Number(foodId) } });

  if (!food) {
    throw new UserInputError(`Food with id ${foodId} not found`);
  }

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
    return ctx.prisma.nutritionLog.create({
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

  const mealOccasionToUpdate = mealOccasions.find(
    (occasion) => occasion.name === occasionName,
  );

  const mealOccasionId = mealOccasionToUpdate ? mealOccasionToUpdate.id : -1;

  const updatedMealOccasion = await ctx.prisma.logMealOccasion.upsert({
    where: { id: mealOccasionId },
    create: {
      ...mealOccasionsCreatePartial.create,
      nutritionLog: {
        connectOrCreate: {
          where: { id: nutritionLogId },
          create: {
            journalEntry: { connect: { id: journalEntry.id } },
          },
        },
      },
    },
    update: {
      foods: logFoodCreatePartial,
    },
    include: {
      nutritionLog: true,
    },
  });

  return updatedMealOccasion.nutritionLog;
}

async function removeFoodFromLoggedMealForDate(parent, args, ctx) {
  if (!isUserAuthenticated(ctx)) {
    throw new AuthenticationError('User not authenticated');
  }

  const { userId } = ctx.request.session;
  const { logFoodId } = args;
  const loggedFoodExists = !!(await ctx.prisma.logFood.findOne({
    where: {
      id: Number(logFoodId),
    },
  }));

  if (!loggedFoodExists) {
    throw new UserInputError(`Logged food with id ${logFoodId} does not exist`);
  }

  const loggedFood = await ctx.prisma.logFood.findOne({
    where: {
      id: Number(logFoodId),
    },
    include: {
      logMealOccasion: {
        include: {
          nutritionLog: {
            include: {
              journalEntry: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const {
    id: loggedFoodOwner,
  } = loggedFood.logMealOccasion.nutritionLog.journalEntry.user;

  if (loggedFoodOwner !== userId) {
    throw new ForbiddenError(
      `User ${userId} not authorized to delete ${logFoodId}`,
    );
  }

  const deletedLoggedFood = await ctx.prisma.logFood.delete({
    where: { id: Number(logFoodId) },
    include: {
      logMealOccasion: {
        include: {
          nutritionLog: true,
        },
      },
    },
  });

  return deletedLoggedFood.logMealOccasion.nutritionLog;
}

module.exports = {
  signup,
  login,
  logout,
  addFood,
  updateWaterIntakeForDate,
  logFoodForDate,
  removeFoodFromLoggedMealForDate,
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError,
  ApolloError,
  UserInputError,
} = require('apollo-server-errors');
const {
  startCase,
  createAuthCookie,
  destroyAuthCookie,
  getAuthenticatedUserId,
  checkUserAuthenticated,
} = require('../shared/util');
const { PrismaUniqueConstraintError } = require('../shared/constants');

const { AUTH_SECRET } = process.env;

async function authenticateUser(parent, args, ctx) {
  try {
    const userId = getAuthenticatedUserId(ctx);
    const user = await ctx.prisma.user.findOne({ where: { id: userId } });
    const token = jwt.sign({ userId: user.id }, AUTH_SECRET);
    createAuthCookie(token, ctx);
    return {
      user,
    };
  } catch (e) {
    return null;
  }
}

async function signup(parent, args, ctx) {
  const password = await bcrypt.hash(args.password, 10);
  try {
    const user = await ctx.prisma.user.create({
      data: {
        ...args,
        password,
      },
    });

    const token = jwt.sign({ userId: user.id }, AUTH_SECRET);
    createAuthCookie(token, ctx);
    return {
      user,
    };
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

  const token = jwt.sign({ userId: user.id }, AUTH_SECRET);
  createAuthCookie(token, ctx);
  return {
    user,
  };
}

function logout(parent, args, ctx) {
  destroyAuthCookie(ctx);
  return null;
}

async function updateWaterIntakeForDate(parent, args, ctx) {
  const userId = getAuthenticatedUserId(ctx);
  const { date: entryDate, intakeAmount: waterIntake } = args;
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
  checkUserAuthenticated(ctx);

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
  const userId = getAuthenticatedUserId(ctx);
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
  const userId = getAuthenticatedUserId(ctx);
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

async function setCurrentUserNutritionTarget(parent, args, ctx) {
  const nutrientInfo = await ctx.prisma.nutrientInfo.findOne({
    where: { name: args.target.nutrientName },
  });

  const userId = getAuthenticatedUserId(ctx);
  await ctx.prisma.userTarget.upsert({
    where: {
      userTargetUnique: {
        userId,
        targetType: 'nutrition',
        targetInfoId: nutrientInfo.id,
      },
    },
    update: {
      amount: args.target.amount,
    },
    create: {
      targetType: 'nutrition',
      amount: args.target.amount,
      targetInfoId: nutrientInfo.id,
      user: { connect: { id: userId } },
    },
  });

  return {
    type: 'nutrition',
    nutrientName: nutrientInfo.name,
    amount: args.target.amount,
    unit: nutrientInfo.unit,
  };
}

module.exports = {
  authenticateUser,
  signup,
  login,
  logout,
  addFood,
  updateWaterIntakeForDate,
  logFoodForDate,
  removeFoodFromLoggedMealForDate,
  setCurrentUserNutritionTarget,
};

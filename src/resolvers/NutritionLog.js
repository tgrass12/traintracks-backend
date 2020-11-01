/* eslint no-shadow: ["error", { "allow": ["mealOccasions"] }] */
const { UserInputError, ForbiddenError } = require('apollo-server-errors');
const { getAuthenticatedUser } = require('../shared/util');

function nutritionLogByDate(_, { date }, { prisma, request }) {
  const { userId } = getAuthenticatedUser(request);
  return prisma.nutritionLog.findOne({
    where: {
      userNutritionEntryUnique: {
        userId,
        date,
      },
    },
  });
}

async function nutritionLogUpdateWaterIntake(
  _,
  { date, intakeAmount },
  { prisma, request },
) {
  const { userId } = getAuthenticatedUser(request);
  return prisma.nutritionLog.upsert({
    where: {
      userNutritionEntryUnique: {
        userId,
        date,
      },
    },
    update: { waterIntake: intakeAmount },
    create: {
      date,
      waterIntake: intakeAmount,
      mealOccasions: [],
      user: { connect: { id: userId } },
    },
  });
}

async function nutritionLogAddFood(
  _,
  { date, foodToLog },
  { prisma, request },
) {
  const { userId } = getAuthenticatedUser(request);
  const { mealOccasion: occasionName, foodId, servings } = foodToLog;

  const food = await prisma.food.findOne({ where: { id: Number(foodId) } });

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

  const { mealOccasions } = await prisma.nutritionLog.findOne({
    where: {
      userNutritionEntryUnique: {
        date,
        userId,
      },
    },
    include: {
      mealOccasions: true,
    },
  });

  const mealOccasionToUpdate = mealOccasions.find(
    (occasion) => occasion.name === occasionName,
  );

  const mealOccasionId = mealOccasionToUpdate ? mealOccasionToUpdate.id : -1;

  const updatedMealOccasion = await prisma.logMealOccasion.upsert({
    where: { id: mealOccasionId },
    create: {
      ...mealOccasionsCreatePartial.create,
      nutritionLog: {
        connectOrCreate: {
          where: {
            userNutritionEntryUnique: {
              userId,
              date,
            },
          },
          create: {
            date,
            waterIntake: 0,
            user: { connect: { id: userId } },
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

async function nutritionLogRemoveFood(
  _,
  { loggedFoodId },
  { prisma, request },
) {
  const { userId } = getAuthenticatedUser(request);
  const loggedFoodExists = !!(await prisma.logFood.findOne({
    where: {
      id: Number(loggedFoodId),
    },
  }));

  if (!loggedFoodExists) {
    throw new UserInputError(
      `Logged food with id ${loggedFoodId} does not exist`,
    );
  }

  const loggedFood = await prisma.logFood.findOne({
    where: {
      id: Number(loggedFoodId),
    },
    include: {
      logMealOccasion: {
        include: {
          nutritionLog: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  const { id: loggedFoodOwner } = loggedFood.logMealOccasion.nutritionLog.user;

  if (loggedFoodOwner !== userId) {
    throw new ForbiddenError(
      `User ${userId} not authorized to delete ${loggedFoodId}`,
    );
  }

  await prisma.logFood.delete({ where: { id: Number(loggedFoodId) } });
  return loggedFood.logMealOccasion.nutritionLog;
}

function mealOccasions({ id }, _, { prisma }) {
  return prisma.nutritionLog.findOne({ where: { id } }).mealOccasions();
}

const resolvers = {
  Query: {
    nutritionLogByDate,
  },
  Mutation: {
    nutritionLogUpdateWaterIntake,
    nutritionLogAddFood,
    nutritionLogRemoveFood,
  },
  NutritionLog: {
    mealOccasions,
  },
};

module.exports = {
  resolvers,
};

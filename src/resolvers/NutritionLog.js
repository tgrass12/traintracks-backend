const { UserInputError, ForbiddenError } = require('apollo-server-errors');
const { getAuthenticatedUser } = require('../shared/util');

function nutritionLog(_, { id }, { prisma }) {
  return prisma.nutritionLog.findOne({ where: { id: Number(id) } });
}

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

async function consumption({ id }, _, { prisma }) {
  const meals = await prisma.logMealOccasion.findMany({
    where: { nutritionLogId: id },
    include: {
      foods: {
        include: {
          food: {
            include: {
              foodNutrientAmounts: {
                include: {
                  nutrientInfo: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const consumption = meals
    .map((meal) => {
      return meal.foods.map(({ food, servings }) => {
        return food.foodNutrientAmounts.map(({ amount, nutrientInfo }) => ({
          id: nutrientInfo.id,
          name: nutrientInfo.name,
          unit: nutrientInfo.unit,
          amount: Math.round(amount * servings),
        }));
      });
    })
    .flat(2)
    .reduce((currentTotals, nutrient) => {
      if (!currentTotals[nutrient.name]) {
        currentTotals[nutrient.name] = {
          amount: 0,
          unit: nutrient.unit,
          id: nutrient.id,
        };
      }

      currentTotals[nutrient.name].amount += nutrient.amount;
      return currentTotals;
    }, {});

  return Object.entries(consumption).map(([name, { id, amount, unit }]) => ({
    id,
    name,
    amount,
    unit,
  }));
}

const resolvers = {
  Query: {
    nutritionLog,
    nutritionLogByDate,
  },
  Mutation: {
    nutritionLogUpdateWaterIntake,
    nutritionLogAddFood,
    nutritionLogRemoveFood,
  },
  NutritionLog: {
    mealOccasions,
    consumption,
  },
};

module.exports = {
  resolvers,
};

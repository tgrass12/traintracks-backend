const { UserInputError } = require('apollo-server-errors');
const { getAuthenticatedUser } = require('../shared/util');

function user(_, { id }, { prisma }) {
  return prisma.user.findOne({ where: { id } });
}

function occasionNamesUnique(occasions) {
  const nameSet = new Set();
  for (const occasion of occasions) {
    if (nameSet.has(occasion)) {
      return false;
    }
    nameSet.add(occasion);
  }
  return true;
}

async function userSetMealOccasions(_, { occasions }, { prisma, request }) {
  if (!occasionNamesUnique(occasions)) {
    throw new UserInputError('Meal occasion names must be unique');
  }

  const { userId } = getAuthenticatedUser(request);

  await prisma.userMealOccasion.deleteMany({
    where: {
      userId,
      name: {
        notIn: occasions,
      },
    },
  });

  const requests = occasions.map((occasion, i) => {
    return prisma.userMealOccasion.upsert({
      where: {
        userMealOccasionNameUnique: {
          userId,
          name: occasion,
        },
      },
      update: {
        position: i,
      },
      create: {
        name: occasion,
        position: i,
        user: { connect: { id: userId } },
      },
      include: {
        user: true,
      },
    });
  });

  const result = await prisma.$transaction(requests);
  return result[0].user;
}

async function userSetNutritionTarget(_, { target }, { prisma, request }) {
  const nutrientInfo = await prisma.nutrientInfo.findOne({
    where: { name: target.nutrientName },
  });

  const { userId } = getAuthenticatedUser(request);
  await prisma.userTarget.upsert({
    where: {
      userTargetUnique: {
        userId,
        targetType: 'nutrition',
        targetInfoId: nutrientInfo.id,
      },
    },
    update: {
      amount: target.amount,
    },
    create: {
      targetType: 'nutrition',
      amount: target.amount,
      targetInfoId: nutrientInfo.id,
      user: { connect: { id: userId } },
    },
  });

  return {
    type: 'nutrition',
    nutrientName: nutrientInfo.name,
    amount: target.amount,
    unit: nutrientInfo.unit,
  };
}

async function journalEntries({ id }, _, { prisma }) {
  const nutritionLogs = await prisma.user
    .findOne({ where: { id } })
    .nutritionLogs();

  return nutritionLogs.map((log) => ({
    date: log.date,
    nutrition: log,
  }));
}

function targets({ id }, _, { prisma }) {
  return prisma.user.findOne({ where: { id } }).targets();
}

async function mealOccasions({ id }, _, { prisma }) {
  const occasions = await prisma.userMealOccasion.findMany({
    where: { userId: id },
    orderBy: [
      {
        position: 'asc',
      },
    ],
  });

  return occasions.map((occasion) => occasion.name);
}

const resolvers = {
  Query: {
    user,
  },
  Mutation: {
    userSetMealOccasions,
    userSetNutritionTarget,
  },
  User: {
    journalEntries,
    targets,
    mealOccasions,
  },
};

module.exports = {
  resolvers,
};

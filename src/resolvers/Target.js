async function targetsByUser(_, { userId, type }, { prisma }) {
  return prisma.userTarget.findMany({
    where: {
      user: { id: userId },
      type: { contains: type },
    },
  });
}

async function nutrient({ targetInfoId }, _, { prisma }) {
  const nutrientInfo = await prisma.nutrientInfo.findOne({
    where: { id: targetInfoId },
  });
  return nutrientInfo.name;
}

async function unit({ targetInfoId }, _, { prisma }) {
  const nutrientInfo = await prisma.nutrientInfo.findOne({
    where: { id: targetInfoId },
  });
  return nutrientInfo.unit;
}

// eslint-disable-next-line no-underscore-dangle
const __resolveType = (target) => {
  switch (target.type) {
    case 'nutrition':
      return 'NutritionTarget';
    default:
      return 'Target';
  }
};

const resolvers = {
  Query: {
    targetsByUser,
  },
  Target: {
    __resolveType,
  },
  NutritionTarget: {
    nutrient,
    unit,
  },
};

module.exports = {
  resolvers,
};

async function targetsByUser(_, { userId, type }, { prisma }) {
  return prisma.userTarget.findMany({
    where: {
      user: { id: userId },
      type: { contains: type },
    },
  });
}

async function name({ nutrient, targetInfoId }, _, { prisma }) {
  if (nutrient) return nutrient;

  const nutrientInfo = await prisma.nutrientInfo.findOne({
    where: { id: targetInfoId },
  });
  return nutrientInfo.name;
}

async function unit({ unit, targetInfoId }, _, { prisma }) {
  if (unit) return unit;

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
    name,
    unit,
  },
};

module.exports = {
  resolvers,
};

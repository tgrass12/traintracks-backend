async function targetsByUser(_, { userId, type }, { prisma }) {
  const userTargets = await prisma.userTarget.findMany({
    where: {
      user: { id: userId },
      targetType: { contains: type },
    },
  });

  return userTargets.map(async (target) => {
    let targetInfo;
    if (target.targetType === 'nutrition') {
      targetInfo = await prisma.nutrientInfo.findOne({
        where: { id: target.targetInfoId },
      });

      return {
        type: 'nutrition',
        nutrientName: targetInfo.name,
        amount: target.amount,
        unit: targetInfo.unit,
      };
    }

    return null;
  });
}

// eslint-disable-next-line no-underscore-dangle
const __resolveType = ({ type }) => {
  switch (type) {
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
};

module.exports = {
  resolvers,
};

const { getAuthenticatedUser } = require('../shared/util');

async function journalEntryByDate(_, { date }, { prisma, request }) {
  const { userId } = getAuthenticatedUser(request);
  const nutrition = await prisma.nutritionLog.findOne({
    where: {
      userNutritionEntryUnique: {
        userId,
        date,
      },
    },
  });

  return {
    date,
    nutrition,
  };
}

async function journalEntriesByDateRange(
  _,
  { startDate, endDate },
  { prisma, request },
) {
  const { userId } = getAuthenticatedUser(request);
  const where = {
    userId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  };

  const nutritionLogs = await prisma.journalEntry.findMany({ where });

  return nutritionLogs.map((log) => ({
    date: log.date,
    nutrition: log,
  }));
}

const resolvers = {
  Query: {
    journalEntryByDate,
    journalEntriesByDateRange,
  },
};

module.exports = {
  resolvers,
};

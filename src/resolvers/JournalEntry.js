const { getAuthenticatedUser } = require('../shared/util');

function journalEntryByDate(_, { date }, { prisma, request }) {
  const { userId } = getAuthenticatedUser(request);
  return prisma.journalEntry.findOne({
    where: {
      userEntryDateUnique: {
        userId,
        date,
      },
    },
  });
}

function journalEntriesByDateRange(
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

  return prisma.journalEntry.findMany({ where });
}

function nutrition({ id }, _, { prisma }) {
  return prisma.journalEntry
    .findOne({
      where: { id },
    })
    .nutritionLog();
}

const resolvers = {
  Query: {
    journalEntryByDate,
    journalEntriesByDateRange,
  },
  JournalEntry: {
    nutrition,
  },
};

module.exports = {
  resolvers,
};

const { getAuthenticatedUserId } = require('../shared/util');

function user(parent, args, ctx) {
  return ctx.prisma.user.findOne({ where: { username: args.username } });
}

function getFoodById(parent, args, ctx) {
  return ctx.prisma.food.findOne({ where: { id: Number(args.id) } });
}

async function getJournalByUsernameAndDate(parent, args, ctx) {
  const { id: userId } = await ctx.prisma.user.findOne({
    where: { username: args.username },
  });

  return ctx.prisma.journalEntry.findOne({
    where: {
      userEntryDateUnique: {
        userId,
        entryDate: args.date,
      },
    },
  });
}

function getCurrentUserJournalEntryByDate(parent, args, ctx) {
  const userId = getAuthenticatedUserId(ctx);
  return ctx.prisma.journalEntry.findOne({
    where: {
      userEntryDateUnique: {
        userId,
        entryDate: args.date,
      },
    },
  });
}

function getJournalEntryRange(parent, args, ctx) {
  const userId = getAuthenticatedUserId(ctx);
  const where = {
    userId,
    entryDate: {
      gte: args.startDate,
      lte: args.endDate,
    },
  };

  return ctx.prisma.journalEntry.findMany({ where });
}

async function getCurrentUserNutritionLogByDate(parent, args, ctx) {
  const userId = getAuthenticatedUserId(ctx);
  const journal = await ctx.prisma.journalEntry.findOne({
    where: {
      userEntryDateUnique: {
        userId,
        entryDate: args.date,
      },
    },
    include: {
      nutritionLog: true,
    },
  });

  return journal ? journal.nutritionLog : null;
}

module.exports = {
  user,
  getFoodById,
  getJournalByUsernameAndDate,
  getCurrentUserJournalEntryByDate,
  getCurrentUserNutritionLogByDate,
  getJournalEntryRange,
};

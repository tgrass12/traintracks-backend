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

module.exports = {
  user,
  getFoodById,
  getJournalByUsernameAndDate,
};

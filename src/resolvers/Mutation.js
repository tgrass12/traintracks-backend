// TODO: Update when user auth implemented
async function updateWaterConsumptionForDate(parent, args, ctx) {
  const { username, date, waterConsumed } = args;

  const user = await ctx.prisma.user.findOne({
    where: { username },
    select: { id: true },
  });

  if (!user) throw new Error(`User ${username} doesn't exist`);

  const { id: userId } = user;
  const journalEntry = await ctx.prisma.journalEntry.findOne({
    where: {
      userEntryDateUnique: {
        userId,
        entryDate: date,
      },
    },
    select: { id: true },
  });

  if (!journalEntry) {
    return ctx.prisma.nutritionLog.create({
      data: {
        waterConsumed,
        journalEntry: {
          connectOrCreate: {
            where: {
              userJournalDateUnique: {
                userId,
                entryDate: date,
              },
            },
            create: {
              user: { connect: { id: userId } },
              entryDate: date,
            },
          },
        },
      },
    });
  }

  return ctx.prisma.nutritionLog.upsert({
    where: {
      journalId: journalEntry.id,
    },
    update: { waterConsumed: { increment: waterConsumed } },
    create: { waterConsumed },
  });
}

module.exports = {
  updateWaterConsumptionForDate,
};

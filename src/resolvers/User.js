function journalEntries(parent, args, ctx) {
  return ctx.prisma.user.findOne({ where: { id: parent.id } }).journalEntries();
}

function targets(parent, args, ctx) {
  return ctx.prisma.user.findOne({ where: { id: parent.id } }).targets();
}

async function mealOccasions(parent, args, ctx) {
  const occasions = await ctx.prisma.userMealOccasion.findMany({
    where: { userId: parent.id },
    orderBy: [
      {
        position: 'asc',
      },
    ],
  });

  return occasions.map((occasion) => occasion.name);
}

module.exports = {
  journalEntries,
  targets,
  mealOccasions,
};

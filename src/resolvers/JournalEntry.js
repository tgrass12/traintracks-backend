async function nutrition(parent, args, ctx, info) {
  return await ctx.prisma.journalEntry.find({
    where: { id: parent.id }
  }).nutritionLogs();
}

module.exports = {
  nutrition,
}

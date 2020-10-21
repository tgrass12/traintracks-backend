async function nutrition(parent, args, ctx, info) {
  return await ctx.prisma.journalEntry.findOne({
    where: { id: parent.id }
  }).nutritionLog();
}

module.exports = {
  nutrition,
}

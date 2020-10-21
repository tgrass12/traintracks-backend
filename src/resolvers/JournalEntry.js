function nutrition(parent, args, ctx) {
  return ctx.prisma.journalEntry
    .findOne({
      where: { id: parent.id },
    })
    .nutritionLog();
}

module.exports = {
  nutrition,
};

function foods(parent, args, ctx) {
  return ctx.prisma.logMealOccasion
    .findOne({ where: { id: parent.id } })
    .foods();
}

module.exports = {
  foods,
};

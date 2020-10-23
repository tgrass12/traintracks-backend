function mealOccasions(parent, args, ctx) {
  return ctx.prisma.nutritionLog
    .findOne({ where: { id: parent.id } })
    .mealOccasions();
}

module.exports = {
  mealOccasions,
};

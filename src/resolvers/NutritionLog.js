function mealOccasions(parent, args, ctx) {
  return ctx.prisma.nutritionLog
    .findOne({ where: { id: parent.id } })
    .mealOccasions();
}

function targets(parent, args, ctx) {
  return ctx.prisma.nutritionLog
    .findOne({ where: { id: parent.id } })
    .targets();
}

module.exports = {
  mealOccasions,
  targets,
};

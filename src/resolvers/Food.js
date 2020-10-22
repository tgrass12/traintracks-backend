async function nutrients(parent, args, ctx) {
  const { foodNutrientAmounts } = await ctx.prisma.food.findOne({
    where: { id: parent.id },
    include: {
      foodNutrientAmounts: {
        include: {
          nutrientInfo: true,
        },
      },
    },
  });

  return foodNutrientAmounts.map(({ amount, nutrientInfo: { name, unit } }) => {
    return {
      name,
      amount,
      unit,
    };
  });
}

module.exports = {
  nutrients,
};

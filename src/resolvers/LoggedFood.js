async function nutrients(parent, args, ctx) {
  const {
    servings,
    food: { foodNutrientAmounts },
  } = await ctx.prisma.logFood.findOne({
    where: { id: parent.id },
    include: {
      food: {
        include: {
          foodNutrientAmounts: {
            include: {
              nutrientInfo: true,
            },
          },
        },
      },
    },
  });

  return foodNutrientAmounts.map(({ amount, nutrientInfo: { name, unit } }) => {
    return {
      name,
      amount: Math.round(amount * servings),
      unit,
    };
  });
}

async function name(parent, args, ctx) {
  const {
    food: { name },
  } = await ctx.prisma.logFood.findOne({
    where: { id: parent.id },
    include: { food: true },
  });

  return name;
}

module.exports = {
  nutrients,
  name,
};

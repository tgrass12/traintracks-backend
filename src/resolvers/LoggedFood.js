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

  return foodNutrientAmounts.map(({ amount, nutrientInfo }) => {
    const { name: nutrientName, unit } = nutrientInfo;
    return {
      name: nutrientName,
      amount: Math.round(amount * servings),
      unit,
    };
  });
}

async function name(parent, args, ctx) {
  const loggedFood = await ctx.prisma.logFood.findOne({
    where: { id: parent.id },
    include: { food: true },
  });

  return loggedFood.food.name;
}

module.exports = {
  nutrients,
  name,
};

function foods({ id }, _, { prisma }) {
  return prisma.logMealOccasion.findOne({ where: { id } }).foods();
}

async function consumption({ id }, _, { prisma }) {
  const foods = await prisma.logFood.findMany({
    where: { logMealOccasionId: id },
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

  const consumption = foods
    .map(({ food, servings }) => {
      return food.foodNutrientAmounts.map(({ amount, nutrientInfo }) => ({
        id: nutrientInfo.id,
        name: nutrientInfo.name,
        unit: nutrientInfo.unit,
        amount: Math.round(amount * servings),
      }));
    })
    .flat(2)
    .reduce((currentTotals, nutrient) => {
      if (!currentTotals[nutrient.name]) {
        currentTotals[nutrient.name] = {
          amount: 0,
          unit: nutrient.unit,
          id: nutrient.id,
        };
      }

      currentTotals[nutrient.name].amount += nutrient.amount;
      return currentTotals;
    }, {});

  return Object.entries(consumption).map(([name, { id, amount, unit }]) => ({
    id,
    name,
    amount,
    unit,
  }));
}

const resolvers = {
  MealOccasion: {
    foods,
    consumption,
  },
};

module.exports = {
  resolvers,
};

/* eslint no-shadow: ["error", { "allow": ["food"] }] */
const { checkUserAuthenticated, startCase } = require('../shared/util');

function food(_, { id }, { prisma }) {
  return prisma.food.findOne({ where: { id: Number(id) } });
}

function foodAdd(_, { food }, { prisma, request }) {
  checkUserAuthenticated(request);

  const nutrientAmountsPartials = food.nutrients.map((nutrient) => {
    return {
      amount: nutrient.amount,
      nutrientInfo: {
        connect: { name: startCase(nutrient.name) },
      },
    };
  });

  return prisma.food.create({
    data: {
      name: food.name,
      foodNutrientAmounts: {
        create: nutrientAmountsPartials,
      },
    },
  });
}

async function nutrients({ id }, _, { prisma }) {
  const { foodNutrientAmounts } = await prisma.food.findOne({
    where: { id },
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

const resolvers = {
  Query: {
    food,
  },
  Mutation: {
    foodAdd,
  },
  Food: {
    nutrients,
  },
};

module.exports = {
  resolvers,
};

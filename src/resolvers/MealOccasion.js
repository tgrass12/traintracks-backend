function loggedFoods({ id }, _, { prisma }) {
  return prisma.logMealOccasion.findOne({ where: { id } }).foods();
}

const resolvers = {
  MealOccasion: {
    loggedFoods,
  },
};

module.exports = {
  resolvers,
};

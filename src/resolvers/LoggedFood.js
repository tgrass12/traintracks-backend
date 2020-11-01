function food({ id }, _, { prisma }) {
  return prisma.logFood
    .findOne({
      where: { id },
    })
    .food();
}

const resolvers = {
  LoggedFood: {
    food,
  },
};

module.exports = {
  resolvers,
};

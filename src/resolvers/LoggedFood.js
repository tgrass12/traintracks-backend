function food(parent, args, ctx) {
  return ctx.prisma.logFood
    .findOne({
      where: { id: parent.id },
    })
    .food();
}

module.exports = {
  food,
};

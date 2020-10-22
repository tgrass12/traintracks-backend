function user(parent, args, ctx) {
  return ctx.prisma.user.findOne({ where: { username: args.username } });
}

function getFoodById(parent, args, ctx) {
  return ctx.prisma.food.findOne({ where: { id: Number(args.id) } });
}

module.exports = {
  user,
  getFoodById,
};

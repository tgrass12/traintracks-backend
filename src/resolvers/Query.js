function user(parent, args, ctx) {
  return ctx.prisma.user.findOne({ where: { username: args.username } });
}

module.exports = {
  user,
};

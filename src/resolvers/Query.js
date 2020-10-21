async function user(parent, args, ctx, info) {
  return await ctx.prisma.user.findOne({ where: { username: args.username }});
}

module.exports = {
  user,
}

async function journalEntries(parent, args, ctx, info) {
  return await ctx.prisma.user.findOne({
    where: { id: parent.id }
  }).journalEntries();
}

module.exports = {
  journalEntries,
}

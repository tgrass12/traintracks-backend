async function journalEntries(parent, args, ctx, info) {
  return await ctx.prisma.user.find({
    where: { id: parent.id }
  }).journalEntries();
}

module.exports = {
  journalEntries,
}

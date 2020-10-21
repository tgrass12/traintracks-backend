function journalEntries(parent, args, ctx) {
  return ctx.prisma.user
    .findOne({
      where: { id: parent.id },
    })
    .journalEntries();
}

module.exports = {
  journalEntries,
};

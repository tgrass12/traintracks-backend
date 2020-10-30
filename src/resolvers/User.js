function journalEntries(parent, args, ctx) {
  return ctx.prisma.user.findOne({ where: { id: parent.id } }).journalEntries();
}

function targets(parent, args, ctx) {
  return ctx.prisma.user.findOne({ where: { id: parent.id } }).targets();
}

module.exports = {
  journalEntries,
  targets,
};

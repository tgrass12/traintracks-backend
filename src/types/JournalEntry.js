const typeDef = `
type JournalEntry implements Node {
  id: ID!
  date: Date!
  nutrition: NutritionLog
}

extend type Query {
  journalEntryByDate(date: Date!): JournalEntry
  journalEntriesByDateRange(startDate: Date!, endDate: Date!): [JournalEntry!]!
}
`;

module.exports = {
  typeDef,
};

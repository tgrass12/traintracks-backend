const { GraphQLDate } = require('graphql-iso-date');
const Query = require('./Query');
const User =  require('./User');
const JournalEntry = require('./JournalEntry');

const Scalars = {
  Date: GraphQLDate,
}


module.exports = {
  ...Scalars,
  Query,
  User,
  JournalEntry,
}

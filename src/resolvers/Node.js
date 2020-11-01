// eslint-disable-next-line no-underscore-dangle
function __resolveType() {
  return 'Node';
}

const resolvers = {
  Node: {
    __resolveType,
  },
};

module.exports = {
  resolvers,
};

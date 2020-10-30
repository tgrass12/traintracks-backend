// eslint-disable-next-line no-underscore-dangle
function __resolveType(target) {
  switch (target.type) {
    case 'nutrition':
      return 'NutritionTarget';
    default:
      return 'Target';
  }
}

module.exports = {
  __resolveType,
};

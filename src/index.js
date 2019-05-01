module.exports = {
  ...require('./config-composition'),
  ...require('./kind'),
  merges: require('./merge-tools.js'),
  selectors: require('./selector-utils.js')
};

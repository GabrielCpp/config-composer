const { eq, head } = require('lodash');

const override = (...args) => Object.assign({}, ...args);
const combine = (isSame, submerge, ...args) => {
  let result;

  if (args.length === 0) {
    result = [];
  } else if (args.length === 1) {
    result = args;
  } else {
    const [elementLhs, ...otherElements] = args;
    const unmatched = [];
    const matched = [];

    for (const elementRhs of otherElements) {
      if (isSame(elementLhs, elementRhs)) {
        matched.push(elementRhs);
      } else {
        unmatched.push(elementRhs);
      }
    }

    if (matched.length === 0) {
      result = [elementLhs, ...combine(isSame, submerge, ...unmatched)];
    } else {
      result = [submerge(elementLhs, ...matched), ...combine(isSame, submerge, ...unmatched)];
    }
  }

  return result;
};

const takeFirstMerge = (...elements) => head(elements);
const combineStrict = (...args) => combine(eq, takeFirstMerge, ...args);
const eqProperty = propertyName => (lhs, rhs) => lhs[propertyName] == rhs[propertyName];
const combineOnProperty = (propertyName, submerge, ...args) => combine(eqProperty(propertyName), submerge, ...args);

module.exports = {
  override,
  combine,
  combineStrict,
  combineOnProperty,
  takeFirstMerge
};

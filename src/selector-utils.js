const { negate, isUndefined, pickBy, isArray, sortBy, matchesProperty } = require('lodash');

const createOn = (condition, producer, ...params) => (condition ? producer(...params) : undefined);
const defineOn = (condition, value) => (condition ? value : undefined);
const isDefined = negate(isUndefined);
const pickDefined = obj => pickBy(obj, isDefined);

const walkObject = (obj, apply, path = []) => {
  if (isArray(obj) || isPlainObject(obj)) {
    for (const [key, value] of sortBy(Object.entries(obj), [0])) {
      path.push(key);
      walkObject(value, apply, path);
      path.pop();
    }
  } else {
    apply(obj, path);
  }
};

const cloneObject = obj => {
  if (isArray(obj)) {
    const resultArray = [];

    for (const value of obj) {
      resultArray.push(cloneObject(value));
    }

    return resultArray;
  } else if (isPlainObject(obj)) {
    const resultObj = {};

    for (const [key, value] of Object.entries(obj)) {
      resultObj[key] = cloneObject(value);
    }

    return resultObj;
  }

  return obj;
};

function isPlainObject(obj) {
  // Basic check for Type object that's not null
  if (typeof obj == 'object' && obj !== null) {
    // If Object.getPrototypeOf supported, use it
    if (typeof Object.getPrototypeOf == 'function') {
      var proto = Object.getPrototypeOf(obj);
      return proto === Object.prototype || proto === null;
    }

    // Otherwise, use internal class
    // This should be reliable as if getPrototypeOf not supported, is pre-ES5
    return Object.prototype.toString.call(obj) == '[object Object]';
  }

  // Not an object
  return false;
}

const safeInvoke = fn => {
  let result = null;
  let error = null;

  try {
    result = fn();
  } catch (e) {
    error = e;
  }

  return { result, error, hasError: error !== null, hasResult: result !== null };
};

const forceIndexOf = (key, value, template) => elements => {
  let indexAt = elements.findIndex(matchesProperty(key, value));

  if (indexAt === -1) {
    indexAt = elements.length;
    elements.push(template);
  }

  return String(indexAt);
};

module.exports = {
  createOn,
  defineOn,
  isDefined,
  pickDefined,
  isPlainObject,
  walkObject,
  cloneObject,
  safeInvoke,
  forceIndexOf
};

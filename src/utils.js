const isPlainObject = require('is-plain-object');
const { isArray, sortBy } = require('lodash');

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

module.exports = {
  walkObject,
  cloneObject,
  safeInvoke
};

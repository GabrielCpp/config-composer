const {
  last,
  negate,
  isUndefined,
  pickBy,
  isArray,
  sortBy,
  matchesProperty,
  eq,
  head,
  uniqWith,
  isEqual
} = require('lodash');
const isPlainObject = require('is-plain-object');

const createOn = (condition, producer, ...params) => (condition ? producer(...params) : undefined);
const defineOn = (condition, value) => (condition ? value : undefined);
const isDefined = negate(isUndefined);
const pickDefined = obj => pickBy(obj, isDefined);
const append = (config, ...elements) => [...config, ...elements];
const override = (...args) => Object.assign({}, ...args);

const indexOfOrDefault = (key, value, template = {}) => elements => {
  let indexAt = elements.findIndex(matchesProperty(key, value));

  if (indexAt === -1) {
    indexAt = elements.length;
    elements.push(template);
  }

  return String(indexAt);
};

class Merger {
  constructor(keyGetters) {
    this.keyGetters = keyGetters;
  }

  static buildMergerFactory(keyGetters) {
    return (...configs) => new Merger(keyGetters).mergeConfigs(configs);
  }

  mergeConfigs(configs) {
    if (configs.every(isPlainObject)) {
      return this.__mergeObjects(configs);
    } else if (configs.every(isArray)) {
      return this.__mergeArrays(configs);
    } else {
      return last(configs);
    }
  }

  __mergeArrays(configs) {
    if (configs.length <= 1) {
      return head(configs);
    }

    const mergedArray = [];
    const mergeMap = this.__buildArrayMergeMap(configs);

    for (const [key, configValues] of mergeMap.entries()) {
      if (configValues.every(isPlainObject)) {
        mergedArray.push(this.__mergeObjects(configValues));
      } else if (configValues.every(isArray)) {
        mergedArray.push(this.__mergeArrays(configValues));
      } else {
        mergedArray.push(last(configValues));
      }
    }

    return mergedArray;
  }

  __buildArrayMergeMap(configs) {
    const mergeMap = new Map();

    for (const config of configs) {
      for (const configEntry of config) {
        if (isPlainObject(configEntry)) {
          const key = this.__getObjectKey(configEntry);
          this.__upsert(mergeMap, key, configEntry);
        } else {
          this.__upsert(mergeMap, configEntry, configEntry);
        }
      }
    }

    return mergeMap;
  }

  __getObjectKey(configEntry) {
    const possiblKeys = [];

    for (const getId of this.keyGetters) {
      const id = getId(configEntry);

      if (!isUndefined(id)) {
        possiblKeys.push(id);
      }
    }

    if (possiblKeys.length == 1) {
      return head(possiblKeys);
    } else if (possiblKeys.length > 1) {
      const error = new Error(`More than one key match (${possiblKeys.length} matchs)`);
      error.name = 'merge-key-match';
      error.possiblKeys = possiblKeys;
      throw error;
    }

    return configEntry;
  }

  __mergeObjects(configs) {
    const mergedObject = {};
    const mergeMap = this.__buildObjectMergeMap(configs);

    for (const [key, configValues] of mergeMap.entries()) {
      if (configValues.every(isPlainObject)) {
        mergedObject[key] = this.__mergeObjects(configValues);
      } else if (configValues.every(isArray)) {
        mergedObject[key] = this.__mergeArrays(configValues);
      } else {
        mergedObject[key] = last(configValues);
      }
    }

    return mergedObject;
  }

  __buildObjectMergeMap(configs) {
    const mergeMap = new Map();

    for (const config of configs) {
      for (const [key, value] of Object.entries(config)) {
        this.__upsert(mergeMap, key, value);
      }
    }

    return mergeMap;
  }

  __upsert(combinedKeyMap, key, value) {
    if (combinedKeyMap.has(key)) {
      combinedKeyMap.get(key).push(value);
    } else {
      combinedKeyMap.set(key, [value]);
    }
  }
}

module.exports = {
  createOn,
  defineOn,
  isDefined,
  pickDefined,
  indexOfOrDefault,
  append,
  override,
  buildMergerFactory: Merger.buildMergerFactory
};

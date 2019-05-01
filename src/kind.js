const { set } = require('lodash');
const { walkObject, cloneObject } = require('./selector-utils.js');
const { Tag } = require('./tags.js');
const { DependenciesExistAssert } = require('./dependencies-exist-assert.js');
const { resolve } = require('path');

const PACKAGE_TAG = 'PACKAGE_TAG';
const globalKindStore = new Map();
let dependenciesExistAssert = null;

const tagAsPackage = value => new Tag(PACKAGE_TAG, value);

class Kind {
  static enableDependenciesAssert(enabled, rootDir) {
    if (enabled) {
      dependenciesExistAssert = new DependenciesExistAssert(PACKAGE_TAG, resolve(rootDir, 'package.json'));
    } else {
      dependenciesExistAssert;
    }
  }

  static declareKind(name, identityPredicate, childNames) {
    globalKindStore.set(name, { name, identityPredicate, childNames });
  }

  static getKindDetails(name) {
    return globalKindStore.get(name);
  }

  constructor(config, name = '') {
    this.name = name;
    this.config = config;
    this.extraTags = [];
  }

  addExtraTags(...tags) {
    this.extraTags = tags;
    return this;
  }

  getConfig() {
    const newConfig = cloneObject(this.config);

    if (dependenciesExistAssert !== null) {
      dependenciesExistAssert.assertDependenciesExists(this.gatherTagList(PACKAGE_TAG));
    }

    walkObject(newConfig, (value, path) => {
      if (Tag.isTag(value)) {
        set(newConfig, path, Tag.getTagValue(value));
      }
    });

    return newConfig;
  }

  gatherTagList(tagName) {
    const values = [];
    const accumulate = value => {
      if (Tag.isTagged(value, tagName)) {
        values.push(Tag.getTagValue(value));
      }
    };

    walkObject(this.config, accumulate);

    for (const tag of this.extraTags) {
      accumulate(tag);
    }

    return values;
  }

  walk(accumulate) {
    walkObject(this.config, accumulate);
  }

  getDetails() {
    return globalKindStore.get(this.name);
  }
}

module.exports = {
  Kind,
  PACKAGE_TAG,
  tagAsPackage
};

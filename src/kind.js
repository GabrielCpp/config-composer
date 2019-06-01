const rootDirname = require('app-root-path').path;
const { set } = require('lodash');
const { walkObject, cloneObject } = require('./selector-utils.js');
const { Tag } = require('./tags.js');
const { DependenciesExistAssert } = require('./dependencies-exist-assert.js');
const { resolve } = require('path');
const { ConfigComposition } = require('./config-composition');

const PACKAGE_TAG = 'PACKAGE_TAG';
const globalKindStore = new Map();
let dependenciesExistAssert = null;

const tagAsPackage = value => new Tag(PACKAGE_TAG, value);

class Kind {
  static enableDependenciesAssert(enabled = true) {
    if (enabled) {
      dependenciesExistAssert = new DependenciesExistAssert(PACKAGE_TAG, resolve(rootDirname, 'package.json'));
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

  reset(config) {
    this.config = config;
  }

  addTags(...tags) {
    this.extraTags = [...this.extraTags, ...tags];
    return this;
  }

  getConfig() {
    if (dependenciesExistAssert !== null) {
      dependenciesExistAssert.assertDependenciesExists(this.gatherTagList(PACKAGE_TAG));
    }

    return cloneObject(this.config);
  }

  getComposer() {
    return new ConfigComposition(this.config);
  }

  gatherTagList(tagName) {
    const values = [];

    for (const value of this.extraTags) {
      if (Tag.isTagged(value, tagName)) {
        values.push(Tag.getTagValue(value));
      }
    }

    return values;
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

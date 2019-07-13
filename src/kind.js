const rootDirname = require('app-root-path').path;
const { set } = require('lodash');
const { walkObject, cloneObject } = require('./utils');
const { Tag } = require('./tags.js');
const { DependenciesExistAssert } = require('./dependencies-exist-assert.js');
const { resolve } = require('path');
const { ConfigComposition } = require('./config-composition');
const { buildMergerFactory } = require('./compose-tools');

const PACKAGE_TAG = 'PACKAGE_TAG';
const tagAsPackage = value => new Tag(PACKAGE_TAG, value);
let dependenciesExistAssert = null;

class Kind {
  static enableDependenciesAssert(enabled = true) {
    if (enabled) {
      dependenciesExistAssert = new DependenciesExistAssert(PACKAGE_TAG, resolve(rootDirname, 'package.json'));
    } else {
      dependenciesExistAssert;
    }
  }

  constructor(config, name = '') {
    this.name = name;
    this.config = config;
    this.extraTags = [];
  }

  reset(config) {
    this.config = config;
    return this;
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

  enhance(otherConfig, enhancer = buildMergerFactory) {
    this.config = this.getComposer()(enhancer, otherConfig)();
    return this;
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
}

module.exports = {
  Kind,
  PACKAGE_TAG,
  tagAsPackage
};

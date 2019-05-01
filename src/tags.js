class Tag {
  static isTag(element) {
    return element.__tag__ !== undefined;
  }

  static isTagged(element, tagName) {
    return element.__tag__ === tagName;
  }

  static getTagValue(element) {
    return element.__value__;
  }

  constructor(tag, value) {
    this.__tag__ = tag;
    this.__value__ = value;
  }
}

module.exports = {
  Tag
};

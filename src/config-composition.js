const { get, set } = require('lodash');

class TokenizeProxy {
  constructor(parent) {
    this.proxy = new Proxy(function() {}, this);
    this.parent = parent;
    this.tokens = [];
  }

  get(target, property, receiver) {
    this.tokens.push(property);

    return this.proxy;
  }

  apply(target, thisArg, argumentsList) {
    return this.parent.applyTokenChain(this.tokens, argumentsList);
  }

  reset(firstToken) {
    this.tokens.splice(0, this.tokens.length);
    this.tokens.push(firstToken);
    return this.proxy;
  }
}

class ConfigComposition {
  constructor(baseConfig = {}) {
    this.config = baseConfig;
    this.proxy = new Proxy(function() {}, this);
    this.tokenizer = new TokenizeProxy(this);

    return this.proxy;
  }

  get(target, property, receiver) {
    return this.tokenizer.reset(property);
  }

  apply(target, thisArg, argumentsList) {
    return this.applyTokenChain([], argumentsList);
  }

  applyTokenChain(tokens, argumentsList) {
    if (argumentsList.length === 0) {
      if (tokens.length === 0) {
        return this.config;
      }

      return get(this.config, tokens);
    } else if (argumentsList.length === 1) {
      if (tokens.length === 0) {
        this.config = argumentsList[0];
      } else {
        set(this.config, tokens, argumentsList[0]);
      }
    } else {
      const [mergeFn, ...params] = argumentsList;

      if (tokens.length === 0) {
        this.config = mergeFn(...params);
      } else {
        set(this.config, tokens, mergeFn(...params));
      }
    }

    return this.proxy;
  }
}

module.exports.ConfigComposition = ConfigComposition;

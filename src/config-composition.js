const { get, set, isFunction, isString } = require('lodash');

class TokenizeProxy {
  constructor(parent, tokens = []) {
    this.proxy = new Proxy(function() {}, this);
    this.parent = parent;
    this.tokens = tokens;
    return this.proxy;
  }

  get(target, property, receiver) {
    return new TokenizeProxy(this.parent, [...this.tokens, property]);
  }

  set(target, key, value) {
    return this.parent.applyTokenChain([...this.tokens, key], [value]);
  }

  apply(target, thisArg, argumentsList) {
    if (argumentsList.length == 1 && isFunction(argumentsList[0])) {
      const property = argumentsList[0](get(this.parent.config, this.tokens));

      if (isString(property)) {
        return new TokenizeProxy(this.parent, [...this.tokens, property]);
      }

      return this.proxy;
    }

    return this.parent.applyTokenChain(this.tokens, argumentsList);
  }
}

class ConfigComposition {
  constructor(baseConfig = {}) {
    this.config = baseConfig;
    this.proxy = new Proxy(function() {}, this);

    return this.proxy;
  }

  get(target, property, receiver) {
    return new TokenizeProxy(this, [property]);
  }

  set(target, key, value) {
    return this.applyTokenChain([key], [value]);
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
        this.config = mergeFn(this.config, ...params);
      } else {
        const configValue = get(this.config, tokens);
        set(this.config, tokens, mergeFn(configValue, ...params));
      }
    }

    return this.proxy;
  }
}

module.exports.ConfigComposition = ConfigComposition;

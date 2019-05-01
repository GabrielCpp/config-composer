
Exemple webpack config


```js
const { applyConfig } = require('./webpack-defaults');

module.exports = (env = 'test', options = {}) => {
  const dirname = __dirname;
  const envConfigCreator = targetMaker =>
    new Map([
      ['client', () => targetMaker('client')],
      ['server', () => targetMaker('server')],
      ['test', () => targetMaker('server')],
      ['all', () => [targetMaker('client'), targetMaker('server')]]
    ]);

  return applyConfig(env, options, { envConfigCreator, dirname });
};
```
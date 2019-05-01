Exemple webpack ts config with Kind and tag.

```js
const { Kind, tagAsPackage } = require('./kind.js');

const isProd = mode => mode !== 'development';
const isDev = mode => mode === 'development';

const tsReactRule = mode =>
  new Kind(
    {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        defineOn(isProd(mode), tagAsPackage('webpack-strip-block')),
        {
          loader: tagAsPackage('babel-loader'),
          options: {
            presets: [
              tagAsPackage('@babel/preset-typescript'),
              [
                tagAsPackage('@babel/preset-env'),
                {
                  useBuiltIns: 'entry',
                  corejs: '3'
                }
              ],
              tagAsPackage('@babel/preset-react')
            ],
            plugins: [
              tagAsPackage('@babel/plugin-proposal-class-properties'),
              tagAsPackage('@babel/plugin-proposal-object-rest-spread'),
              tagAsPackage('@babel/plugin-transform-modules-commonjs'),
              tagAsPackage('@babel/plugin-transform-regenerator')
            ]
          }
        }
      ].filter(isDefined)
    },
    'rule'
  ).addExtraTags(tagAsPackage('@babel/core'), tagAsPackage('core-js'));
```

const { createOn, defineOn, isDefined, override, buildMergerFactory } = require('./compose-tools.js');

describe('compose-tools', () => {
  test('createOn', () => {
    const actual = createOn(true, () => 5);
    expect(actual).toEqual(5);
  });

  test('createOn', () => {
    const actual = createOn(false, () => 5);
    expect(actual).toEqual(undefined);
  });

  test('defineOn', () => {
    const actual = defineOn(true, 5);
    expect(actual).toEqual(5);
  });

  test('defineOn', () => {
    const actual = defineOn(false, 5);
    expect(actual).toEqual(undefined);
  });

  test('isDefined', () => {
    expect(isDefined(true)).toEqual(true);
  });

  test('isDefined', () => {
    expect(isDefined(undefined)).toEqual(false);
  });

  test('check result of override merge on array', () => {
    const actual = override(['a', 'b'], [1]);
    expect(actual).toEqual({ '0': 1, '1': 'b' });
  });

  test('Given', () => {
    const configA = {
      test: /\.scss$/,
      use: [
        'style-loader',
        'fs',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: ['http', 'vm']
          }
        },
        'sass-loader'
      ]
    };

    const configB = {
      test: /\.scss$/,
      use: [
        {
          loader: 'postcss-loader',
          options: {
            plugins: ['3p2']
          }
        }
      ]
    };

    const expected = {
      test: /\.scss$/,
      use: [
        'style-loader',
        'fs',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: ['http', 'vm', '3p2']
          }
        },
        'sass-loader'
      ]
    };

    const idGetters = [entry => entry.loader];
    const merge = buildMergerFactory(idGetters);
    const actual = merge(configA, configB);

    expect(actual).toEqual(expected);
  });
});

const { ConfigComposition } = require('./config-composition');

describe('ConfigComposition', () => {
  let merger;

  beforeEach(() => {
    merger = new ConfigComposition();
  });

  test('check base properties', () => {
    expect(merger.a).not.toEqual(merger);
    expect(merger()).toEqual({});
    expect(merger.a()).toEqual(undefined);
  });

  test('assign value', () => {
    merger.a.b.c(5);
    expect(merger()).toEqual({ a: { b: { c: 5 } } });
  });

  test('get value', () => {
    merger.a.b.c(5);
    expect(merger.a.b.c()).toEqual(5);
  });

  test('apply function to merge values', () => {
    merger.a(2);
    merger.a((...x) => x[0] * x[1] - x[2], 3, 1);
    expect(merger.a()).toEqual(5);
  });

  test('apply function to merge have correct order', () => {
    let actualInputs;

    merger.a(1);
    merger.a(
      (...x) => {
        actualInputs = x;
        return x;
      },
      2,
      3
    );

    expect(actualInputs).toEqual([1, 2, 3]);
  });

  test('base config is setted', () => {
    const baseConfig = { options: { a: 1, b: 'web' } };
    const merger = new ConfigComposition(baseConfig);
    expect(merger()).toEqual(baseConfig);
  });
});

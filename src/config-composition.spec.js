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
    merger.a.b.c(5);
    merger.a((...x) => x[0] * x[1], 5, 6);
    expect(merger.a()).toEqual(30);
  });

  test('base config is setted', () => {
    const baseConfig = { options: { a: 1, b: 'web' } };
    const merger = new ConfigComposition(baseConfig);
    expect(merger()).toEqual(baseConfig);
  });
});

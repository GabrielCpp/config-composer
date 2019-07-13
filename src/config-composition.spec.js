const { ConfigComposition } = require('./config-composition');

describe('ConfigComposition', () => {
  let composer;

  beforeEach(() => {
    composer = new ConfigComposition();
  });

  test('Given gettting propery should return different object', () => {
    expect(composer.a).not.toEqual(composer.a);
  });

  test('Given calling composert with no arg should return the underlaying config object', () => {
    expect(composer()).toEqual({});
  });

  test('Given calling unsetted subproperty with no arg should return undefined', () => {
    expect(composer.a()).toEqual(undefined);
  });

  test('Given calling subproperty with no arg should return the property value', () => {
    composer.a.b.c(5);
    expect(composer.a.b.c()).toEqual(5);
  });

  test('Given calling composer subproperty with single argument should assign the value to the property', () => {
    const expected = { a: { b: { c: 5 } } };
    composer.a.b.c(5);
    expect(composer()).toEqual(expected);
  });

  test('Given multi params call to property should use first params as merge function', () => {
    composer.a(2);
    composer.a((...x) => x[0] * x[1] - x[2], 3, 1);
    expect(composer.a()).toEqual(5);
  });

  test('Given multi params call to property should parameter be supplied in order', () => {
    let actualInputs;

    composer.a(1);
    composer.a(
      (...x) => {
        actualInputs = x;
        return x;
      },
      2,
      3
    );

    expect(actualInputs).toEqual([1, 2, 3]);
  });

  test('Given config composer with initial config should the initial config be returned', () => {
    const baseConfig = { options: { a: 1, b: 'web' } };
    const composer = new ConfigComposition(baseConfig);
    expect(composer()).toEqual(baseConfig);
  });

  test('Given function as single parameter to perperty should extends tokens path', () => {
    const baseConfig = { options: [{ a: 1, b: 'web' }] };
    const composer = new ConfigComposition(baseConfig);
    const fn = x => '0';
    const actual = composer.options(fn).a();

    expect(actual).toEqual(1);
  });

  test('Given affected property should this property be set', () => {
    const composer = new ConfigComposition({ option: null });

    composer.option = 42;
    const actual = composer.option();

    expect(actual).toBe(42);
  });

  test('Given affected child property should this property be set', () => {
    const composer = new ConfigComposition({ option: { a: null } });

    composer.option.a = 42;
    const actual = composer.option.a();

    expect(actual).toBe(42);
  });
});

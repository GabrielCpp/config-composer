const { createOn, defineOn, isDefined, isPlainObject, walkObject } = require('./selector-utils.js');

describe('selector-utils', () => {
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

  test('isPlainObject', () => {
    expect(isPlainObject([])).toEqual(false);
    expect(isPlainObject({})).toEqual(true);
    expect(isPlainObject(new class {}())).toEqual(false);
  });

  test('walkObject', () => {
    const obj = {
      a: [[1, 2, 3], { b: 4, c: 5 }]
    };

    const actualValues = [];

    walkObject(obj, value => actualValues.push(value));

    expect(actualValues).toEqual([1, 2, 3, 4, 5]);
  });
});

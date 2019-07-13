const { walkObject } = require('./utils.js');

describe('selector-utils', () => {
  test('walkObject', () => {
    const obj = {
      a: [[1, 2, 3], { b: 4, c: 5 }]
    };

    const actualValues = [];

    walkObject(obj, value => actualValues.push(value));

    expect(actualValues).toEqual([1, 2, 3, 4, 5]);
  });
});

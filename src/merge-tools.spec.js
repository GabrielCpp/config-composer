const { override, combineStrict } = require('./merge-tools');

describe('merge-tools', () => {
  test('check result of override merge on array', () => {
    const actual = override(['a', 'b'], [1]);
    expect(actual).toEqual({ '0': 1, '1': 'b' });
  });

  test('combineStrict', () => {
    const actual = combineStrict('a', 'b', 'a');
    expect(actual).toEqual(['a', 'b']);
  });
});

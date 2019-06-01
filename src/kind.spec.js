const { Kind, tagAsPackage, PACKAGE_TAG } = require('./kind.js');

describe('Kind', () => {
  const newConfig = () => ({
    modules: ['1', '2']
  });

  test('gatherTagList', () => {
    const configKind = new Kind(newConfig()).addTags(tagAsPackage('1'), tagAsPackage('2'));
    const tags = configKind.gatherTagList(PACKAGE_TAG);

    expect(tags).toEqual(['1', '2']);
  });

  test('getConfig', () => {
    const configKind = new Kind(newConfig());
    const config = configKind.getConfig();

    expect(config).toEqual({
      modules: ['1', '2']
    });
  });

  test('getComposer', () => {
    const expectedConfig = newConfig();
    const composer = new Kind(newConfig()).getComposer();

    expect(composer()).toEqual(expectedConfig);
  });
});

class DependenciesExistAssert {
  constructor(packageTag, packageJsonPath) {
    this.packageTag = packageTag;
    this.packageJsonPath = packageJsonPath;
  }

  assertDependenciesExists(buildDepenencies) {
    const packageJsonContent = require(this.packageJsonPath);
    const missings = [];
    const allDependencies = {
      ...packageJsonContent.devDependencies,
      ...packageJsonContent.dependencies
    };

    for (const dependencyName of buildDepenencies) {
      if (allDependencies[dependencyName] === undefined) {
        missings.push(dependencyName);
      }
    }

    if (missings.length > 0) {
      throw new Error(`Missing dependencies: ${missings.join(' ')}`);
    }
  }
}

module.exports = { DependenciesExistAssert };

export function generatePackageJson(projectName: string, frameworkConfig: any) {
  return {
    name: projectName,
    version: "1.0.0",
    private: true,
    scripts: frameworkConfig.scripts,
    dependencies: frameworkConfig.dependencies,
    devDependencies: frameworkConfig.devDependencies,
  };
}

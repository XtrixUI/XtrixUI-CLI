import { execa } from "execa";

export async function installDependencies(
  packageManager: string,
  projectPath: string,
) {
  try {
    await execa(packageManager, ["install"], {
      cwd: projectPath,
      stdio: "inherit",
    });
    console.log("Dependencies installed successfully!");
  } catch (error) {
    console.error("Failed to install dependencies:", error);
    throw error;
  }
}

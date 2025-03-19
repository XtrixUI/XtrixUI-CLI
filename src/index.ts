#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import path from "path";
import fs from "fs-extra";
import { execa } from "execa";
import { frameworks } from "./Frameworks";
import {
  copyTemplate,
  installDependencies,
  generatePackageJson,
} from "./Utils";

type FrameworkKey = keyof typeof frameworks;

function showBanner() {
  console.log(
    chalk.cyan(
      figlet.textSync("XtrixUI", {
        font: "Standard",
        horizontalLayout: "full",
        verticalLayout: "default",
      }),
    ),
  );
  console.log(chalk.magentaBright("🚀 Welcome to XtrixUI CLI! 🚀\n"));
}

async function main() {
  showBanner();

  const frameworkChoices = Object.entries(frameworks).map(([key, value]) => ({
    name: value.name,
    value: key,
  }));

  const { frameworkKey } = await inquirer.prompt<{
    frameworkKey: FrameworkKey;
  }>([
    {
      type: "list",
      name: "frameworkKey",
      message: "Select a framework:",
      choices: frameworkChoices,
    },
  ]);

  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Your project name:",
      default: "my-xtrixui-app",
    },
  ]);

  const { packageManager } = await inquirer.prompt([
    {
      type: "list",
      name: "packageManager",
      message: "Select a package manager:",
      choices: ["npm", "yarn", "pnpm", "bun"],
    },
  ]);

  const frameworkConfig = frameworks[frameworkKey];
  const targetPath = path.resolve(process.cwd(), projectName);

  try {
    console.log(chalk.green("🛠️  Creating project..."));

    await fs.ensureDir(targetPath);
    await copyTemplate(frameworkConfig.templatePath, targetPath);

    console.log(chalk.green("📦 Generating package.json..."));
    const packageJson = generatePackageJson(projectName, frameworkConfig);
    await fs.writeFile(
      path.join(targetPath, "package.json"),
      JSON.stringify(packageJson, null, 2),
    );

    console.log(
      chalk.green(`📥 Installing dependencies using ${packageManager}...`),
    );
    await installDependencies(packageManager, targetPath);

    console.log(chalk.green("🔧 Initializing Git repository..."));
    await execa("git", ["init"], { cwd: targetPath });
    await execa("git", ["add", "."], { cwd: targetPath });
    await execa("git", ["commit", "-m", "Initial commit from XtrixUI CLI"], {
      cwd: targetPath,
    });

    console.log(chalk.blueBright("🎉 Project created successfully!"));
    console.log(
      chalk.blueBright(
        `\nNext steps:\n\n  cd ${projectName}\n  ${packageManager} dev\n`,
      ),
    );
  } catch (error) {
    console.error(
      chalk.red("❌ An error occurred during project creation:"),
      error,
    );
    process.exit(1);
  }
}

main();

#!/usr/bin/env node

import * as prog from "caporal";
import * as prompts from "prompts";
import * as fs from "fs-extra";
import * as path from "path";
import { questions } from "./variables";
import * as ejs from "ejs";
import * as chalk from "chalk";
import { childProcessSync, log, filterObjectInternalKey } from "./Util";
import { fail } from "assert";
import assert = require("assert");

prog
  .version("1.0.0")
  .argument("[template]", "Template to use, default is 'basic'", prog.STRING)
  .action((args) => {
    const templateName = args["template"] ?? "basic";
    assert(templateName === "basic", "only basic template is supported");
    const templatePackageName = "@quick-qui/prototype";
    const templatePath = path.resolve(
      __dirname,
      "..",
      "node_modules",
      templatePackageName
    );
    const localPath = process.cwd();

    (async () => {
      const response = await prompts(questions);
      const projectName = response["name"] ?? "quick-qui-app";
      const targetPath = path.join(localPath, projectName);
      if (!createProject(targetPath)) {
        return;
      }
      createDirectoryContents(localPath, templatePath, projectName, response);

      const runInstallPath = targetPath;
      log.info(`run npm install at - ${runInstallPath}`);
      childProcessSync("npm", ["install"], runInstallPath);
      log.info(`npm install finished`);
    })();
  });

prog.parse(process.argv);

function createDirectoryContents(
  localPath: string,
  templatePath: string,
  projectName: string,
  vars: object
) {
  const distDir = path.join(localPath, projectName);
  fs.copySync(templatePath, distDir);
  const packageJson = fs.readJSONSync(path.join(distDir, "package.json"));
  const newPackageJson = { ...filterObjectInternalKey(packageJson), ...vars };
  fs.writeJSONSync(
    path.join(distDir, "package.json"),
    newPackageJson
  );
}

function createProject(projectPath: string) {
  if (fs.existsSync(projectPath)) {
    console.log(
      chalk.red(`Folder ${projectPath} exists. Delete or use another name.`)
    );
    return false;
  }
  fs.mkdirSync(projectPath);

  return true;
}
export function render(content: string, data: object) {
  return ejs.render(content, data);
}

#!/usr/bin/env node

import * as prog from "caporal";
import * as prompts from "prompts";
import * as fs from "fs";
import * as path from "path";
import { questions } from "./variables";
import * as ejs from "ejs";
import * as chalk from "chalk";

prog
  .version("1.0.0")
  .argument("[template]", "Template to use, default is 'basic'", prog.STRING)
  .action(args => {
    const templateName = args["template"] ?? "basic";

    const templatePath = `${__dirname}/../templates/${templateName}`;
    const localPath = process.cwd();

    (async () => {
      const response = await prompts(questions);
      const projectName = response["name"] ?? "quick-qui-app";
      const targetPath = path.join(localPath, projectName);
      if (!createProject(targetPath)) {
        return;
      }
      createDirectoryContents(localPath, templatePath, projectName, {
        ...response,
        ...{ template: templateName }
      });
    })();
  });

prog.parse(process.argv);

function createDirectoryContents(
  localPath: string,
  templatePath: string,
  projectName: string,
  vars: object
) {
  // read all files/folders (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath);
  // loop each file/folder
  filesToCreate.forEach(file => {
    const origFilePath = path.join(templatePath, file);
    console.log(origFilePath);
    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      // read file content and transform it using template engine
      let contents = fs.readFileSync(origFilePath, "utf8");
      contents = render(contents, vars);

      // write file to destination folder
      const writePath = path.join(localPath, projectName, file);
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      // create folder in destination folder
      fs.mkdirSync(path.join(localPath, projectName, file));
      // copy files/folder inside current folder recursively
      createDirectoryContents(
        localPath,
        path.join(templatePath, file),
        path.join(projectName, file),
        vars
      );
    }
  });
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

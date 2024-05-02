import shell from "shelljs"
import chalk from "chalk"
import clone from "./gitClone.js";
import logSymbols from "./logSymbols.js";
import fs from "fs-extra";
import { removeDir,changePackageJson,npmInstall } from "./utils.js";
import { inquirerConfirm,inquirerChoose,inquirerInputs } from "./interactive.js";
import { templates,messages } from "./constants.js";

const initAction = async (name, option) => { 
  if (!shell.which("git")) { 
    console.log(logSymbols.error, chalk.redBright("对不起,运行脚本必须先安装git"));
    shell.exit(1);
  }
  // 验证name输入是否符合规范
  if (name.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) { 
    console.log(logSymbols.error, chalk.redBright("对不起,项目名称存在非法字符"));
    return;
  }

  let repository = "";

  if (option.template) {
    const template = templates.find(template => template.name === option.template);
    if (!template) {
      console.log(logSymbols.error, `不存在模板${chalk.yellowBright(option.template)}`);
      console.log(`\r\n 运行${logSymbols.arrow} ${chalk.cyanBright("dy-cli list")} 查看所有可用模板\r\n`);
      return;
    }
    repository = template.value;
  }
  else { 
    const answer = await inquirerChoose("请选择一个项目模板拉取", templates);
    console.log(answer)
    repository = answer.choose;
  }

  // 验证是否存在${name}同名文件夹,如果存在
  // 1. 如果没有-f --force选项,提示用户是否删除同名文件夹
  // 2. 如果有-f --force选项,直接删除同名文件夹
  if (fs.existsSync(name) && !option.force) {
    console.log(logSymbols.warning, `已经存在项目文件夹${chalk.yellowBright(name)}`);
    //询问是否删除文件夹
    const answer = await inquirerConfirm(`是否删除文件夹${chalk.yellowBright(name)}?`);
    console.log(answer)
    if (answer.confirm) {
      //删除
      await removeDir(name);
    }
    else {
      console.log(logSymbols.error, chalk.redBright(`对不起,项目创建失败,存在同名文件夹,${chalk.yellowBright(name)}`));
      return;
    }
  }
  else if (fs.existsSync(name) && option.force) { 
    console.log(logSymbols.warning, `已经存在项目文件夹${chalk.yellowBright(name)},强制删除`);
    //删除
    await removeDir(name);
  }

  
  try {
    await clone(repository, name);
  }
  catch (err) { 
    console.log(logSymbols.error, chalk.redBright("对不起,项目创建失败"));
    console.log(err);
    shell.exit(1);
  }

  //判断命令行是否输入了-i --ignore选项，快速创建项目选项
  if(!option.ignore){
    //输入提问
    const answers = await inquirerInputs(messages);
    console.log(answers);
    await changePackageJson(name, answers);
  }

  //安装依赖
  npmInstall(name);
}

export default initAction;
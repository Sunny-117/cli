# 前端脚手架教程

## 前言

> 为什么要自己做脚手架?

虽然`vue-cli`，`CRA`等前端脚手架已经非常方便好用，特别是`vue-cli`，可以快速灵活的创建各种各样搭配的项目初始化模板，但其实，还是不太够用。比如，要么可能希望自定义一些webpack配置的内容，要么是希望在原有初始化项目的基础上，加入自定义的一些内容。比如公司项目手册中规定的工程化的内容，一些前端工具链的内容，api的封装，依赖的安装等等，不论是使用哪种已有的脚手架，都还需要在我们初始化项目的时候，配置一大堆内容。

当然，上面说的这些，我们完全也能手动操作，把以前保存的模板copy过来，或者自己从以前的git上下载，直接用就行。这当然也是没什么大问题的。

但是，如果我们把这个步骤放在自定义脚手架上，当然一方面可以大大的减轻项目初始化的工作量，同时，在公司项目管理中，在项目初始阶段就做到了规范化和统一。

当然，最关键的，自己动手做一个脚手架，并不复杂，但是在别人不知道的情况下，装X感却是满分。对于我们学习来说，也能加强自己对nodejs和一些边缘知识的了解，丰富我们的知识体系。

其实如果仅仅做一个最简单的脚手架，几十行代码足矣。其实无非就是把我们常用的工程化的模板，通过自定义脚手架的交互，从git上clone下来即可。如果公司之前就已经有准备好的工程化初始化模板，我们做的事情，无非就是从以前的手动选择，通过编写代码，变成自动选择了而已。

所以，基本的步骤，也就下面几步：

1、用户交互选择对应的模板

2、通过git下载对应的模板到本地，并根据用户交互完成配置更新与相关依赖安装

3、美化

当然，我们还可以将自定义脚手架可以发布到npm，可以像vue-cli一样全局安装之后直接使用

## 第三方依赖

- [download-git-repo](https://www.npmjs.com/package/download-git-repo)：下载并提取git仓库
- [commander](https://www.npmjs.com/package/commander)：解析命令和参数，处理命令行输入的命令
- [inquirer](https://www.npmjs.com/package/inquirer)：常见交互式命令行用户界面的集合
- [shelljs](https://www.npmjs.com/package/shelljs)：基于 Node.js API 的 Unix shell 命令的可移植**(Windows/Linux/OS X)实现**
- [fs-extra](https://www.npmjs.com/package/fs-extra)：fs的扩展，提供了非常多的便利API，并且继承了fs所有方法和为fs方法添加了promise的支持
- [chalk](https://www.npmjs.com/package/chalk)：美化终端输出，提供了多种终端输出颜色选择
- [figlet](https://www.npmjs.com/package/figlet)：终端标题美化
- [ora](https://www.npmjs.com/package/ora)：终端显示下载动画
- [table](https://www.npmjs.com/package/table)：在终端用表格形式展示数据

## 创建脚手架执行文件

创建工程文件夹，并初始化`package.json`文件

```shell
mkdir dy-cli
cd dy-cli
npm init -y
```

为了引入方便，模块化默认使用ESM，所以在`package.json`中添加`"type": "module"`

创建入口可执行文件`index.js`

```javascript
#!/usr/bin/env node

console.log('hello dy-cli')
```

> `#!`是Linux和Unix以及各种脚本中出现在文件最开头的序列。当它出现在文本文件的第一行时，类Unix操作系统的程序加载器会分析`#!`后的内容，**将这些内容作为解释器指令，并调用对应的解释器来执行脚本**。
>
> `Shebang`的名字来自于`Sharp`和`bang`，或`hash bang`的缩写，指代`Shebang`中`#!`两个符号的典型Unix名称。
>
> Unix术语中，`#`号通常称为`sharp`（如`C#`称为`C Sharp`），`hash`或`mesh`（网、洞）；而叹号`!`则常常称为`bang`。

了解了`Shebang`之后就可以理解，**增加这一行是为了指定用node执行脚本文件**。简单的理解，就是输入命令后，会有在一个新建的shell中执行指定的脚本，在执行这个脚本的时候，我们需要来指定这个脚本的解释程序是node。

可是不同用户或者不同的脚本解释器有可能安装在不同的目录下，系统如何知道要去哪里找你的解释程序呢？ `/usr/bin/env`就是告诉系统可以在`PATH`目录中查找。 所以配置`#!/usr/bin/env node`, 就是解决了**不同的用户node路径不同的问题，可以让系统动态的去查找node来执行你的脚本文件**。

在 `package.json` 中增加 `bin` 字段:

`bin`属性用来将可执行文件加载到全局环境中，指定了`bin`字段的npm包，一旦在全局安装，就会被加载到全局环境中，可以通过别名来执行该文件。如果非全局安装，那么会自动连接到项目的`node_module/.bin`目录中

```javascript
"bin": {
	"dy-cli": "./index.js"
},
```

现在，我们可以暂时先使用 `npm link` 命令把这个文件映射到全局后, 就可以在任意目录下的命令行中输入` dy-cli` 执行我们的 `index.js` 脚本文件

输入 `npm list -g` 可以查看已安装的全局模块

> `npm link`可以帮助我们模拟包安装后的状态，它会在系统中做一个快捷方式映射，让本地的包就好像install过一样，可以直接使用。在MAC中，我们在终端可以直接敲命令，其实是在执行`/usr/local/bin`目录下的脚本。这个目录，其实保存的就是下载的全局命令。
>
> 当我们在`npm install -g`的时候，其实是将相关文件安装在`/usr/local/lib/node_modules`目录下，同时，在`/usr/local/bin`目录下会有一个映射脚本，将其指向`/usr/local/lib/node_modules`下的真实文件。
>
> 而`npm link`也是做类似的事情，只不过在`/usr/local/lib/node_modules`里存的不是真实的文件，而是存了一个快捷方式，指向你当前执行`npm link`的目录。如果开发的是node包，则执行的命令名和真实执行的文件入口，会通过项目的`package.json`里`bin`的配置来获取。

接下来我们无非只需要完成两个步骤：

1、通过nodejs代码拉取git repository 

2、通过命令行交互，做出不同选择，拉取不同模板

把这两步跑通，然后把这两个步骤放入到`dy-cli`命令中运行，我们的脚手架其实就出来了


## 通过node拉取git repository 

[download-git-repo](https://www.npmjs.com/package/download-git-repo)

### 安装

```javascript
npm i download-git-repo
```

### API

```javascript
download(repository, destination, options, callback)
```

下载一个 **git** `repository` 到 `destination` 文件夹，配置参数 `options`, 和 `callback回调`.

### 基本使用

```javascript
import download from 'download-git-repo'
download('yingside/webpack-template', 'test', function (err) {
	console.log(err ? 'Error' : 'Success')
})
```

git拉取肯定是需要花费时间的，因此，我们可以通过Promise做一下简单封装

```javascript
import download from 'download-git-repo'
const clone = (remote, name, option=false) => {
  console.log("正在拉取项目......")
  return new Promise((resolve, reject) => {
    download(remote, name, option, err =>{
      if (err) {
        console.error(err);
        reject(err)
        return
      }
      console.log("拉取成功")
      resolve();
    })
  })
}

await clone("yingside/webpack-template", "test")
```

## 美化

[ora](https://www.npmjs.com/package/ora)：终端显示下载动画

[chalk](https://www.npmjs.com/package/chalk)：美化终端输出，提供了多种终端输出颜色选择

[figlet](https://www.npmjs.com/package/figlet)：终端标题美化

之前的代码感觉卡在那边，如果下载时间过久，不知道是不是在继续执行，我们可以添加简单的Loading动画效果和字体颜色，让终端界面生动起来

```javascript
import download from 'download-git-repo'
import ora from "ora";
import chalk from "chalk";

const clone = (remote, name, option=false) => {
  const spinner = ora('正在拉取项目......').start();
  return new Promise((resolve, reject) => {
    download(remote, name, option, err =>{
      if (err) {
        spinner.fail(chalk.red(err));
        reject(err)
        return
      }
      spinner.succeed(chalk.green('拉取成功'))
      resolve();
    })
  })
}
```

也可以把之前在index.js中的打印语句换成美化标题

```javascript
import figlet from 'figlet';
import chalk from 'chalk';

console.log('\r\n' + chalk.greenBright.bold(figlet.textSync('dy-cli', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 80,
  whitespaceBreak: true
})));
console.log(`\r\nRun ${chalk.cyan(`dy-cli <command> --help`)} for detailed usage of given command\r\n`)
```


## 解析命令行指令参数

[commander](https://www.npmjs.com/package/commander)

### 安装

```javascript
npm i commander
```

### 引入

```javascript
const { program } = require('commander')

program.version('1.0.0');

// 利用commander解析命令行输入，必须写在所有内容最后面
program.parse(process.argv)
```

可以在终端运行命令：

```shell
$ dy-cli -V
```

默认是大写的`-V`，当然我们也能设置

```javascript
program.version('1.0.0','-v, --version');
```

### [Custom event listeners](https://www.npmjs.com/package/commander#custom-event-listeners)

```javascript
program
  .name("dy-cli")
  .description("自定义脚手架")
  .usage("<command> [options]")
  .on('--help', () => {
    console.log('\r\n' + chalk.greenBright.bold(figlet.textSync('dy-cli', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    })));
    console.log(`\r\nRun ${chalk.cyan(`dy-cli <command> --help`)} for detailed usage of given command\r\n`)
  })
```

### [Commands](https://www.npmjs.com/package/commander#commands)

```javascript
program
  .command('create <app-name>')
  .description('创建新项目')
  .option('-t, --template [template]', '输入模板名称创建项目')
  .option('-f, --force', '强制覆盖本地同名项目')
  .option('-i, --ignore', '忽略项目相关描述,快速创建项目')
  .action((name, option) => { 
    console.log(name)
    console.log(option)
  })

```

我们可以创建一些模板便于查看，这些模板其实就是已经上传到github的模板工程

**constants.js**

```javascript
// constants.js
export const templates = [
  {
    name: 'webpack-template',
    value: 'yingside/webpack-template',
    desc: '基于webpack5的vue3项目模板'
  },
  {
    name: 'vue-cli-template',
    value: 'yingside/vue-cli-template',
    desc: '基于vue-cli4的vue3项目模板'
  },
  {
    name: 'vite-template',
    value: 'yingside/vite-template',
    desc: '基于vite的vue3 + 前端工具链项目模板'
  }
];
```

添加查看所有模板的`command`命令`list`

```javascript
import { templates } from './constants.js';

......其他代码省略

program
  .command('list')
  .description('查看所有可用模板')
  .action(() => { 
		console.log(chalk.yellowBright('模板列表'));
    templates.forEach((temp, index) => {
      console.log(`(${index + 1}) | ${temp.name} | ${temp.value} | ${temp.desc}`)
    })
  })
```


### ESM引入json文件

在nodejs的commonjs模块化下引入json文件很方便

```javascript
const pkg = require("./package.json");
```

但是在ESM模块化下直接引入json文件，会报错：

```javascript
import pkg from './package.json'

node:internal/errors:478
    ErrorCaptureStackTrace(err);
    ^
TypeError [ERR_IMPORT_ASSERTION_TYPE_MISSING] ......
```

可以使用下面简单的方式引入：

```javascript
import pkg from './package.json' assert {type: 'json'}
```

当然这么做会报出警告：

```javascript
(node:8490) ExperimentalWarning: Importing JSON modules is an experimental feature. 
```

我们可以使用下面两种方式之一引入json文件

```javascript
import { readFile } from 'fs/promises';
const pkg = JSON.parse(
  await readFile(
    new URL('./package.json', import.meta.url)
  )
);
```

或者

```javascript
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("./package.json");
```

其中，`import.meta.url`可以在ESM中方便地获取当前模块的绝对路径

> - `process.cwd()`: `cwd` 是 "current working directory" 的缩写，**表示当前工作目录**。`process.cwd()` 返回 Node.js 进程当前的工作目录的路径。
> - `__dirname`: `__dirname` **是当前模块所在的目录的绝对路径**。它是由 Node.js 在每个模块中注入的特殊变量。换句话说，它只能在 Node.js 的模块系统中使用，例如 CommonJS 模块或使用 `require` 进行导入的模块。
> - `import.meta.url` 是 ECMAScript 模块（ESM）中的一个属性，用于**获取当前模块文件的 URL 绝对地址**。它只能在原生支持 ESM 的环境中使用，如现代的浏览器 或者 Node.js 支持的ESM模式。

如果觉得上面的方式麻烦，也能引入`fs-extra`库，直接帮我们解决读取json文件的问题

### [fs-extra](https://www.npmjs.com/package/fs-extra)

这个库其实就是对nodejs自带的fs库的增强，并且也自带了fs库的方法。比如上面读取json文件的处理，我们就可以直接通过`fs-extra`增强的方法去进行处理(虽然这个增强方法其实还是使用了`fs/promises`的`readFile`方法，只是帮我进行了封装而已)

```javascript
const pkg = fs.readJsonSync(new URL('./package.json', import.meta.url))
program.version(pkg.version, '-v, --version');
```

当然`fs-extra`还有很多好用的方法，我们在后面的代码中再继续使用

### Unicode字符美化

我们可以在一些关键位置，加上一些Unicode字符来进行美化，使得一些提示更加显眼，终端页面也不用显得那么死板。我们常用的`Emoji`表情，其实就是是`Unicode`字符的一种

[Unicode 官方网站](https://home.unicode.org/)

[Unicode 检索PDF](https://unicode.org/charts/PDF/)

**logSymbols.js**

```javascript
// logSymbols.js

import chalk from "chalk";

const main = {
  info: chalk.blue("ℹ"),
  success: chalk.green("✔"),
  warning: chalk.yellow("⚠"),
	error: chalk.red("✖"),
  star: chalk.cyan("✵"),
  arrow: chalk.yellow("➦")
};

export default main
```

但是有一些终端可能并不支持Unicode字符，所以我们最好判断一下

**utils.js**

```javascript
// utils.js
export function isUnicodeSupported() {
  // 操作系统平台是否为 win32（Windows）
  if (process.platform !== "win32") {
    // 判断 process.env.TERM 是否为 'linux'，
    // 这表示在 Linux 控制台（内核）环境中。
    return process.env.TERM !== "linux"; // Linux console (kernel)
  }

  return (
    Boolean(process.env.CI) || // 是否在持续集成环境中
    Boolean(process.env.WT_SESSION) || // Windows 终端环境（Windows Terminal）中的会话标识
    Boolean(process.env.TERMINUS_SUBLIME) || // Terminus 插件标识
    process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu 和 cmder 终端中的任务标识
    process.env.TERM_PROGRAM === "Terminus-Sublime" ||
    process.env.TERM_PROGRAM === "vscode" || // 终端程序的标识，可能是 'Terminus-Sublime' 或 'vscode'
    process.env.TERM === "xterm-256color" ||
    process.env.TERM === "alacritty" || // 终端类型，可能是 'xterm-256color' 或 'alacritty'
    process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm" // 终端仿真器的标识，可能是 'JetBrains-JediTerm'
  );
}
```

**logSymbols.js**

```javascript
import { isUnicodeSupported } from "./utils.js";
import chalk from "chalk";

const main = {
  info: chalk.blue("ℹ"),
  success: chalk.green("✔"),
  warning: chalk.yellow("⚠"),
	error: chalk.red("✖"),
  star: chalk.cyan("✵"),
  arrow: chalk.yellow("➦")
};

const fallback = {
  info: chalk.blue("i"),
  success: chalk.green("√"),
  warning: chalk.yellow("‼"),
	error: chalk.red("×"),
  star: chalk.cyan("*"),
  arrow: chalk.yellow("->")
};

const logSymbols = isUnicodeSupported() ? main : fallback;

export default logSymbols;
```

这样在界面上，我们可以稍微修改一下

```javascript
// index.js
import logSymbols from './logSymbols.js';
import { templates } from './constants.js';
......其他代码省略
program
  .command('list')
  .description('查看所有可用模板')
  .action(() => { 
    console.log(chalk.yellowBright(logSymbols.star,'模板列表'));
    templates.forEach((temp, index) => {
      console.log(`(${index + 1}) | ${temp.name} | ${temp.value} | ${temp.desc}`)
    })
  })
```

### 列表美化

直接打印模板列表显得参差不齐，可以直接使用表格进行处理

[table](https://www.npmjs.com/package/table)

```javascript
import logSymbols from './logSymbols.js';
import { templates } from './constants.js';
import { table } from 'table';
......其他代码省略
program
  .command('list')
  .description('查看所有可用模板')
  .action(() => { 
    // 转换为二维数组
    const data = templates.map(item => [chalk.bold.yellowBright(item.name), item.value, item.desc]);
   data.unshift([chalk.yellowBright("模板名称"), chalk.yellowBright("模板地址"), chalk.yellowBright("模板描述")]);
    const config = {
      header: {
        alignment: 'center',
        content: chalk.yellowBright(logSymbols.star + ' 模板列表'),
      },
    }
    console.log(table(data,config));
  })
```

接下来，就需要`create <app-name>` 这个command命令做点事情了，也就是在函数中要做相关处理

### [shelljs](https://www.npmjs.com/package/shelljs)

ShellJS 是基于 Node.js API 的 Unix shell 命令的可移植**(Windows/Linux/OS X)实现。**简单来说，我们可以在nodejs中执行命令行代码，比如执行command命令的时候，看看终端是否可以运行

**安装**

```javascript
npm i shelljs
```

**initAction.js**

```javascript
import shell from "shelljs";
import logSymbols from './logSymbols.js';
const initAction = async (name, option) => {
  if (!shell.which("git")) {
    console.log(logSymbols.error, "对不起，运行脚本必须先安装git!");
    shell.exit(1);
  }
  // 验证name输入是否合法
  if (name.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) {
    console.log(logSymbols.error, "项目名称存在非法字符！");
    return;
  }
}
```

```javascript
program
  .command('create <app-name>')
  .description('创建新项目')
  .option('-t, --template [template]', '输入模板名称创建项目')
  .option('-f, --force', '强制覆盖本地同名项目')
  .option('-i, --ignore', '忽略项目相关描述,快速创建项目')
  .action(initAction)
```


## 命令行交互

### 安装

```javascript
npm i inquirer
```

### 询问`confirm`

创建单独的模块处理交互相关代码

**interactive.js**

```javascript
// interactive.js

import inquirer from 'inquirer'

/**
 * @param {string} message 询问提示语句 
 * @returns {boolean} 返回结果
 */
export const inquirerConfirm = async (message) => { 
  const answer = await inquirer.prompt({
    name: 'confirm',
    type: 'confirm',
    message
  });
  return answer
}
```

```javascript
// initAction
import chalk from "chalk";
import fs from "fs-extra";
import { inquirerConfirm } from "./interactive.js";

......其他代码省略

// 验证name是否存在
if (fs.existsSync(name) && !option.force) {
  console.log(logSymbols.error, `已存在项目文件夹${chalk.yellow(name)}`);

  const answer = await inquirerConfirm(`是否删除${chalk.yellow(name)}文件夹？`)

  console.log(answer)
}
```

### 删除文件夹

在utils模块中创建删除文件夹的函数

```javascript
// utils.js

import path from 'path';
import fs from "fs-extra";
import ora from "ora";
import chalk from "chalk";
import logSymbols from './logSymbols.js';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

export async function removeDir(dir) {
  const spinner = ora({
    text: `正在删除文件夹${chalk.cyan(dir)}`,
    color: "yellow",
  }).start();

  try {
    await fs.remove(resolveApp(dir));
    spinner.succeed(chalk.greenBright(`删除文件夹${chalk.cyan(dir)}成功`));
  }
  catch (err) { 
    spinner.fail(chalk.redBright(`删除文件夹${chalk.cyan(dir)}失败`));
    console.log(err);
    return;
  }
}
```

**完整代码：**

```javascript
// initAction.js

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
```


### 列表`choose`

**interactive.js**

```javascript
// interactive.js
/**
 * @param {string} message 询问提示语句 
 * @param {Array} choices 选择列表 
 * @param {string} type 列表类型 
 * @returns {Object} 选择结果
 */
export const inquirerChoose = async (message,choices,type='list') => { 
  const answer = await inquirer.prompt({
    name: 'choose',
    type,
    message,
    choices
  });
  return answer
}
```

### 获取远程git模板

```javascript
let repository = '';
if (option.template) { 
  const template = templates.find(template => template.name === option.template);
  if (!template) { 
    console.log(logSymbols.error, `不存在模板 ${chalk.yellow(option.template)}`);
    console.log(`\r\n运行${logSymbols.arrow} ${chalk.cyan(`dy-cli list`)} 查看所有可用模板\r\n`)
    return;
  }
  repository = template.value;
}
else {
  // 选择远程git项目模板
  const answer = await inquirerChoose('请选择项目模板:',templates);
  // console.log(answer)
  repository = answer.choose;
}
```

接下来，就是我们之前已经写过的拉取`git repository`了

### gitClone

创建`gitClone.js`文件，下载远程`git repository`

```javascript
// gitClone.js

import download from 'download-git-repo'
import ora from "ora";
import chalk from "chalk";

const gitClone = (remote, name, option=false) => {
  const spinner = ora('正在拉取项目…').start();
  return new Promise((resolve, reject) => {
    download(remote, name, option, err =>{
      if (err) {
        spinner.fail(chalk.red(err));
        reject(err)
        return
      }
      spinner.succeed(chalk.green('拉取成功'))
      resolve();
    })
  })
}

export default gitClone
```

在`initAction.js`文件中调用

```javascript
// 下载远程git项目模板
try {
  await gitClone(repository, name);
} catch (err) {
  console.log(logSymbols.error, err);
  shell.exit(1); // 下载失败直接退出
  return;
}
```


### 输入`input`

下载完成之后，我们可以修改下载项目的`package.json`文件，添加一些自定义内容，首先至少要和用户进行输入交互

```javascript
//interactive.js

/**
 * @param {string} message 询问提示语句 
 * @returns 输入结果
 */
export const inquirerInput = async (message) => { 
  const answer = await inquirer.prompt({
    name: 'input',
    type: 'input',
    message
  });
  return answer
}

/**
 * @param {Array} messages 询问提示语句数组 
 * @returns {Object} 结果对象
 */
export const inquirerInputs = async (messages) => { 
  const answers = await inquirer.prompt(messages.map(msg => { 
    return {
      name: msg.name,
      type: 'input',
      message: msg.message
    }
  }));
  return answers
}
```

```javascript
// 是否忽略项目相关描述
if (!option.ignore) { 
  // 输入提问
  const answers = await inquirerInputs(messages);
  console.log(answers);
}
```

接下来，当然就需要修改`package.json`文件了

### 修改`package.json`

```javascript
/**
 * @param {string} name 文件夹名称 
 * @param {Object} info 修改信息对象
 */
export async function changePackageJson(name, info) {
  try {
    const pkg = await fs.readJson(resolveApp(`${name}/package.json`))

    Object.keys(info).forEach(item => {
      if (item === 'name') {
        // 如果未输入项目名，则使用默认创建的项目名，也就是文件夹的名字
        pkg[item] = info[item] && info[item].trim() ? info[item] : name
      }
      else if (item === 'keywords' && info[item] && info[item].trim()) { 
        pkg[item] = info[item].split(',')
      }
      else if (info[item] && info[item].trim()) {
        pkg[item] = info[item]
      }
    })

    // console.log(pkg)

    await fs.writeJson(resolveApp(`${name}/package.json`), pkg, { spaces: 2 });

  } catch (err) {
    console.log(logSymbols.error, chalk.red(err));
  } 
}
```

调用：

```diff
// 是否忽略项目相关描述
if (!option.ignore) { 
  // 输入提问
  const answers = await inquirerInputs(messages);
  console.log(answers);
+  await changePackageJson(name,answers);
}
```

### `node_modules`安装

下载完成之后，我们可以直接通过shell命令进入到下载好的项目中，进行`node_modules`安装

```javascript
// utils.js

export function npmInstall(dir) { 
  const spinner = ora('正在安装依赖......').start();

  if (shell.exec(`cd ${shell.pwd()}/${dir} && npm install --force -d`).code !== 0) {
    console.log(logSymbols.error, chalk.yellow('自动安装依赖失败，请手动安装'));
    shell.exit(1)
  }
  spinner.succeed(chalk.green('~~~依赖安装成功~~~'))
  spinner.succeed(chalk.green('~~~项目创建完成~~~'))
  shell.exit(1)
}
```

**调用：**

```diff
// 是否忽略项目相关描述
if (!option.ignore) { 
  // 输入提问
  const answers = await inquirerInputs(messages);
  console.log(answers);
  await changePackageJson(name,answers);
}

+ npmInstall(name);
```


## 发布到npm

当然，首先你需要在 **[npmjs](https://www.npmjs.com/)** 官网注册账号

常用命令：

- `npm whoami`  检测当前登录状态
- `npm config ls`  显示当前 npm 配置信息
- `npm addUser` 、`npm login`  登录
- `npm config set registry 链接地址` 切换源地址
- `npm publish` 发布

> **注意1：**必须使用npm源镜像才能发布，如果使用的是阿里源等镜像，需要切换成源镜像才能发布 `https://registry.npmjs.org/`
>
> **注意2：**发布名称读取的是**package.json中的name**，并且，npmjs上已经有很多很多内容，**package不能重名**。所以名字尽量不要太简单，不然发布会报403错误


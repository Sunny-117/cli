import inquirer from 'inquirer';

/**
 * @param {string} message 询问提示语句
 * @returns  {Object} 根据name属性获取用户输入的值{confirm: true/false}
 */
export const inquirerConfirm = async (message) => { 
  const answer = await inquirer.prompt({
    type: "confirm",
    name: "confirm",
    message,
  });
  return answer;
}

/**
 * 
 * @param {string} message 询问提示语句
 * @param {Array} choices 选择列表，默认读取对象的name属性
 * @param {string} type 默认列表类型
 * @returns {Object} 根据name属性获取用户输入的值{choose: xxxxxx}
 */
export const inquirerChoose = async (message, choices, type = 'list') => { 
  const answer = await inquirer.prompt({
    type,
    name: "choose",
    message,
    choices,
  });
  return answer;
}

/**
 * @param {string} message 询问提示的值
 * @returns {Object} 根据name属性获取用户输入的值{input: xxxxxx}
 */
export const inquirerInput = async (message) => { 
  const answer = await inquirer.prompt({
    type: "input",
    name: "input",
    message,
  });
  return answer;
}

/**
 * @param {Array} messages  询问提示语句数组
 * @returns {Object} 结果对象
 */
export const inquirerInputs = async (messages) => { 
  const answers = await inquirer.prompt(messages.map(msg => { 
    return {
      name: msg.name,
      type: "input",
      message: msg.message,
    }
  }));
  return answers
}
export const templates = [
  {
    name: "webpack-template",
    value: "yingside/webpack-template",
    desc:"基于webpack5自定义初始化vue3项目模板"
  },
  {
    name: "vue-cli-template",
    value: "yingside/vue-cli-template",
    desc:"基于vue-cli自定义vue3项目模板"
  },
  {
    name: "vite-template",
    value: "yingside/vite-template",
    desc:"基于vite的vue3 + 前端工具链项目模板"
  },
  {
    name: "vue-admin-box",
    value: "cmdparkour/vue-admin-box",
    desc:"cmdparkour vue3 + vite中后台项目模板"
  }
]

export const messages = [
  {
    message: "请输入项目名称:",
    name: "name",
    validate(val) { 
      if (val.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) { 
        return "项目名称存在非法字符";
      }
      return true
    }
  },
  {
    message: "请输入项目关键词(,分割):",
    name: "keywords",
  },
  {
    message: "请输入项目描述:",
    name: "description",
  },
  {
    message: "请输入作者名称:",
    name: "author",
  }
]
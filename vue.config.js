// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/project_NinnikuShop/' // week8_0626 為 repo 名稱
    : '/'
}

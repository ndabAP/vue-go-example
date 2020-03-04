const isDocker = !!process.env.ENV
const target = isDocker ? 'server' : 'localhost'

module.exports = {
  productionSourceMap: false,

  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    }
  },

  lintOnSave: 'error',

  outputDir: '../website',

  devServer: {
    proxy: {
      '/api': {
        target: `http://${target}:3000/api`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}

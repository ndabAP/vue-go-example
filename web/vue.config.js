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
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}

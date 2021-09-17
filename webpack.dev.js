const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
  mode: 'development',

  devtool: 'inline-source-map',

  devServer: {
    port: 9000,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: false, // HMR 是指在不刷新畫面的狀態下，注入修改過後的代碼 (entry 入口處 (./src/js/controller.js) 引入 HMR JavaScript API)
    // compress: true,
  },
});

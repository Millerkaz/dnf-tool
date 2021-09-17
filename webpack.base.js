const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  //* 入口(打包的載入點)
  entry: './src/js/controller.js',

  //* 出口(打包的輸出點)
  output: {
    filename: 'js-bundle.js', //輸出檔名
    path: path.resolve(__dirname, 'dist'), //輸出位置
    assetModuleFilename: 'img/[name][ext]', //wp5新增，圖片輸出位置
    clean: true,
  },

  //* 使用LOADER(entry內import的檔案)
  module: {
    rules: [
      //SASS預處理+自動prefix+輸出單獨CSS檔案
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // publicPath: './',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: require('sass'),
            },
          },
        ],
      },

      //JS壓縮工具
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-runtime', { corejs: 3 }]],
          },
        },
      },

      //圖片轉換工具(僅限SASS內的圖，HTML和JS動態載入的img用plugin搬動src/img)
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
        // use: [
        //   {
        //     loader: 'file-loader',
        //     options: {
        //       // limit: 8000,
        //       name: '[name].[ext]',
        //       publicPath: './img',
        //       outputPath: './img',
        //     },
        //   },
        //   {
        //     loader: 'image-webpack-loader',
        //     options: {
        //       byPassOnDebug: true,
        //     },
        //   },
        // ],
        // type: 'javascript/auto',
        // dependency: { not: ['url'] },
      },
    ],
  },

  plugins: [
    //HTML模板打包並自動插入JS,CSS路徑
    new HtmlWebpackPlugin({
      //原始檔案(root:package.json layer)
      template: './index.html',
      //輸出檔案(root:dist)
      filename: './index.html',
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        minifyJS: true,
        sortAttributes: true,
        useShortDoctype: true,
      },
      // inject: false,
    }),

    //CSS單獨輸出的位置
    new MiniCssExtractPlugin({ filename: './style.bindle.css' }),

    //css 壓縮
    new OptimizeCssPlugin(),

    //檔案搬移
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/img',
          // context: path.resolve(__dirname, 'public/js'),
          to: './img',
        },
      ],
    }),

    //打包時清除原本的檔案
    new CleanWebpackPlugin(),
  ],

  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin()],
  },
};

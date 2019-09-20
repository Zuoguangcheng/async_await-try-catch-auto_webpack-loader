const path = require('path');


module.exports = {
  mode: 'production',

  entry: './index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),

    filename: 'build.js'
  },

  module: {
    rules: [
      {
          test: /\.js$/,
          use:{
              loader:'./asyncloader.js',
          }
      }
  ]
 
    // rules中的每一项是一个规则
   /*  rules:[
      {
        test: /\.js$/, // 值一个正则，符合这些正则的资源会用一个loade来处理
        use: {
          loader: 'babel-loader', // 使用bable-loader来处理
          options: { // 指定参数
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['> 1%', 'last 2 version'] //具体可以去babel-preset里面查看
                } 
              }]
               
            ] // 指定哪些语法编译
          }
        },
        exclude: '/node_module/' // 排除在外
      }
    ] */
  }
}
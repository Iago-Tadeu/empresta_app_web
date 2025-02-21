const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true)
      })
    ]
  },
  devServer: {
    proxy: {
      "/baseApiUrl": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        pathRewrite: { "^/baseApiUrl": "" },
      },
    },
  },
});

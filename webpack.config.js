const path = require("path");
const webpack = require("webpack");

const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[chunkhash].bundle.js",
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
  resolve: {
    modules: [path.join(__dirname, "src"), "node_modules"],
    alias: {
      process: "process/browser",
      react: path.join(__dirname, "node_modules", "react"),
    },
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx", ".scss"],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules\/(?!@mui\/).*/,
          name: "vendors",
          chunks: "all",
        },
        "@mui": {
          test: /node_modules\/(@mui\/).*/,
          name: "@mui",
          chunks: "all",
        },
      },
    },
    runtimeChunk: {
      name: "manifest",
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ["file-loader?name=[name].[ext]"], // ?name=[name].[ext] is only necessary to preserve the original file name
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        // If you are not using less ignore this rule
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico",
      manifest: "./public/manifest.json",
      logo192: "./public/logo192.png",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
};

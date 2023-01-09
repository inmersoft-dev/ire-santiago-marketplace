const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

require("dotenv").config({ path: "./.env" });

console.log(process.env);

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
    new Dotenv({
      path: "./.env", // Path to .env file (this is the default)
    }),
    new webpack.EnvironmentPlugin([
      "REACT_APP_URL",
      "REACT_APP_API_URL",
      "REACT_APP_LANGUAGE",
      "REACT_APP_BASIC_KEY",
      "REACT_APP_ACCEPT_COOKIE",
      "REACT_APP_DECLINE_COOKIE",
      "REACT_APP_VISIT_COOKIE",
      "REACT_APP_DESCRIPTION_COOKIE",
      "REACT_APP_VIEW_COOKIE",
      "REACT_APP_HOW_TO_GO",
      "REACT_APP_ORDER_COOKIE",
      "REACT_APP_MAPBOX_API",
      "REACT_APP_IMAGEKIT_URL",
      "REACT_APP_IMAGEKIT_PUBLIC_KEY",
      "REACT_APP_IMAGEKIT_AUTH_URL",
      "REACT_APP_IMAGEKIT_DELETE_URL",
      "REACT_APP_FIREBASE_API_KEY",
      "REACT_APP_FIREBASE_AUTH_DOMAIN",
      "REACT_APP_FIREBASE_PROJECT_ID",
      "REACT_APP_FIREBASE_STORAGE_BUCKET",
      "REACT_APP_FIREBASE_MESSAGING_SENDER_ID",
      "REACT_APP_FIREBASE_APP_ID",
      "REACT_APP_FIREBASE_MEASUREMENT_ID",
    ]),
  ],
};

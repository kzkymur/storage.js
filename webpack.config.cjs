const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.ts",
    react: "./src/react.ts",
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "umd",
      name: "storage.js",
    },
    globalObject: "this",
    umdNamedDefine: true,
  },
};

/* eslint-env node */

import * as webpack from "webpack";
import * as path from "path";

const {
  ConsoleRemotePlugin,
} = require("@openshift-console/dynamic-plugin-sdk-webpack");

const config: webpack.Configuration = {
  mode: "development",
  // No regular entry points. The remote container entry is handled by ConsoleRemotePlugin.
  entry: {},
  context: path.resolve(__dirname, "src"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-bundle.js",
    chunkFilename: "[name]-chunk.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)(\?.*$|$)/,
        loader: "file-loader",
        options: {
          name: "assets/[name].[ext]",
        },
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [new ConsoleRemotePlugin()],
  devtool: "source-map",
  optimization: {
    chunkIds: "named",
    minimize: false,
  },
};

if (process.env.NODE_ENV === "production") {
  config.mode = "production";
  config.output.filename = "[name]-bundle-[hash].min.js";
  config.output.chunkFilename = "[name]-chunk-[chunkhash].min.js";
  config.optimization.chunkIds = "deterministic";
  config.optimization.minimize = true;
}

export default config;

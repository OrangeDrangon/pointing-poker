import webpack from "webpack";
import WebpackModules from "webpack-modules";
import path from "path";
import sapperWebpack from "sapper/config/webpack.js";
import packageJson from "./package.json" with { type: "json" };

const mode = process.env.NODE_ENV;
const dev = mode === "development";

const alias = { svelte: path.resolve("node_modules", "svelte") };
const extensions = [".mjs", ".js", ".json", ".svelte", ".html"];
const mainFields = ["svelte", "module", "browser", "main"];
const fileLoaderRule = {
  test: /\.(png|jpe?g|gif)$/i,
  use: ["file-loader"],
};
const conditionNames = ["svelte"];

export const client = {
  entry: sapperWebpack.client.entry(),
  output: sapperWebpack.client.output(),
  resolve: { alias, extensions, mainFields },
  module: {
    rules: [
      {
        test: /\.(svelte|html)$/,
        use: {
          loader: "svelte-loader",
          options: {
            compilerOptions: {
              dev,
              hydratable: true,
            },
            // Webpack 4 uses acorn v6 which doesn't work with HMR
            // Use overrides from npm or resolutions from yarn to set minimal
            // acorn version to v7+
            // https://github.com/sveltejs/sapper-template/pull/308
            hotReload: false,
          },
        },
      },
      fileLoaderRule,
    ],
  },
  mode,
  plugins: [
    // pending https://github.com/sveltejs/svelte/issues/2377
    // dev && new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.browser": true,
      "process.env.NODE_ENV": JSON.stringify(mode),
    }),
  ].filter(Boolean),
  devtool: dev && "inline-source-map",
};
export const server = {
  entry: sapperWebpack.server.entry(),
  output: sapperWebpack.server.output(),
  target: "node",
  resolve: { alias, extensions, mainFields },
  externals: Object.keys(packageJson.dependencies).concat("encoding"),
  module: {
    rules: [
      {
        test: /\.(svelte|html)$/,
        use: {
          loader: "svelte-loader",
          options: {
            compilerOptions: {
              css: false,
              generate: "ssr",
              hydratable: true,
              dev,
            },
          },
        },
      },
      fileLoaderRule,
    ],
  },
  mode,
  plugins: [new WebpackModules()],
  performance: {
    hints: false, // it doesn't matter if server.js is large
  },
};
export const serviceworker = {
  entry: sapperWebpack.serviceworker.entry(),
  output: sapperWebpack.serviceworker.output(),
  mode,
};

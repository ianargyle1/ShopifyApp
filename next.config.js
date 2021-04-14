require("dotenv").config();
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');

module.exports = withCSS({
  webpack: (config) => {
    const env = { API_KEY: "7024a288b54f6446b96b578d93ad044c" };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
});
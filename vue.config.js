const { argv } = require('yargs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const app = argv.app || 'default';

const appConfig = {
  main: {
    entryApp: './src/main.ts',
    title: 'Tracker App',
    outputDir: './dist',
  },
  portal: {
    entryApp: './src/portal-main.ts',
    title: 'Tracker Portal',
    outputDir: './dist-portal',
  },
};
appConfig.default = appConfig.main;

module.exports = {
  lintOnSave: false,

  transpileDependencies: ['vuetify'],
  configureWebpack: (config) => {
    console.log('ENTRY APP : ', app);
    config.entry.app = appConfig[app].entryApp;
    let htmlWebpackPlugin = config.plugins.find(
      (plugin) => plugin instanceof HtmlWebpackPlugin
    );
    htmlWebpackPlugin.options.title = appConfig[app].title;
  },
  "outputDir": appConfig[app].outputDir
};

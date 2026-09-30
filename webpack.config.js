const path = require('node:path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: false,
  entry: {
    'integration-controls': './src/app/IntegrationControls.ts',
    content: './src/app/Content.ts',
    listener: './src/app/Listener.ts',
    popup: './src/ui/popup.tsx',
  },
  output: { path: path.resolve(__dirname, 'dist/js'), filename: '[name].js', publicPath: 'js/' },
  resolve: { extensions: ['.ts', '.tsx', '.js'], plugins: [new TsconfigPathsPlugin()] },
  optimization: {
    // Feature/command identifiers use constructor.name across the page bridge.
    minimizer: [new TerserPlugin({ terserOptions: { keep_classnames: true, keep_fnames: true } })],
  },
  module: { rules: [
    { test: /\.tsx?$/, loader: 'esbuild-loader', options: { loader: 'tsx', target: 'es2020', keepNames: true } },
    { test: /\.js$/, include: path.resolve(__dirname, 'node_modules/blip-ds'), enforce: 'pre', use: [path.resolve(__dirname, 'scripts/offline-bds-loader.cjs')] },
    { test: /\.svg$/, use: ['@svgr/webpack'] },
    { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
  ] },
  performance: false,
};

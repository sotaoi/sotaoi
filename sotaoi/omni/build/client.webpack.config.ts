require('dotenv').config();
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { paths } from '@sotaoi/omni/build/paths';
import TerserPlugin from 'terser-webpack-plugin';
import path from 'path';
import { envVarWhitelist } from '@app/omni/get-app-info';

const WebpackConfigFactory = (webpackEnv: string): webpack.Configuration => {
  process.env.NODE_ENV = webpackEnv;
  const envVars: { [key: string]: any } = {};
  envVarWhitelist.map((varName) => ((envVars as any)[varName] = process.env[varName]));

  const isEnvProduction = process.env.NODE_ENV !== 'development';
  return {
    mode: isEnvProduction ? 'production' : 'development',
    devtool: 'source-map',
    entry: paths.cwebDevcomponent,
    output: {
      path: paths.clientBuild,
      publicPath: '/',
    },
    devServer: {
      contentBase: paths.publicPath,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(tsx|ts|js)$/,
          include: [
            paths.appClientPath,
            paths.appOmniPath,
            paths.sotaoiClientPath,
            paths.sotaoiModulesPath,
            paths.sotaoiOmniPath,
          ],
          loader: require.resolve('ts-loader'),
          exclude: [/node_modules/],
          options: {
            configFile: 'tsconfig.client.json',
          },
        },
      ],
    },
    resolve: {
      alias: {
        ...mocks([
          'react-native',
          'react-native-gesture-handler',
          '@react-native-picker/picker',
          'react-native-safe-area-view',
          'react-navigation-stack',
          'react-native-router-flux',
          'react-native-vector-icons',
          'react-native-paper',
          'fs',
          'path',
        ]),
      },
      extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
      minimize: !!isEnvProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
          },
        }),
      ],
    },
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.clientHtml,
        isEnvProduction,
        // minify: isEnvProduction
        //   ? {
        //     removeComments: false,
        //     collapseWhitespace: false,
        //     removeRedundantAttributes: false,
        //     useShortDoctype: false,
        //     removeEmptyAttributes: false,
        //     removeStyleLinkTypeAttributes: false,
        //     keepClosingSlash: true,
        //     minifyJS: false,
        //     minifyCSS: false,
        //     minifyURLs: false,
        //   }
        //   : {
        //     //
        //   },
        minify: {
          // no minify
        },
      }),
      new webpack.DefinePlugin({
        __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
        'process.env': JSON.stringify(JSON.stringify(envVars)),
      }),
    ],
  };
};

const mocks = (modules: string[]): { [key: string]: string } => {
  const _mocks: { [key: string]: string } = {};
  const defaultMock = path.resolve(path.dirname(require.resolve('@sotaoi/client/mocks/react-native/index.js')));
  modules.map((module) => (_mocks[module] = defaultMock));
  return _mocks;
};

export { WebpackConfigFactory };

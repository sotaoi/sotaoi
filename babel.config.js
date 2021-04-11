module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app/client', './app/omni', './sotaoi/client', './sotaoi/modules', './sotaoi/omni'],
        alias: {
          '@app/api': './app/api',
          '@app/client': './app/client',
          '@app/omni': './app/omni',
          '@sotaoi/api': './famework/api',
          '@sotaoi/client': './sotaoi/client',
          '@sotaoi/modules': './sotaoi/modules',
          '@sotaoi/omni': './sotaoi/omni',
          fs: './sotaoi/client/mocks/react-native',
          path: './sotaoi/client/mocks/react-native',
        },
      },
    ],
    ['inline-dotenv', { unsafe: true, systemVar: 'all' }],
  ],
};

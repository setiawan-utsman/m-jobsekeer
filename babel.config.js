module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: "nativewind" }],
      "nativewind/babel"
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@services': './src/services',
            '@types': './src/types',
            '@utils': './src/utils',
            '@contexts': './src/contexts',
            '@hooks': './src/hooks',
            '@theme': './src/theme',
            '@assets': './src/assets'
          },
        },
      ],
      'react-native-reanimated/plugin'
    ],
  };
};

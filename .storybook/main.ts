const config = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: undefined
      }
    },
  },
  viteFinal: async (config) => {
    // Ensure proper module resolution
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    
    // Add React alias for consistency
    config.resolve.alias['react'] = require.resolve('react');
    config.resolve.alias['react-dom'] = require.resolve('react-dom');
    
    return config;
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;

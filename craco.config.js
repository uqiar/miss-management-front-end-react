const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // '@primary-color': '#17999f',
              // '@body-background': '#f9f9fb',
              // '@text-color': '#17999f',
              // '@text-color-secondary': '#9a9a9a',
              // '@heading-color': '#17999f',
              // '@text-color-secondary-dark': '#000000',
              // '@layout-header-background': 'red',
              // '@layout-footer-background': 'red',
              // '@layout-sider-background': 'black',
              // '@layout-header-height': '66px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

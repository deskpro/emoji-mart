const path = require('path')

module.exports = async ({ config }) => {
  config.module.rules = [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, '../stories'),
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../data'),
      ],
    },
    {
      test: /\.svg$/,
      loaders: ['babel-loader?presets[]=react', 'svg-jsx-loader?es6=true'],
      include: [
        path.resolve(__dirname, '../src/svgs'),
      ],
    },
    {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ],
      include: [
        path.resolve(__dirname, '../css'),
        path.resolve(__dirname, '../node_modules/@fortawesome/fontawesome-free'),
      ],
    },
    {
      test: /\.(woff|woff2|ttf|eot|svg)(\?|$)/,
      use:  [
        {
          loader: 'url-loader'
        }
      ]
    },
  ];

  config.devtool.sourcemaps = {
    enabled: false,
  };

  return config;
};

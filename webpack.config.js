const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const config = {
  target: 'node',
  mode: 'none',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    vscode: 'commonjs vscode',
    eslint: 'commonjs eslint',
    canvas: {},
    'utf-8-validate': {},
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'eslint-plugin-jsx-a11y': path.resolve(__dirname, 'node_modules/eslint-plugin-jsx-a11y'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!extension.js'],
    }),
  ],
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: 'log',
  },
};

const reactConfig = {
  target: 'web',
  mode: 'development',
  entry: './src/react-views/dashboard/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dashboard.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [],
  devtool: 'source-map',
  infrastructureLogging: {
    level: 'log',
  },
};
// Add configuration for progressionChart.ts
const chartConfig = {
  target: 'web',
  mode: 'development',
  entry: './src/charts/progressionChart.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'progressionChart.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  plugins: [],
  devtool: 'source-map',
  infrastructureLogging: {
    level: 'log',
  },
};
module.exports = [config, reactConfig, chartConfig];

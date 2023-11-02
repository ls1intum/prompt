import path from 'path'
import { Configuration, EnvironmentPlugin, SourceMapDevToolPlugin } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import 'webpack-dev-server'

const config: Configuration = {
  mode: (process.env.NODE_ENV as 'production' | 'development' | undefined) ?? 'development',
  entry: './src/index.tsx',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    hot: true,
    historyApiFallback: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              import: false,
              modules: true,
            },
          },
          'sass-loader',
        ],
        include: /\.module\.scss$/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /\.module\.scss$/,
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'public' }],
    }),
    new EnvironmentPlugin({
      NODE_ENV: 'development',
      REACT_APP_SERVER_HOST: 'http://localhost:8080',
      REACT_APP_KEYCLOAK_HOST: 'http://localhost:8081',
      REACT_APP_KEYCLOAK_REALM_NAME: 'prompt',
    }),
    new SourceMapDevToolPlugin({
      append: '\n//# sourceMappingURL=https://prompt.ase.cit.tum.de/sourcemap/[url]',
      filename: '[file].map[query]',
    }),
  ],
}

export default config

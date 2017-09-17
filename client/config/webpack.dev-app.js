'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pkg = require('../package.json');

module.exports = (fullpath, options) => {
  const fullcfg = merge({
    // =================================
    // base config
    // =================================
    name: 'dev-app',
    entry: {
      app: fullpath.app,
      library: fullpath.src
    },
    cache: true,
    output: {
      path: fullpath.output.dev.app,
      filename: '[name].[hash].js',
      publicPath: '/'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(`${fullpath.base}/app/index.html`),
        inject: 'body',
      }),
      // --------
      // Chunking
      // --------
      new webpack.optimize.OccurrenceOrderPlugin(true),
      /*
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: (module) => {
          const req = module.userRequest;
          if (typeof req === 'string' && req.indexOf('node_modules') >= 0) {
            const fname = req.split('!').slice(-1).pop(); // accounts for loaders
            const stats = fs.lstatSync(fname);
            if (!stats.isSymbolicLink()) {
              return true;
            }
          }
          return false;
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'library',
        minChunk: (module) => {
          const req = module.userRequest;
          return typeof req === 'string' && req.match(new RegExp(`${fullname.src}.*`));
        }
      })
      */
    ]
  }, {
    // =================================
    //  source-map
    // =================================
    output: {
      // sourceMapFilename: '[name].[hash].js.map',
      sourceMapFilename: '[name].ts.map',
    },
    devtool: 'inline-source-map',
    plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename: '[name].js.map',
        test: /\.tsx?$/
      }),
    ]
  }, {
    // only configure webpack-dev-server if in app-mode
    // =================================
    // dev-server & HMR
    // =================================
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      // historyApiFallback: true,
      historyApiFallback: {
        index: '/'
      },

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      host: options.host, // Defaults to `localhost`
      port: options.port, // Defaults to 8080

      // For some versions of Windows/Ubuntu/Vagrant
      // watchOptions: {
      //   // Delay the rebuild after the first change
      //   aggregateTimeout: 300,
      //   // Poll using interval (in ms, accepts boolean too)
      //   poll: 1000
      // }
    },
    plugins: [
      // For some versions of Windows/Ubuntu/Vagrant
      // new webpack.WatchIgnorePlugin([
      //   path.resolve(`${fullpath.base}/node_modules`)
      // ]),

      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        // Disabled as this won't work with html-webpack-template yet
        // multiStep: true
      })
    ]
  }, {
    // =================================
    // Clean output directory between builds
    // =================================
    plugins: [
      new CleanWebpackPlugin([fullpath.output.dev.app], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: fullpath.base
      })
    ]
  }, {
    // =================================
    // webpack options
    // =================================

    // Disable performance hints during development
    performance: {
      hints: false // false || 'warning' || 'error'
    }
  }, {
    // =================================
    //  TypeScript loader
    // =================================
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.js'
      ],
    },
    module: {
      rules: [{
        enforce: 'pre',
        test: /\.tsx?$/,
        use: 'tslint-loader',
        exclude: /node_modules/
          /*}, {
            enforce: 'pre',
            test: /\.js$/,
            use: 'source-map-loader',
            exclude: /node_modules/
            */
      }, {
        test: /\.tsx?$/,
        use: `ts-loader?configFileName=${fullpath.tsconfig.dev.app}`,
        // hmm - options didn't seem to work'
        // options: {
        //    configFileName: tsconfig('dev', 'app')
        // },
        exclude: /node_modules/
      }]
    }
  }, {
    // =================================
    //  css
    // =================================
    module: {
      rules: [{
        test: /\.css$/,
        include: [
          fullpath.app,
          fullpath.src
        ],
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            camelCase: true,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        }]
      }]
    }
  }, {
    // =================================
    //  scss
    // =================================
    module: {
      rules: [{
        test: /\.scss$/,
        include: [
          fullpath.app,
          fullpath.src,
          fullpath.base + '/node_modules'
        ],
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            camelCase: true,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'sass-loader',
        }]
      }]
    },
  }, {
  //   plugins: [
  //     new ExtractTextPlugin({
  //       filename: '[name]-[id]-[contenthash].css',
  //       allChunks: true}),
  //   ]
  // }, {
    // =================================
    //  assets
    // =================================
    module: {
      rules: [{
        test: /\.(png|jpg|gif)$/,
        use: 'file-loader',
        include: [
          fullpath.app,
          fullpath.src
        ]
      }]
    }
  }, {
    // =================================
    //  fonts
    // =================================
  }, {
    // =================================
    // minification
    // =================================
    plugins: [
      // (process.env.NODE_ENV === 'production') enables React optimizations
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  }, {
    // =================================
    // Manifest generation
    // =================================
    plugins: [
      new ManifestPlugin({
        basePath: '/',
        writeToFileEmit: true,
        stripSrc: true,
        cache: {}
      })
    ]
  }, {
    // =================================
    // Visualize the bundles
    // =================================
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: fullpath.stats.dev.app.report,
        generateStatsFile: true,
        openAnalyzer: false,
        // timings: true,
        statsFilename: fullpath.stats.dev.app.json,
        logLevel: 'info'
      })
    ]
  });
  return fullcfg;
}

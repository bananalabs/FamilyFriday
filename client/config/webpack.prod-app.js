'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');
const pkg = require('../package.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (fullpath) => {
  const fullcfg = merge({
    // =================================
    // base config
    // =================================
    name: 'prod-app',
    entry: {
      app: fullpath.app,
      library: fullpath.src
    },
    output: {
      path: fullpath.output.prod.app,
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
      // new webpack.optimize.DedupePlugin(),
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
      })
    ]
  }, {
    // =================================
    //  source-map
    // =================================
    output: {
      // sourceMapFilename: '[name].[hash].js.map',
      sourceMapFilename: '[name].[hash].ts.map',
    },
    devtool: 'source-map',
    plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename: '[name].[hash].js.map',
        test: /\.tsx?$/
      }),
    ]
  }, {
    // =================================
    // Clean output directory between builds
    // =================================
    plugins: [
      new CleanWebpackPlugin([fullpath.output.prod.app], {
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
        use: `ts-loader?configFileName=${fullpath.tsconfig.prod.app}`,
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
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      /*
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        sourceMap: true,
        mangle: {
          except: ['webpackJsonp'],
          screw_ie8: true,
          keep_fnames: false
        }
      })*/
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
        reportFilename: fullpath.stats.prod.app.report,
        generateStatsFile: false,
        openAnalyzer: false,
        statsFilename: fullpath.stats.prod.app.json,
        logLevel: 'info'
      })
    ]
  });
  return fullcfg;
}

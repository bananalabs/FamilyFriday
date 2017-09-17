'use strict';
const path = require('path');
const getport = require('getport');
const devapp = require('./config/webpack.dev-app.js');
const devlib = require('./config/webpack.dev-lib.js');
const prodapp = require('./config/webpack.prod-app.js');
const prodlib = require('./config/webpack.prod-lib.js');

const fullpaths = {
  base: path.resolve(__dirname),
  app: path.resolve('./app'),
  src: path.resolve('./src'),
  vendor: path.resolve('./node_modules'),
  tsconfig: {
    dev: {
      app: path.resolve(`${__dirname}/config/tsconfig.dev-app.json`),
      lib: path.resolve(`${__dirname}/config/tsconfig.dev-lib.json`)
    },
    prod: {
      app: path.resolve(`${__dirname}/config/tsconfig.prod-app.json`),
      lib: path.resolve(`${__dirname}/config/tsconfig.prod-lib.json`)
    },
    unittest: {
      app: path.resolve(`${__dirname}/config/tsconfig.unit-test.json`),
    }
  },
  // devClient: `webpack-dev-server/client?http://${host}:${port}`,
  // hmr: path.join('webpack-hot-middleware', 'client?reload=true'),
  output: {
    dev: {
      app: path.resolve(`${__dirname}/build/app`),
      lib: path.resolve(`${__dirname}/build/lib`)
    },
    prod: {
      app: path.resolve(`${__dirname}/dist/app`),
      lib: path.resolve(`${__dirname}/dist/lib`)
    },
    unittest: {
      app: path.resolve(`${__dirname}/build/unit-test`)
    }
  },
  stats: { // relative paths to bundles location
    dev: {
      app: {
        report: path.resolve(`${__dirname}/build/app/stats/report.html`),
        json: path.resolve(`${__dirname}/build/app/stats/stats.json`)
      },
      lib: {
        report: path.resolve(`${__dirname}/build/lib/stats/report.html`),
        json: path.resolve(`${__dirname}/build/lib/stats/stats.json`)
      }
    },
    prod: {
      app: {
        report: path.resolve(`${__dirname}/dist/app/stats/report.html`),
        json: path.resolve(`${__dirname}/dist/app/stats/stats.json`)
      },
      lib: {
        report: path.resolve(`${__dirname}/dist/lib/stats/report.html`),
        json: path.resolve(`${__dirname}/dist/lib/stats/stats.json`)
      }
    },
    unittest: {
      app: {
        report: path.resolve(`${__dirname}/build/unit-test/stats/report.html`),
        json: path.resolve(`${__dirname}/build/unit-test/stats/stats.json`)
      }
    }
  }
};

module.exports = (env) => {
  return new Promise((resolve, reject) => {
    getport(8000, 10000, (err, port) => {
      return err ? reject(err) : resolve(port);
    });
  }).then((port) => {
    const options = {
      host: 'localhost',
      port: port
    }
    switch (env) {
      case 'dev-server':
      case 'dev-app':
        return devapp(fullpaths, options)
      case 'dev-lib':
        return devlib(fullpaths);
      case 'development':
      case 'dev':
      case 'D':
        return [
          devapp(fullpaths, options),
          // devlib(fullpaths)
        ];
      case 'prod-app':
        return prodapp(fullpaths);
      case 'prod-lib':
        return prodlib(fullpaths);
      case 'production':
      case 'prod':
      case 'P':
        return [
          prodlib(fullpaths),
          prodapp(fullpaths)
        ];
      default:
        console.warn(`Unknown env($env). Coercing to 'production'.`);
        return [
          prodapp(fullpaths),
          prodlib(fullpaths)
        ];
    }
  });
};

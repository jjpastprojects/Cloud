// Generated by CoffeeScript 1.12.3
(function() {
  var AWS, SharedIniFile, configure, helpers,
    hasProp = {}.hasOwnProperty;

  helpers = require('./helpers');

  AWS = helpers.AWS;

  SharedIniFile = require('../lib/shared_ini');

  configure = function(options) {
    return new AWS.Config(options);
  };

  describe('AWS.Config', function() {
    describe('constructor', function() {
      it('should be able to pass in a Config object as parameter', function() {
        var config, copyConfig;
        config = new AWS.Config({
          sslEnabled: false,
          maxRetries: 0
        });
        copyConfig = new AWS.Config(config);
        expect(copyConfig).not.to.equal(config);
        expect(copyConfig.sslEnabled).to.equal(false);
        return expect(copyConfig.maxRetries).to.equal(0);
      });
      return it('should be able to pass credential values directly', function() {
        var config;
        config = new AWS.Config({
          accessKeyId: 'akid',
          secretAccessKey: 'secret',
          sessionToken: 'session'
        });
        expect(config.credentials.accessKeyId).to.equal('akid');
        expect(config.credentials.secretAccessKey).to.equal('secret');
        return expect(config.credentials.sessionToken).to.equal('session');
      });
    });
    describe('region', function() {
      var oldEnv;
      oldEnv = process.env;
      beforeEach(function(done) {
        process.env = {};
        return done();
      });
      afterEach(function() {
        return process.env = oldEnv;
      });
      it('defaults to undefined', function() {
        return expect(configure().region).not.to.exist;
      });
      if (AWS.util.isNode()) {
        it('grabs AWS_REGION from the env', function() {
          var config;
          process.env.AWS_REGION = 'us-west-2';
          config = new AWS.Config();
          return expect(config.region).to.equal('us-west-2');
        });
        it('also grabs AMAZON_REGION from the env', function() {
          var config;
          process.env.AMAZON_REGION = 'us-west-1';
          config = new AWS.Config();
          return expect(config.region).to.equal('us-west-1');
        });
        it('prefers AWS_REGION to AMAZON_REGION', function() {
          var config;
          process.env.AWS_REGION = 'us-west-2';
          process.env.AMAZON_REGION = 'us-west-1';
          config = new AWS.Config();
          return expect(config.region).to.equal('us-west-2');
        });
        describe('shared config file', function() {
          beforeEach(function() {
            var os;
            os = require('os');
            return helpers.spyOn(os, 'homedir').andReturn('/home/user');
          });
          it('grabs region from shared credentials file if AWS_SDK_LOAD_CONFIG is set', function() {
            var config;
            process.env.AWS_SDK_LOAD_CONFIG = '1';
            helpers.spyOn(AWS.util, 'readFileSync').andCallFake(function(path) {
              if (path.match(/[\/\\]home[\/\\]user[\/\\].aws[\/\\]credentials/)) {
                return '[default]\nregion = us-west-2';
              } else {
                return '[default]\nregion = eu-east-1';
              }
            });
            config = new AWS.Config();
            return expect(config.region).to.equal('us-west-2');
          });
          it('loads file from path specified in AWS_SHARED_CREDENTIALS_FILE if AWS_SDK_LOAD_CONFIG is set', function() {
            var config;
            process.env.AWS_SDK_LOAD_CONFIG = '1';
            process.env.AWS_SHARED_CREDENTIALS_FILE = '/path/to/user/config/file';
            helpers.spyOn(AWS.util, 'readFileSync').andCallFake(function(path) {
              if (path === '/path/to/user/config/file') {
                return '[default]\nregion = us-west-2';
              } else {
                return '[default]\nregion = eu-east-1';
              }
            });
            config = new AWS.Config();
            return expect(config.region).to.equal('us-west-2');
          });
          it('grabs region from shared config if AWS_SDK_LOAD_CONFIG is set', function() {
            var config;
            process.env.AWS_SDK_LOAD_CONFIG = '1';
            helpers.spyOn(AWS.util, 'readFileSync').andCallFake(function(path) {
              if (path.match(/[\/\\]home[\/\\]user[\/\\].aws[\/\\]config/)) {
                return '[default]\nregion = us-west-2';
              } else {
                return '[default]\naws_access_key_id = AKIAIOSFODNN7EXAMPLE\naws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
              }
            });
            config = new AWS.Config();
            return expect(config.region).to.equal('us-west-2');
          });
          it('loads file from path specified in AWS_CONFIG_FILE if AWS_SDK_LOAD_CONFIG is set', function() {
            var config;
            process.env.AWS_SDK_LOAD_CONFIG = '1';
            process.env.AWS_CONFIG_FILE = '/path/to/user/config/file';
            helpers.spyOn(AWS.util, 'readFileSync').andCallFake(function(path) {
              if (path === '/path/to/user/config/file') {
                return '[default]\nregion = us-west-2';
              } else {
                return '[default]\naws_access_key_id = AKIAIOSFODNN7EXAMPLE\naws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
              }
            });
            config = new AWS.Config();
            return expect(config.region).to.equal('us-west-2');
          });
          it('uses the profile specified in AWS_PROFILE', function() {
            var config;
            process.env.AWS_SDK_LOAD_CONFIG = '1';
            process.env.AWS_PROFILE = 'foo';
            helpers.spyOn(AWS.util, 'readFileSync').andCallFake(function(path) {
              if (path.match(/[\/\\]home[\/\\]user[\/\\].aws[\/\\]config/)) {
                return '[default]\nregion = us-west-1\n\n[profile foo]\nregion = us-west-2';
              } else {
                return '[default]\nregion = eu-east-1';
              }
            });
            config = new AWS.Config();
            return expect(config.region).to.equal('us-west-2');
          });
          return it('prefers AWS_REGION to the shared config file', function() {
            var config, mock;
            process.env.AWS_REGION = 'us-east-1';
            process.env.AWS_SDK_LOAD_CONFIG = '1';
            mock = '[default]\nregion = us-west-2';
            helpers.spyOn(AWS.util, 'readFileSync').andReturn(mock);
            config = new AWS.Config();
            return expect(config.region).to.equal('us-east-1');
          });
        });
      }
      return it('can be set to a string', function() {
        return expect(configure({
          region: 'us-west-1'
        }).region).to.equal('us-west-1');
      });
    });
    describe('maxRetries', function() {
      it('defaults to unefined', function() {
        return expect(configure().maxRetries).to.equal(void 0);
      });
      return it('can be set to an integer', function() {
        return expect(configure({
          maxRetries: 2
        }).maxRetries).to.equal(2);
      });
    });
    describe('retryDelayOptions', function() {
      return it('can set "base" to an integer', function() {
        return expect(configure({
          retryDelayOptions: {
            base: 30
          }
        }).retryDelayOptions).to.eql({
          base: 30
        });
      });
    });
    describe('paramValidation', function() {
      return it('defaults to true', function() {
        return expect(configure().paramValidation).to.equal(true);
      });
    });
    describe('computeChecksums', function() {
      return it('defaults to true', function() {
        return expect(configure().computeChecksums).to.equal(true);
      });
    });
    describe('sslEnabled', function() {
      it('defaults to true', function() {
        return expect(configure().sslEnabled).to.equal(true);
      });
      return it('can be set to false', function() {
        return expect(configure({
          sslEnabled: false
        }).sslEnabled).to.equal(false);
      });
    });
    describe('httpOptions', function() {
      return it('defaults to {timeout:120000}', function() {
        return expect(configure().httpOptions).to.eql({
          timeout: 120000
        });
      });
    });
    describe('systemClockOffset', function() {
      return it('defaults to 0', function() {
        return expect(configure().systemClockOffset).to.equal(0);
      });
    });
    describe('correctClockSkew', function() {
      return it('defaults to false', function() {
        return expect(configure().correctClockSkew).to.equal(false);
      });
    });
    describe('customUserAgent', function() {
      return it('defaults to null', function() {
        return expect(configure().customUserAgent).to.equal(null);
      });
    });
    describe('useAccelerateEndpoint', function() {
      return it('defaults to false', function() {
        return expect(configure().useAccelerateEndpoint).to.equal(false);
      });
    });
    describe('s3DisableBodySigning', function() {
      return it('defaults to true', function() {
        return expect(configure().s3DisableBodySigning).to.equal(true);
      });
    });
    describe('set', function() {
      it('should set a default value for a key', function() {
        var config;
        config = new AWS.Config();
        config.set('maxRetries', void 0, 'DEFAULT');
        return expect(config.maxRetries).to.equal('DEFAULT');
      });
      it('should execute default value if it is a function', function() {
        var config, mock;
        mock = helpers.createSpy();
        config = new AWS.Config();
        config.set('maxRetries', void 0, mock);
        return expect(mock.calls.length).not.to.equal(0);
      });
      return it('should not expand default value function if value is present', function() {
        var config, mock;
        mock = helpers.createSpy();
        config = new AWS.Config();
        config.set('maxRetries', 'VALUE', mock);
        return expect(mock.calls.length).to.equal(0);
      });
    });
    describe('clear', function() {
      return it('should be able to clear all key values from a config object', function() {
        var config;
        config = new AWS.Config({
          credentials: {},
          maxRetries: 300,
          sslEnabled: 'foo'
        });
        expect(config.maxRetries).to.equal(300);
        expect(config.sslEnabled).to.equal('foo');
        expect(config.credentials).not.to.equal(void 0);
        config.clear();
        expect(config.maxRetries).to.equal(void 0);
        expect(config.sslEnabled).to.equal(void 0);
        expect(config.credentials).not.to.equal(void 0);
        return expect(config.credentialProvider).not.to.equal(void 0);
      });
    });
    describe('update', function() {
      it('should be able to update keyed values', function() {
        var config;
        config = new AWS.Config();
        expect(config.maxRetries).to.equal(void 0);
        config.update({
          maxRetries: 10
        });
        return expect(config.maxRetries).to.equal(10);
      });
      it('should ignore non-keyed values', function() {
        var config;
        config = new AWS.Config();
        config.update({
          foo: 10
        });
        return expect(config.foo).to.equal(void 0);
      });
      describe('should allow', function() {
        var allServices, className, ctor, results, serviceIdentifier;
        allServices = require('../clients/all');
        results = [];
        for (className in allServices) {
          if (!hasProp.call(allServices, className)) continue;
          ctor = allServices[className];
          serviceIdentifier = className.toLowerCase();
          results.push((function(id) {
            return it(id + ' to be set', function() {
              var config, params;
              config = new AWS.Config();
              params = {};
              params[id] = {
                endpoint: 'localhost'
              };
              config.update(params);
              return expect(config[id]).to.eql({
                endpoint: 'localhost'
              });
            });
          })(serviceIdentifier));
        }
        return results;
      });
      it('allows unknown keys if allowUnknownKeys is set', function() {
        var config;
        config = new AWS.Config();
        config.update({
          foo: 10
        }, true);
        return expect(config.foo).to.equal(10);
      });
      it('should be able to update literal credentials', function() {
        var config;
        config = new AWS.Config();
        config.update({
          accessKeyId: 'akid',
          secretAccessKey: 'secret',
          sessionToken: 'session'
        });
        expect(config.credentials.accessKeyId).to.equal('akid');
        expect(config.credentials.secretAccessKey).to.equal('secret');
        return expect(config.credentials.sessionToken).to.equal('session');
      });
      return it('should deep merge httpOptions', function() {
        var config;
        config = new AWS.Config();
        config.update({
          httpOptions: {
            timeout: 1
          }
        });
        config.update({
          httpOptions: {
            xhrSync: true
          }
        });
        expect(config.httpOptions.timeout).to.equal(1);
        return expect(config.httpOptions.xhrSync).to.equal(true);
      });
    });
    return describe('getCredentials', function() {
      var config, expectError, expectValid, spy;
      spy = null;
      config = null;
      beforeEach(function(done) {
        spy = helpers.createSpy('getCredentials callback');
        return done();
      });
      expectValid = function(options, key) {
        if (options instanceof AWS.Config) {
          config = options;
        } else {
          config = new AWS.Config(options);
        }
        config.getCredentials(spy);
        expect(spy.calls.length).not.to.equal(0);
        expect(spy.calls[0]["arguments"][0]).not.to.exist;
        if (key) {
          return expect(config.credentials.accessKeyId).to.equal(key);
        }
      };
      expectError = function(options, message) {
        if (options instanceof AWS.Config) {
          config = options;
        } else {
          config = new AWS.Config(options);
        }
        config.getCredentials(spy);
        expect(spy.calls.length).not.to.equal(0);
        expect(spy.calls[0]["arguments"][0].code).to.equal('CredentialsError');
        expect(spy.calls[0]["arguments"][0].name).to.equal('CredentialsError');
        return expect(spy.calls[0]["arguments"][0].message).to.equal(message);
      };
      it('should check credentials for static object first', function() {
        return expectValid({
          credentials: {
            accessKeyId: '123',
            secretAccessKey: '456'
          }
        });
      });
      it('should error if static credentials are not available', function() {
        return expectError({
          credentials: {}
        }, 'Missing credentials');
      });
      it('should check credentials for async get() method', function() {
        return expectValid({
          credentials: {
            get: function(cb) {
              return cb();
            }
          }
        });
      });
      it('should error if credentials.get() cannot resolve', function() {
        var error, options;
        error = new Error('Error!');
        error.code = 'FooError';
        error.name = 'BarError';
        options = {
          credentials: {
            constructor: {
              name: 'CustomCredentials'
            },
            get: function(cb) {
              return cb(error, null);
            }
          }
        };
        return expectError(options, 'Could not load credentials from CustomCredentials');
      });
      it('should check credentialProvider if no credentials', function() {
        return expectValid({
          credentials: null,
          credentialProvider: {
            resolve: function(cb) {
              return cb(null, {
                accessKeyId: 'key',
                secretAccessKey: 'secret'
              });
            }
          }
        });
      });
      it('should error if credentialProvider fails to resolve', function() {
        var error, options;
        error = new Error('Error!');
        error.code = 'FooError';
        error.name = 'BarError';
        options = {
          credentials: null,
          credentialProvider: {
            resolve: function(cb) {
              return cb(error, null);
            }
          }
        };
        return expectError(options, 'Could not load credentials from any providers');
      });
      return it('should error if no credentials or credentialProvider', function() {
        var options;
        options = {
          credentials: null,
          credentialProvider: null
        };
        return expectError(options, 'No credentials to load');
      });
    });
  });

  describe('AWS.config', function() {
    it('should be a default Config object', function() {
      expect(AWS.config.sslEnabled).to.equal(true);
      return expect(AWS.config.maxRetries).to.equal(void 0);
    });
    it('can set default config to an object literal', function() {
      var oldConfig;
      oldConfig = AWS.config;
      AWS.config = {};
      expect(AWS.config).to.eql({});
      return AWS.config = oldConfig;
    });
    describe('setPromisesDependency', function() {
      it('updates promise support on requests', function() {
        var utilSpy;
        utilSpy = helpers.spyOn(AWS.util, 'addPromises');
        AWS.config.setPromisesDependency(function() {});
        expect(utilSpy.calls.length).to.equal(1);
        expect(Array.isArray(utilSpy.calls[0]["arguments"][0])).to.be["true"];
        return expect(utilSpy.calls[0]["arguments"][0].length).to.equal(4);
      });
      if (typeof Promise !== 'undefined') {
        return it('reverts to native promises when null is passed', function() {
          var P, utilSpy;
          P = function() {};
          utilSpy = helpers.spyOn(AWS.util, 'addPromises');
          AWS.config.setPromisesDependency(P);
          expect(utilSpy.calls[0]["arguments"][1] === P).to.be["true"];
          AWS.config.setPromisesDependency(null);
          expect(utilSpy.calls[1]["arguments"][1] === Promise).to.be["true"];
          return expect(utilSpy.calls[1]["arguments"][1] === P).to.be["false"];
        });
      }
    });
    return describe('getPromisesDependency', function() {
      return it('returns PromisesDependency if set', function() {
        var P, dep;
        AWS.config.setPromisesDependency();
        expect(AWS.config.getPromisesDependency()).to.be.undefined;
        P = function() {};
        AWS.config.setPromisesDependency(P);
        dep = AWS.config.getPromisesDependency();
        return expect(dep).to.equal(P);
      });
    });
  });

}).call(this);

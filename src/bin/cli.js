import ApolloClient, { createNetworkInterface } from 'apollo-client';

import Preferences from 'preferences';
import chalk from 'chalk';
import createLogger from 'cli-logger';
// eslint-disable-next-line no-unused-vars
import fetch from 'isomorphic-fetch';
import md5 from 'md5';
import request from 'request';
import url from 'url';

export const SERVER = process.env.CRYPTID_SERVER || 'https://cryptid.adorable.io';
export const LOGGER = createLogger({ level: createLogger.INFO });

function buildUrl(uri) {
  return url.resolve(SERVER, uri);
}

function loadSettings() {
  let name = `com.adorable.cryptid.${md5(SERVER)}`;
  let settings = new Preferences(name, { server: SERVER, token: '', email: '' });

  let loggedIn = settings.token.length > 0 && settings.email.length > 0;
  settings.loggedIn = loggedIn;
  settings.checkLogin = () => {
    if (!loggedIn) {
      LOGGER.info(chalk.red('You must first login with "cryptid login"'));
      process.exit(1);
    }
  };
  settings.clear = function() {
    this.token = '';
    this.email = '';
    this.loggedIn = false;
    delete this.checkLogin;
  };
  settings.setData = function(token, email) {
    this.token = token;
    this.email = email;
  };

  return settings;
}
export const SETTINGS = loadSettings();
export const TOKEN = SETTINGS.token;

function checkError(error) {
  if (error) {
    switch (error.code) {
      case 'ENOTFOUND':
        LOGGER.info(chalk.red(`Could not reach cryptid server. Is ${SERVER} reachable?`));
        break;
      case 'ECONNREFUSED':
        LOGGER.info(chalk.red(`Could not reach cryptid server. Is ${SERVER} reachable?`));
        break;
      default:
        LOGGER.error(chalk.red(`An error occurred communicating with ${SERVER}`));
        break;
    }
    process.exit(1);
  }
}

/* =========================================================
 *
 *  GraphQL Functions
 *
 *  ========================================================= */

export function buildGQLClient() {
  return new ApolloClient({
    networkInterface: createNetworkInterface({
      uri: url.resolve(SERVER, '/api/reports'),
      opts: {
        headers: { Authorization: `Token token=${TOKEN}` }
      }
    })
  });
}

/* =========================================================
 *
 *  Cryptid Service Functions
 *
 * ========================================================= */

export function login(username, password) {
  let options = {
    url: buildUrl('/api/sessions'),
    method: 'post',
    json: {
      user: {
        email: username,
        password: password,
      }
    }
  };

  request(options, (error, response, body) => {

    if (response.statusCode === 201) {
      SETTINGS.setData(body.data.token, username);
      process.exit(0);
    } else {
      LOGGER.info(chalk.red('Invalid password'));
      process.exit(1);
    }
  });
}

export function fetchCurrentUser(callback) {
  let options = {
    url: buildUrl('/api/users/current'),
    method: 'get',
    json: true,
    headers: { Authorization: `Token token=${TOKEN}` }
  };

  request(options, (error, response, body) => {
    checkError(error);
    callback(response, body);
  });
}

export function createAccount(accountName, callback) {
  let options = {
    url: buildUrl('/api/accounts'),
    method: 'post',
    headers: { Authorization: `Token token=${TOKEN}` },
    json: {
      account: {
        name: accountName
      }
    }
  };

  request(options, (error, response, body) => {
    checkError(error);
    callback(response, body);
  });
}

export function updateAccount(accountId, accountName, callback) {
  let options = {
    url: buildUrl(`/api/accounts/${accountId}`),
    method: 'put',
    headers: { Authorization: `Token token=${TOKEN}` },
    json: {
      account: {
        name: accountName
      }
    }
  };

  request(options, (error, response, body) => {
    checkError(error);
    callback(response, body);
  });
}

export function addUserToAccount(accountId, email, callback) {
  let options = {
    url: buildUrl(`/api/accounts/${accountId}/users`),
    method: 'post',
    headers: { Authorization: `Token token=${TOKEN}` },
    json: {
      user: {
        email: email
      }
    }
  };

  request(options, (error, response, body) => {
    checkError(error);
    callback(response, body);
  });
}

export function updatePassword(passwords, callback) {
  let { currentPassword, newPassword, newPasswordConfirm } = passwords;

  let options = {
    url: buildUrl('/api/users/current'),
    method: 'put',
    headers: { Authorization: `Token token=${TOKEN}` },
    json: {
      user: {
        currentPassword: currentPassword,
        password: newPassword,
        passwordConfirmation: newPasswordConfirm,
      }
    }
  };

  request(options, (error, response, body) => {
    checkError(error);
    callback(response, body);
  });
}

export function createProduct(accountId, productName, callback) {
  let options = {
    url: buildUrl(`/api/accounts/${accountId}/products`),
    method: 'post',
    headers: { Authorization: `Token token=${TOKEN}` },
    json: {
      product: {
        name: productName
      }
    }
  };

  request(options, (error, response, body) => {
    checkError(error);
    callback(response, body);
  });
}

export function updateProduct(data, callback) {
  let { accountId, productId, productName } = data;

  let options = {
    url: buildUrl(`/api/accounts/${accountId}/products/${productId}`),
    method: 'put',
    headers: { Authorization: `Token token=${TOKEN}` },
    json: {
      product: {
        name: productName
      }
    }
  };

  request(options, (error, response, body) => {
    checkError(error);
    callback(response, body);
  });
}

export function createProperty(data, callback) {
  let {
    accountId,
    productId,
    propertyName,
    propertyType,
  } = data;

  let options = {
    url: buildUrl(`/api/accounts/${accountId}/products/${productId}/properties`),
    method: 'post',
    headers: { Authorization: `Token token=${TOKEN}` },
    json: {
      property: {
        name: propertyName,
        propertyType: propertyType
      }
    }
  };

  request(options, (error, response, body) => {
    checkError(error);
    callback(response, body);
  });
}

export function updateProperty(data, callback) {
  let {
    accountId,
    productId,
    propertyName,
    propertyId,
  } = data;

  let options = {
    url: buildUrl(`/api/accounts/${accountId}/products/${productId}/properties/${propertyId}`),
    method: 'put',
    headers: { Authorization: `Token token=${TOKEN}` },
    json: {
      property: {
        name: propertyName,
      }
    }
  };

  request(options, (error, response, body) => {
    checkError(error);
    callback(response, body);
  });
}

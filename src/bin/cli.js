import Preferences from 'preferences';
import chalk from 'chalk';
import createLogger from 'cli-logger';
import request from 'request';
import url from 'url';

export const server = process.env.CRYPTID_SERVER || 'https://cryptid.adorable.io';

function buildUrl(path) {
  return url.resolve(server, path);
}

function loadPreferences() {
  let prefs = new Preferences('com.adorable.cryptid', {
    account: { token: '', email: '' },
  });

  let account = prefs.account;
  prefs.isLoggedIn = account.token.length > 0 && account.email.length > 0;
  prefs.needsLogin = !prefs.isLoggedIn;

  return prefs;
}
export const preferences = loadPreferences();

function getAppToken() {
  return preferences.account.token;
}

export const logger = createLogger({level: createLogger.INFO});

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
      preferences.account.token = body.data.token;
      preferences.account.email = username;

      process.exit(0);
    } else {
      logger.info(chalk.red('Invalid password'));
    }
  });
}

export function fetchCurrentUser(callback) {
  let options = {
    url: buildUrl('/api/users/current'),
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token token=${getAppToken()}`
    }
  };
  request(options, callback);
}

export function createAccount(accountName, callback) {
  let options = {
    url: buildUrl('/api/accounts'),
    method: 'post',
    headers: {
      Authorization: `Token token=${getAppToken()}`
    },
    json: {
      account: {
        name: accountName
      }
    }
  };
  request(options, callback);
}

export function updateAccount(accountId, accountName, callback) {
  let options = {
    url: buildUrl(`/api/accounts/${accountId}`),
    method: 'put',
    headers: {
      Authorization: `Token token=${getAppToken()}`
    },
    json: {
      account: {
        name: accountName
      }
    }
  };
  request(options, callback);
}

export function addUserToAccount(accountId, email, callback) {
  let options = {
    url: buildUrl(`/api/accounts/${accountId}/users`),
    method: 'post',
    headers: {
      Authorization: `Token token=${getAppToken()}`
    },
    json: {
      user: {
        email: email
      }
    }
  };
  request(options, callback);
}

export function updatePassword(currentPassword, newPassword, callback) {
  let options = {
    url: buildUrl('/api/users/current'),
    method: 'put',
    headers: {
      Authorization: `Token token=${getAppToken()}`
    },
    json: {
      user: {
        password: newPassword,
        password_confirmation: newPassword,
      }
    }
  };
  request(options, callback);
}

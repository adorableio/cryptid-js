import Preferences from 'preferences';
import chalk from 'chalk';
import createLogger from 'cli-logger';
import md5 from 'md5';
import request from 'request';
import url from 'url';

export const SERVER = process.env.CRYPTID_SERVER || 'https://cryptid.adorable.io';
export const LOGGER = createLogger({level: createLogger.INFO});

function buildUrl(path) {
  return url.resolve(SERVER, path);
}

function loadSettings() {
  let name = `com.adorable.cryptid.${md5(SERVER)}`;
  let settings = new Preferences(name, {server: SERVER, token: '', email: ''});

  let loggedIn = settings.token.length > 0 && settings.email.length > 0;
  settings.loggedIn = loggedIn;
  settings.checkLogin = () => {
    if (!loggedIn) {
      LOGGER.info(chalk.red('You must first login with "cryptid login"'));
      process.exit(1);
    }
  };

  return settings;
}
export const SETTINGS = loadSettings();
export const TOKEN = SETTINGS.token;

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
    if (error && error.code === 'ENOTFOUND') {
      LOGGER.info(chalk.red(`Could not reach cryptid server. Is ${SERVER} reachable?`));
      process.exit(1);
    }

    if (response.statusCode === 201) {
      SETTINGS.token = body.data.token;
      SETTINGS.email = username;

      process.exit(0);
    } else {
      LOGGER.info(chalk.red('Invalid password'));
    }
  });
}

export function fetchCurrentUser(callback) {
  let options = {
    url: buildUrl('/api/users/current'),
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token token=${TOKEN}`
    }
  };
  request(options, callback);
}

export function createAccount(accountName, callback) {
  let options = {
    url: buildUrl('/api/accounts'),
    method: 'post',
    headers: {
      Authorization: `Token token=${TOKEN}`
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
      Authorization: `Token token=${TOKEN}`
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
      Authorization: `Token token=${TOKEN}`
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
      Authorization: `Token token=${TOKEN}`
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

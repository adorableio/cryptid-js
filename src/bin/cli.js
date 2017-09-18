import Preferences from 'preferences';
import chalk from 'chalk';
import request from 'request';
import url from 'url';

function buildUrl(path) {
  return url.resolve(getServer(), path);
}

export function getPreferences() {
  let prefs = new Preferences('com.adorable.cryptid', {
    account: { token: '', email: '' },
  });

  let account = prefs.account;
  prefs.isLoggedIn = account.token.length > 0 && account.email.length > 0;
  prefs.needsLogin = !prefs.isLoggedIn;

  return prefs;
}

export function getServer() {
  return process.env.CRYPTID_SERVER || 'https://cryptid.adorable.io';
}

export function login(username, password) {
  let url = buildUrl('/api/sessions');
  let options = {
    url: url,
    method: 'post',
    json: {
      user: {
        email: username,
        password: password,
      }
    }
  };
  request(options, (error, response, body) => {
    if (response.statusCode == 201) {
      let prefs = getPreferences();
      prefs.account.token = body.data.token;
      prefs.account.email = username;

      console.log(chalk.green('Logged in'));
    } else {
      console.log(chalk.red('Error logging in.'));
    }
  });
}

export function fetchCurrentUser(token, callback) {
  let url = buildUrl('/api/users/current');
  let options = {
    url: url,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token token=${token}`
    }
  };
  request(options, callback);
}

export function createAccount(accountName, callback) {
  let url = buildUrl('/api/accounts');
  let token = getPreferences().account.token;
  let options = {
    url: url,
    method: 'post',
    headers: {
      Authorization: `Token token=${token}`
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
  let url = buildUrl(`/api/accounts/${accountId}`);
  let token = getPreferences().account.token;
  let options = {
    url: url,
    method: 'put',
    headers: {
      Authorization: `Token token=${token}`
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
  let url = buildUrl(`/api/accounts/${accountId}/users`);
  let token = getPreferences().account.token;
  let options = {
    url: url,
    method: 'post',
    headers: {
      Authorization: `Token token=${token}`
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
  let url = buildUrl('/api/users/current');
  let token = getPreferences().account.token;
  let options = {
    url: url,
    method: 'put',
    headers: {
      Authorization: `Token token=${token}`
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

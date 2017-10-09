# cryptid-js

Javascript client for Cryptid Analytics

This library should be used to integrate [Cryptid
Analytics](https://cryptid.adorable.io) into web-based javascript applications
(React, Vue, etc. or a simple script tag at the bottome of a static page.)

For [React Native](https://facebook.github.io/react-native/) javascript
projects, use
[cryptid-react-native](https://github.com/adorableio/cryptid-react-native),
which will gather device information rather than browser information.

## Install

To install into a project:

```bash
npm install cryptid --save
```

To install for CLI usage only:

```bash
npm install cryptid --global
```

## Configure

Create a new `Tracker` using the `trackerId` of the property you're tracking.

```javascript
import Tracker from 'cryptid';

const tracker = new Tracker('web|AB5A928D-7244-4A07-9653-E4557C500C53')
```

You may also supply additional options as a second argument. They will be
passed through to the [reqwest](https://github.com/ded/reqwest) ajax call.

```javascript
import Tracker from 'cryptid';

const tracker = new Tracker('web|AB5A928D-7244-4A07-9653-E4557C500C53', {
  success: (response) => console.log(response),
  error: (err) => console.error(err),
});
```

### React/Redux

In a react+redux application, you may want to consider intializing a `Tracker`
instance in your store, and then tracking events when actions are fired or when
reducers commit changes to the store.


## Use

**`Tracker` has one method: `send`**, which is used to send an event to the
cryptid service. When you call `send` the library gathers browser metadata to
include with the event data you supply. All of this metadata may be overridden
by fields you include on the event object (see the [Events](#events) section
below.)

Simple example:

```javascript
tracker.send({eventValue: 'button-clicked'});
```

More complex:

```javascript
tracker.send({
  eventCategory: 'eCommerce',
  eventAction: 'checkout',
  eventValue: 'checkout-initiated',
  customField1: 'abc123456789', // user id
  customField2: 5, // items in cart
  customField3: 'email', // referral code
});
```

### Events

List of fields that can be included in the event object:

| Field | Description | Required? | Example |
|-------|-------------|-----------|---------|
| `eventCategory` | Category of the event | No | `Authentication` |
| `eventAction` | Action or workflow the event occured during | No | `Login` |
| `eventLabel` | Label of the event | No | `form-submission` |
| `eventValue` | Value of the event | Yes | `button-click` or `enter-key` |
| `customField_1` | Custom data | No | |
| `customField_2` | Custom data | No | |
| `customField_3` | Custom data | No | |
| `customField_4` | Custom data | No | |
| `customField_5` | Custom data | No | |

**You may use the Category, Action, Label and Value event fields any way that
you'd like in your application**; they exist merely to allow for an event
taxonomy that works for you. The simplest way to use them is to only supply an
event value such as `login-successful`. If you don't need anything more
complicated, you may omit the rest of the fields.

Likewise, the `customField` values are there to log supplemental application
information that may bes useful to you, but are not required by the `send`
event or the service.

List of browser metadata fields that are automatically collected and may be
overridden by including them in the event object:

| Field | Description | Exammple |
|-------|-------------|
| `documentLocationUrl` | URL of the page | `http://example.org/foo.html` |
| `documentReferer` | Referrer (if any) of the page | `http://google.com` |
| `documentEncoding` | The character set used on the page  | `UTF-8` |
| `documentTitle` | The title of the page | `My Cool Application >  Login` |
| `documentHostname` | The hostname the page was served from | `example.org` |
| `documentPath` | The document path of the page | `/foo.html` |
| `userLanguage` | The configured language of the browser | `en-US` |
| `screenResolution` | The resolution of the display | `2560x1417` |
| `viewportSize` | The viewable size of the browser at the time of the event | `2560x1440` |
| `screenColors` | The screen color depth | `24` |

## CLI Client

Installing the `cryptid` module also gives you access to a command-line admin
client to the cryptid analytics service.

Login to the service with:

```bash
$(npm bin)/cryptid login
```

And then all functionality should be available. View available commands with:

```bash
$(npm bin)/cryptid -h
```


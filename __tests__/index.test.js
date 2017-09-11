// const Tracker = require('../src');
import Tracker from '../src';

jest.mock('reqwest');
jest.mock('../src/browser');

describe('constructor', function() {
  it('sets the trackerId', function() {
    const tracker = new Tracker('123', {});
    expect(tracker.trackerId).toEqual('123');
  });

  it('stores options', function() {
    const tracker = new Tracker('123', { "hello": "there" });
    expect(tracker.options).toMatchObject({ "hello": "there" });
  });
});

describe('#track', () => {
  let tracker, options, trackerId, event;

  beforeEach(() => {
    trackerId = "web|123456789";
    options = { url: "aspen.org", method: "get" };
    tracker = new Tracker(trackerId, options);
    event = { eventValue: 'button-click', userLanguage: "en-GB" };
  });

  it('merges supplied event data with browser metadata', () => {
    tracker.send(event);
    expect(tracker.reqwest).toBeCalledWith(expect.objectContaining({
      data: {
        event: expect.objectContaining({
          documentLocationUrl: "http://example.org/hello/world.html",
          eventValue: "button-click",
          userLanguage: "en-GB",
        })
      }
    }));
  });

  it('merges supplied request options with default values', () => {
    tracker.send(event);
    expect(tracker.reqwest).toBeCalledWith(expect.objectContaining({
      method: "get",
      url: "aspen.org"
    }));
  });
});
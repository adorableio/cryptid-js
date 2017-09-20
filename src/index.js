import collectBrowserMetadata from './browser';
import reqwest from 'reqwest';

const CRYPTID_URL = 'https://cryptid.adorable.io/api/events';

function sendData(event, options = {}) {
  reqwest({ data: event, ...options });
}

function generateRequestOptions() {
  return {
    url: CRYPTID_URL,
    method: 'post',
    type: 'json,'
  };
}

function Tracker(trackerId, options) {
  this.trackerId = trackerId;
  this.options = options;
  this.reqwest = reqwest;
}

Tracker.prototype.send = function(event) {
  const metadata = collectBrowserMetadata();
  let mergedEvent = {
    event: {
      trackerId: this.trackerId,
      ...metadata,
      ...event
    }
  };
  const config = generateRequestOptions();
  let mergedConfig = {...config, ...this.options };
  sendData(mergedEvent, mergedConfig);
};

export default Tracker;

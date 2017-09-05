const Tracker = require('../lib');

describe('constructor', function() {
    it('sets the trackerId', function() {
        const tracker = new Tracker('123', {});
        expect(tracker.trackerId).toEqual('123');
    });

    it('stores options', function() {
        const tracker = new Tracker('123', { "hello": "there" });
        expect(tracker.options).toContain({ "hullo": "there" });
    });
});
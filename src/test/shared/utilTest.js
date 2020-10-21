const mocha = require('mocha');
const expect = require('chai').expect;
const util = require('../../shared/util');

let createDefaultObject = function () {
  return {
    a: 0,
    arr: [0, 0, 0],
    func: function () {},
    bool: false,
    str: '0',
    null: null,
    undefined: undefined,
  };
};

let increment = (value) => value + 1;

describe('util', function () {
  describe('#isObject()', function () {
    it('Should be an object', function () {
      expect(util.isObject({ a: 1 })).to.equal(true);
    });

    it('Should not be an object (array)', function () {
      expect(util.isObject([])).to.equal(false);
    });

    it('Should not be an object (function)', function () {
      expect(util.isObject(function () {})).to.equal(false);
    });

    it('Should not be an object (number)', function () {
      expect(util.isObject(0)).to.equal(false);
    });
  });

  describe('#isArray()', function () {
    it('Should be an array', function () {
      expect(util.isArray([])).to.equal(true);
    });

    it('Should not be an array (object)', function () {
      expect(util.isArray({})).to.equal(false);
    });
  });

  describe('#isFunction()', function () {
    it('Should be a function', function () {
      expect(util.isFunction(function () {})).to.equal(true);
    });

    it('Should not be a function (object)', function () {
      expect(util.isFunction({})).to.equal(false);
    });
  });

  describe('#deepMapNumber()', function () {
    let mockObject;
    beforeEach(function () {
      mockObject = createDefaultObject();
    });

    it('Should not modify original object', function () {
      util.deepMapNumber(mockObject, increment);
      expect(mockObject.a).to.equal(0);
    });

    it('Should increment all Numbers by 1', function () {
      let mapped = util.deepMapNumber(mockObject, increment);
      expect(mapped.a).to.equal(1);
    });

    it('Should increment every Array value by 1', function () {
      let mapped = util.deepMapNumber(mockObject, increment);
      for (let i = 0; i < mapped.arr.length; i++) {
        expect(mapped.arr[i]).to.equal(1);
      }
    });

    it('Should ignore other types', function () {
      let mapped = util.deepMapNumber(mockObject, increment);
      expect(mapped.func.toString()).to.equal(mockObject.func.toString());
      expect(mapped.bool).to.equal(false);
      expect(mapped.str).to.equal('0');
      expect(mapped.null).to.equal(null);
      expect(typeof mapped.undefined).to.equal('undefined');
    });

    it('Should map nested objects', function () {
      mockObject.nested = { a: 0, arr: [0, 0, 0] };
      let mapped = util.deepMapNumber(mockObject, increment);
      expect(mapped.nested.a).to.equal(1);
      for (let i = 0; i < mapped.arr.length; i++) {
        expect(mapped.nested.arr[i]).to.equal(1);
      }
    });
  });

  describe('#getDateRange()', function () {
    let dateRange = {
      start: '2019-06-30',
      end: '2019-08-10',
    };

    it('should return all dates that will show on calendar', function () {
      let range = util.getDateRange('2019-07-15');
      expect(range.start).to.equal(dateRange.start);
      expect(range.end).to.equal(dateRange.end);
    });
  });

  describe('#isValidDateString()', function () {
    it('should reject dates not in YYYY-MM-DD format (length)', function () {
      let invalidDateLong = '2019-11-010';
      let invalidDateShort = '209-1-010';
      expect(util.isValidDateString(invalidDateLong)).to.equal(false);
      expect(util.isValidDateString(invalidDateShort)).to.equal(false);
    });

    it('should reject dates not in YYYY-MM-DD format (Invalid values)', function () {
      let invalidDateShifted = '201-901-11';
      let invalidDateNumSegments = '2-1-901-11';
      let invalidDateMonth = '2019-13-11';
      let invalidDateDay = '2019-12-32';
      let invalidDateLeapYear = '2019-02-29';
      expect(util.isValidDateString(invalidDateShifted)).to.equal(false);
      expect(util.isValidDateString(invalidDateNumSegments)).to.equal(false);
      expect(util.isValidDateString(invalidDateMonth)).to.equal(false);
      expect(util.isValidDateString(invalidDateDay)).to.equal(false);
      expect(util.isValidDateString(invalidDateLeapYear)).to.equal(false);
    });
  });
});

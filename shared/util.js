const dateFns = require('date-fns');

let util = {};

// A deep mapping function that maps all numbers to a new value
// based on the mapping function.
// Does not map any other types.
util.deepMapNumber = function(item, mapFunc) {
    if (this.isObject(item)) {
        let clone = Object.assign({}, item);
        Object.entries(clone).forEach(([key, value]) => {
            clone[key] = this.deepMapNumber(value, mapFunc);
        });
        return clone;       
    }
    else if (this.isArray(item)) {
        return item.map((arrItem) => this.deepMapNumber(arrItem, mapFunc));
    }

    else if (this.isNumber(item)) {
        return mapFunc(item);
    }

	else {
		return item;
	}
}

util.getDateRange = function(dateStr) {
    let formatString = 'YYYY-MM-DD';
    let date = dateFns.parse(dateStr);
    let startOfMonth = dateFns.startOfMonth(date);
    // Sometimes we show dates from the previous month
    // to fill the calendar 
    let visibleStart = dateFns.setDay(startOfMonth, 0);
    let visibleEnd = dateFns.addDays(visibleStart, 41);

    return {
        'start': dateFns.format(visibleStart, formatString),
        'end': dateFns.format(visibleEnd, formatString)
    }
}

util.isObject = function(item) {
    return Object.prototype.toString.call(item) === "[object Object]";
}

util.isArray = function(item) {
    return Object.prototype.toString.call(item) === "[object Array]";
}

util.isFunction = function(item) {
    return Object.prototype.toString.call(item) === "[object Function]";
}

util.isNumber = function(item) {
    return typeof item === 'number';
}

module.exports = util;
'use strict';

var test = require('tape');
var isDataView = require('../');

var hasToStringTag = require('has-tostringtag/shams')();
var generators = require('make-generator-function')();
var arrowFns = require('make-arrow-function').list();
var forEach = require('for-each');
var v = require('es-value-fixtures');
var inspect = require('object-inspect');
var availableTypedArrays = require('available-typed-arrays')();

test('not DataViews', function (t) {
	forEach(v.primitives.concat(
		v.objects,
		function () {},
		generators,
		arrowFns,
		[]
	), function (nonDV) {
		t.equal(
			isDataView(nonDV),
			false,
			inspect(nonDV) + ' is not a DataView'
		);
	});

	forEach(availableTypedArrays, function (typedArray) {
		var TA = global[typedArray];
		var ta = new TA(8);
		t.equal(isDataView(ta), false, inspect(ta) + ' is not a DataView');
	});

	t.end();
});

test('@@toStringTag', { skip: !hasToStringTag }, function (t) {
	forEach(availableTypedArrays, function (typedArray) {
		var fakeTypedArray = [];
		fakeTypedArray[Symbol.toStringTag] = typedArray;
		t.notOk(isDataView(fakeTypedArray), 'faked ' + typedArray + ' is not typed array');
	});

	t.end();
});

test('Data Views', { skip: typeof DataView !== 'function' }, function (t) {
	var ab = new ArrayBuffer(1);
	var dv = new DataView(ab);

	t.equal(isDataView(dv), true, inspect(dv) + 'is a DataView');

	t.end();
});

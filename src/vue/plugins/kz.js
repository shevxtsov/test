(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue2-datepicker')) :
	typeof define === 'function' && define.amd ? define(['vue2-datepicker'], factory) :
	(global = global || self, (global.DatePicker = global.DatePicker || {}, global.DatePicker.lang = global.DatePicker.lang || {}, global.DatePicker.lang.ru = factory(global.DatePicker)));
}(this, (function (DatePicker) { 'use strict';

	DatePicker = DatePicker && DatePicker.hasOwnProperty('default') ? DatePicker['default'] : DatePicker;

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var ru = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = void 0;
	var locale = {
	  months: ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'],
	  monthsShort: ['қаңт.', 'ақп.', 'наур.', 'сәу.', 'мам.', 'маус.', 'шіл.', 'там.', 'қырк.', 'қаз.', 'қар.', 'желт.'],
	  weekdays: ['жексенбi', 'дүйсенбi', 'сейсенбi', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі'],
	  weekdaysShort: ['жс', 'дс', 'сс', 'ср', 'бс', 'жм', 'сн'],
	  weekdaysMin: ['жс', 'дс', 'сс', 'ср', 'бс', 'жм', 'сн'],
	  firstDayOfWeek: 1,
	  firstWeekContainsDate: 1
	};
	var _default = locale;
	exports["default"] = _default;
	module.exports = exports.default;
	});

	var ru$1 = unwrapExports(ru);

	var lang = {
	  formatLocale: ru$1,
	  yearFormat: 'YYYY',
	  monthFormat: 'MMM',
	  monthBeforeYear: true
	};
	DatePicker.locale('kz', lang);

	return lang;

})));
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var fields = require('./includes/fields');
var pagination = require('./includes/pagination');
var state = require('./includes/state');
var plugin = require('./includes/plugin');


(function ( $ ) {
	
	"use strict";

	$(function () {
		 
		String.prototype.replaceAll = function(str1, str2, ignore) 
		{
			return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
		}
		
		if (!Object.keys) {
		  Object.keys = (function () {
			'use strict';
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
				dontEnums = [
				  'toString',
				  'toLocaleString',
				  'valueOf',
				  'hasOwnProperty',
				  'isPrototypeOf',
				  'propertyIsEnumerable',
				  'constructor'
				],
				dontEnumsLength = dontEnums.length;

			return function (obj) {
			  if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			  }

			  var result = [], prop, i;

			  for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
				  result.push(prop);
				}
			  }

			  if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
				  if (hasOwnProperty.call(obj, dontEnums[i])) {
					result.push(dontEnums[i]);
				  }
				}
			  }
			  return result;
			};
		  }());
		}
		
		/* Search & Filter jQuery Plugin */
		$.fn.searchAndFilter = plugin;
		
		/* init */
		$(".searchandfilter").searchAndFilter();
		
		/* external controls */
		$(document).on("click", ".search-filter-reset", function(e){
			
			e.preventDefault();
			
			var searchFormID = typeof($(this).attr("data-search-form-id"))!="undefined" ? $(this).attr("data-search-form-id") : "";
			var submitForm = typeof($(this).attr("data-sf-submit-form"))!="undefined" ? $(this).attr("data-sf-submit-form") : "";
			
			state.getSearchForm(searchFormID).reset(submitForm);
			
			//var $linked = $("#search-filter-form-"+searchFormID).searchFilterForm({action: "reset"});
			
			return false;
			
		});
		
	});	
	
	$.easing.jswing=$.easing.swing;$.extend($.easing,{def:"easeOutQuad",swing:function(e,t,n,r,i){return $.easing[$.easing.def](e,t,n,r,i)},easeInQuad:function(e,t,n,r,i){return r*(t/=i)*t+n},easeOutQuad:function(e,t,n,r,i){return-r*(t/=i)*(t-2)+n},easeInOutQuad:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t+n;return-r/2*(--t*(t-2)-1)+n},easeInCubic:function(e,t,n,r,i){return r*(t/=i)*t*t+n},easeOutCubic:function(e,t,n,r,i){return r*((t=t/i-1)*t*t+1)+n},easeInOutCubic:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t*t+n;return r/2*((t-=2)*t*t+2)+n},easeInQuart:function(e,t,n,r,i){return r*(t/=i)*t*t*t+n},easeOutQuart:function(e,t,n,r,i){return-r*((t=t/i-1)*t*t*t-1)+n},easeInOutQuart:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t*t*t+n;return-r/2*((t-=2)*t*t*t-2)+n},easeInQuint:function(e,t,n,r,i){return r*(t/=i)*t*t*t*t+n},easeOutQuint:function(e,t,n,r,i){return r*((t=t/i-1)*t*t*t*t+1)+n},easeInOutQuint:function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t*t*t*t+n;return r/2*((t-=2)*t*t*t*t+2)+n},easeInSine:function(e,t,n,r,i){return-r*Math.cos(t/i*(Math.PI/2))+r+n},easeOutSine:function(e,t,n,r,i){return r*Math.sin(t/i*(Math.PI/2))+n},easeInOutSine:function(e,t,n,r,i){return-r/2*(Math.cos(Math.PI*t/i)-1)+n},easeInExpo:function(e,t,n,r,i){return t==0?n:r*Math.pow(2,10*(t/i-1))+n},easeOutExpo:function(e,t,n,r,i){return t==i?n+r:r*(-Math.pow(2,-10*t/i)+1)+n},easeInOutExpo:function(e,t,n,r,i){if(t==0)return n;if(t==i)return n+r;if((t/=i/2)<1)return r/2*Math.pow(2,10*(t-1))+n;return r/2*(-Math.pow(2,-10*--t)+2)+n},easeInCirc:function(e,t,n,r,i){return-r*(Math.sqrt(1-(t/=i)*t)-1)+n},easeOutCirc:function(e,t,n,r,i){return r*Math.sqrt(1-(t=t/i-1)*t)+n},easeInOutCirc:function(e,t,n,r,i){if((t/=i/2)<1)return-r/2*(Math.sqrt(1-t*t)-1)+n;return r/2*(Math.sqrt(1-(t-=2)*t)+1)+n},easeInElastic:function(e,t,n,r,i){var s=1.70158;var o=0;var u=r;if(t==0)return n;if((t/=i)==1)return n+r;if(!o)o=i*.3;if(u<Math.abs(r)){u=r;var s=o/4}else var s=o/(2*Math.PI)*Math.asin(r/u);return-(u*Math.pow(2,10*(t-=1))*Math.sin((t*i-s)*2*Math.PI/o))+n},easeOutElastic:function(e,t,n,r,i){var s=1.70158;var o=0;var u=r;if(t==0)return n;if((t/=i)==1)return n+r;if(!o)o=i*.3;if(u<Math.abs(r)){u=r;var s=o/4}else var s=o/(2*Math.PI)*Math.asin(r/u);return u*Math.pow(2,-10*t)*Math.sin((t*i-s)*2*Math.PI/o)+r+n},easeInOutElastic:function(e,t,n,r,i){var s=1.70158;var o=0;var u=r;if(t==0)return n;if((t/=i/2)==2)return n+r;if(!o)o=i*.3*1.5;if(u<Math.abs(r)){u=r;var s=o/4}else var s=o/(2*Math.PI)*Math.asin(r/u);if(t<1)return-.5*u*Math.pow(2,10*(t-=1))*Math.sin((t*i-s)*2*Math.PI/o)+n;return u*Math.pow(2,-10*(t-=1))*Math.sin((t*i-s)*2*Math.PI/o)*.5+r+n},easeInBack:function(e,t,n,r,i,s){if(s==undefined)s=1.70158;return r*(t/=i)*t*((s+1)*t-s)+n},easeOutBack:function(e,t,n,r,i,s){if(s==undefined)s=1.70158;return r*((t=t/i-1)*t*((s+1)*t+s)+1)+n},easeInOutBack:function(e,t,n,r,i,s){if(s==undefined)s=1.70158;if((t/=i/2)<1)return r/2*t*t*(((s*=1.525)+1)*t-s)+n;return r/2*((t-=2)*t*(((s*=1.525)+1)*t+s)+2)+n},easeInBounce:function(e,t,n,r,i){return r-$.easing.easeOutBounce(e,i-t,0,r,i)+n},easeOutBounce:function(e,t,n,r,i){if((t/=i)<1/2.75){return r*7.5625*t*t+n}else if(t<2/2.75){return r*(7.5625*(t-=1.5/2.75)*t+.75)+n}else if(t<2.5/2.75){return r*(7.5625*(t-=2.25/2.75)*t+.9375)+n}else{return r*(7.5625*(t-=2.625/2.75)*t+.984375)+n}},easeInOutBounce:function(e,t,n,r,i){if(t<i/2)return $.easing.easeInBounce(e,t*2,0,r,i)*.5+n;return $.easing.easeOutBounce(e,t*2-i,0,r,i)*.5+r*.5+n}})
			
}(jQuery));

/* wpnumb - nouislider number formatting */
!function(){"use strict";function e(e){return e.split("").reverse().join("")}function n(e,n){return e.substring(0,n.length)===n}function r(e,n){return e.slice(-1*n.length)===n}function t(e,n,r){if((e[n]||e[r])&&e[n]===e[r])throw new Error(n)}function i(e){return"number"==typeof e&&isFinite(e)}function o(e,n){var r=Math.pow(10,n);return(Math.round(e*r)/r).toFixed(n)}function u(n,r,t,u,f,a,c,s,p,d,l,h){var g,v,w,m=h,x="",b="";return a&&(h=a(h)),i(h)?(n!==!1&&0===parseFloat(h.toFixed(n))&&(h=0),0>h&&(g=!0,h=Math.abs(h)),n!==!1&&(h=o(h,n)),h=h.toString(),-1!==h.indexOf(".")?(v=h.split("."),w=v[0],t&&(x=t+v[1])):w=h,r&&(w=e(w).match(/.{1,3}/g),w=e(w.join(e(r)))),g&&s&&(b+=s),u&&(b+=u),g&&p&&(b+=p),b+=w,b+=x,f&&(b+=f),d&&(b=d(b,m)),b):!1}function f(e,t,o,u,f,a,c,s,p,d,l,h){var g,v="";return l&&(h=l(h)),h&&"string"==typeof h?(s&&n(h,s)&&(h=h.replace(s,""),g=!0),u&&n(h,u)&&(h=h.replace(u,"")),p&&n(h,p)&&(h=h.replace(p,""),g=!0),f&&r(h,f)&&(h=h.slice(0,-1*f.length)),t&&(h=h.split(t).join("")),o&&(h=h.replace(o,".")),g&&(v+="-"),v+=h,v=v.replace(/[^0-9\.\-.]/g,""),""===v?!1:(v=Number(v),c&&(v=c(v)),i(v)?v:!1)):!1}function a(e){var n,r,i,o={};for(n=0;n<p.length;n+=1)if(r=p[n],i=e[r],void 0===i)"negative"!==r||o.negativeBefore?"mark"===r&&"."!==o.thousand?o[r]=".":o[r]=!1:o[r]="-";else if("decimals"===r){if(!(i>=0&&8>i))throw new Error(r);o[r]=i}else if("encoder"===r||"decoder"===r||"edit"===r||"undo"===r){if("function"!=typeof i)throw new Error(r);o[r]=i}else{if("string"!=typeof i)throw new Error(r);o[r]=i}return t(o,"mark","thousand"),t(o,"prefix","negative"),t(o,"prefix","negativeBefore"),o}function c(e,n,r){var t,i=[];for(t=0;t<p.length;t+=1)i.push(e[p[t]]);return i.push(r),n.apply("",i)}function s(e){return this instanceof s?void("object"==typeof e&&(e=a(e),this.to=function(n){return c(e,u,n)},this.from=function(n){return c(e,f,n)})):new s(e)}var p=["decimals","thousand","mark","prefix","postfix","encoder","decoder","negativeBefore","negative","edit","undo"];window.wNumb=s}();


},{"./includes/fields":3,"./includes/pagination":4,"./includes/plugin":5,"./includes/state":7}],2:[function(require,module,exports){
/*! nouislider - 8.1.0 - 2015-10-25 16:05:43 */

(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.noUiSlider = factory();
    }

}(function( ){

	'use strict';


	// Removes duplicates from an array.
	function unique(array) {
		return array.filter(function(a){
			return !this[a] ? this[a] = true : false;
		}, {});
	}

	// Round a value to the closest 'to'.
	function closest ( value, to ) {
		return Math.round(value / to) * to;
	}

	// Current position of an element relative to the document.
	function offset ( elem ) {

	var rect = elem.getBoundingClientRect(),
		doc = elem.ownerDocument,
		docElem = doc.documentElement,
		pageOffset = getPageOffset();

		// getBoundingClientRect contains left scroll in Chrome on Android.
		// I haven't found a feature detection that proves this. Worst case
		// scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
		if ( /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) ) {
			pageOffset.x = 0;
		}

		return {
			top: rect.top + pageOffset.y - docElem.clientTop,
			left: rect.left + pageOffset.x - docElem.clientLeft
		};
	}

	// Checks whether a value is numerical.
	function isNumeric ( a ) {
		return typeof a === 'number' && !isNaN( a ) && isFinite( a );
	}

	// Rounds a number to 7 supported decimals.
	function accurateNumber( number ) {
		var p = Math.pow(10, 7);
		return Number((Math.round(number*p)/p).toFixed(7));
	}

	// Sets a class and removes it after [duration] ms.
	function addClassFor ( element, className, duration ) {
		addClass(element, className);
		setTimeout(function(){
			removeClass(element, className);
		}, duration);
	}

	// Limits a value to 0 - 100
	function limit ( a ) {
		return Math.max(Math.min(a, 100), 0);
	}

	// Wraps a variable as an array, if it isn't one yet.
	function asArray ( a ) {
		return Array.isArray(a) ? a : [a];
	}

	// Counts decimals
	function countDecimals ( numStr ) {
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}

	// http://youmightnotneedjquery.com/#add_class
	function addClass ( el, className ) {
		if ( el.classList ) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	}

	// http://youmightnotneedjquery.com/#remove_class
	function removeClass ( el, className ) {
		if ( el.classList ) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	// http://youmightnotneedjquery.com/#has_class
	function hasClass ( el, className ) {
		if ( el.classList ) {
			el.classList.contains(className);
		} else {
			new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
		}
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
	function getPageOffset ( ) {

		var supportPageOffset = window.pageXOffset !== undefined,
			isCSS1Compat = ((document.compatMode || "") === "CSS1Compat"),
			x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
			y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

		return {
			x: x,
			y: y
		};
	}

	// todo
	function addCssPrefix(cssPrefix) {
		return function(className) {
			return cssPrefix + className;
		};
	}


	var
	// Determine the events to bind. IE11 implements pointerEvents without
	// a prefix, which breaks compatibility with the IE10 implementation.
	/** @const */
	actions = window.navigator.pointerEnabled ? {
		start: 'pointerdown',
		move: 'pointermove',
		end: 'pointerup'
	} : window.navigator.msPointerEnabled ? {
		start: 'MSPointerDown',
		move: 'MSPointerMove',
		end: 'MSPointerUp'
	} : {
		start: 'mousedown touchstart',
		move: 'mousemove touchmove',
		end: 'mouseup touchend'
	},
	defaultCssPrefix = 'noUi-';


// Value calculation

	// Determine the size of a sub-range in relation to a full range.
	function subRangeRatio ( pa, pb ) {
		return (100 / (pb - pa));
	}

	// (percentage) How many percent is this value of this range?
	function fromPercentage ( range, value ) {
		return (value * 100) / ( range[1] - range[0] );
	}

	// (percentage) Where is this value on this range?
	function toPercentage ( range, value ) {
		return fromPercentage( range, range[0] < 0 ?
			value + Math.abs(range[0]) :
				value - range[0] );
	}

	// (value) How much is this percentage on this range?
	function isPercentage ( range, value ) {
		return ((value * ( range[1] - range[0] )) / 100) + range[0];
	}


// Range conversion

	function getJ ( value, arr ) {

		var j = 1;

		while ( value >= arr[j] ){
			j += 1;
		}

		return j;
	}

	// (percentage) Input a value, find where, on a scale of 0-100, it applies.
	function toStepping ( xVal, xPct, value ) {

		if ( value >= xVal.slice(-1)[0] ){
			return 100;
		}

		var j = getJ( value, xVal ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
	}

	// (value) Input a percentage, find where it is on the specified range.
	function fromStepping ( xVal, xPct, value ) {

		// There is no range group that fits 100
		if ( value >= 100 ){
			return xVal.slice(-1)[0];
		}

		var j = getJ( value, xPct ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
	}

	// (percentage) Get the step that applies at a certain value.
	function getStep ( xPct, xSteps, snap, value ) {

		if ( value === 100 ) {
			return value;
		}

		var j = getJ( value, xPct ), a, b;

		// If 'snap' is set, steps are used as fixed points on the slider.
		if ( snap ) {

			a = xPct[j-1];
			b = xPct[j];

			// Find the closest position, a or b.
			if ((value - a) > ((b-a)/2)){
				return b;
			}

			return a;
		}

		if ( !xSteps[j-1] ){
			return value;
		}

		return xPct[j-1] + closest(
			value - xPct[j-1],
			xSteps[j-1]
		);
	}


// Entry parsing

	function handleEntryPoint ( index, value, that ) {

		var percentage;

		// Wrap numerical input in an array.
		if ( typeof value === "number" ) {
			value = [value];
		}

		// Reject any invalid input, by testing whether value is an array.
		if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
			throw new Error("noUiSlider: 'range' contains invalid value.");
		}

		// Covert min/max syntax to 0 and 100.
		if ( index === 'min' ) {
			percentage = 0;
		} else if ( index === 'max' ) {
			percentage = 100;
		} else {
			percentage = parseFloat( index );
		}

		// Check for correct input.
		if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
			throw new Error("noUiSlider: 'range' value isn't numeric.");
		}

		// Store values.
		that.xPct.push( percentage );
		that.xVal.push( value[0] );

		// NaN will evaluate to false too, but to keep
		// logging clear, set step explicitly. Make sure
		// not to override the 'step' setting with false.
		if ( !percentage ) {
			if ( !isNaN( value[1] ) ) {
				that.xSteps[0] = value[1];
			}
		} else {
			that.xSteps.push( isNaN(value[1]) ? false : value[1] );
		}
	}

	function handleStepPoint ( i, n, that ) {

		// Ignore 'false' stepping.
		if ( !n ) {
			return true;
		}

		// Factor to range ratio
		that.xSteps[i] = fromPercentage([
			 that.xVal[i]
			,that.xVal[i+1]
		], n) / subRangeRatio (
			that.xPct[i],
			that.xPct[i+1] );
	}


// Interface

	// The interface to Spectrum handles all direction-based
	// conversions, so the above values are unaware.

	function Spectrum ( entry, snap, direction, singleStep ) {

		this.xPct = [];
		this.xVal = [];
		this.xSteps = [ singleStep || false ];
		this.xNumSteps = [ false ];

		this.snap = snap;
		this.direction = direction;

		var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];

		// Map the object keys to an array.
		for ( index in entry ) {
			if ( entry.hasOwnProperty(index) ) {
				ordered.push([entry[index], index]);
			}
		}

		// Sort all entries by value (numeric sort).
		if ( ordered.length && typeof ordered[0][0] === "object" ) {
			ordered.sort(function(a, b) { return a[0][0] - b[0][0]; });
		} else {
			ordered.sort(function(a, b) { return a[0] - b[0]; });
		}


		// Convert all entries to subranges.
		for ( index = 0; index < ordered.length; index++ ) {
			handleEntryPoint(ordered[index][1], ordered[index][0], this);
		}

		// Store the actual step values.
		// xSteps is sorted in the same order as xPct and xVal.
		this.xNumSteps = this.xSteps.slice(0);

		// Convert all numeric steps to the percentage of the subrange they represent.
		for ( index = 0; index < this.xNumSteps.length; index++ ) {
			handleStepPoint(index, this.xNumSteps[index], this);
		}
	}

	Spectrum.prototype.getMargin = function ( value ) {
		return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
	};

	Spectrum.prototype.toStepping = function ( value ) {

		value = toStepping( this.xVal, this.xPct, value );

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.fromStepping = function ( value ) {

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return accurateNumber(fromStepping( this.xVal, this.xPct, value ));
	};

	Spectrum.prototype.getStep = function ( value ) {

		// Find the proper step for rtl sliders by search in inverse direction.
		// Fixes issue #262.
		if ( this.direction ) {
			value = 100 - value;
		}

		value = getStep(this.xPct, this.xSteps, this.snap, value );

		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.getApplicableStep = function ( value ) {

		// If the value is 100%, return the negative step twice.
		var j = getJ(value, this.xPct), offset = value === 100 ? 2 : 1;
		return [this.xNumSteps[j-2], this.xVal[j-offset], this.xNumSteps[j-offset]];
	};

	// Outside testing
	Spectrum.prototype.convert = function ( value ) {
		return this.getStep(this.toStepping(value));
	};

/*	Every input option is tested and parsed. This'll prevent
	endless validation in internal methods. These tests are
	structured with an item for every option available. An
	option can be marked as required by setting the 'r' flag.
	The testing function is provided with three arguments:
		- The provided value for the option;
		- A reference to the options object;
		- The name for the option;

	The testing function returns false when an error is detected,
	or true when everything is OK. It can also modify the option
	object, to make sure all values can be correctly looped elsewhere. */

	var defaultFormatter = { 'to': function( value ){
		return value !== undefined && value.toFixed(2);
	}, 'from': Number };

	function testStep ( parsed, entry ) {

		if ( !isNumeric( entry ) ) {
			throw new Error("noUiSlider: 'step' is not numeric.");
		}

		// The step option can still be used to set stepping
		// for linear sliders. Overwritten if set in 'range'.
		parsed.singleStep = entry;
	}

	function testRange ( parsed, entry ) {

		// Filter incorrect input.
		if ( typeof entry !== 'object' || Array.isArray(entry) ) {
			throw new Error("noUiSlider: 'range' is not an object.");
		}

		// Catch missing start or end.
		if ( entry.min === undefined || entry.max === undefined ) {
			throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
		}

		parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);
	}

	function testStart ( parsed, entry ) {

		entry = asArray(entry);

		// Validate input. Values aren't tested, as the public .val method
		// will always provide a valid location.
		if ( !Array.isArray( entry ) || !entry.length || entry.length > 2 ) {
			throw new Error("noUiSlider: 'start' option is incorrect.");
		}

		// Store the number of handles.
		parsed.handles = entry.length;

		// When the slider is initialized, the .val method will
		// be called with the start options.
		parsed.start = entry;
	}

	function testSnap ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.snap = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'snap' option must be a boolean.");
		}
	}

	function testAnimate ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.animate = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'animate' option must be a boolean.");
		}
	}

	function testConnect ( parsed, entry ) {

		if ( entry === 'lower' && parsed.handles === 1 ) {
			parsed.connect = 1;
		} else if ( entry === 'upper' && parsed.handles === 1 ) {
			parsed.connect = 2;
		} else if ( entry === true && parsed.handles === 2 ) {
			parsed.connect = 3;
		} else if ( entry === false ) {
			parsed.connect = 0;
		} else {
			throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
		}
	}

	function testOrientation ( parsed, entry ) {

		// Set orientation to an a numerical value for easy
		// array selection.
		switch ( entry ){
		  case 'horizontal':
			parsed.ort = 0;
			break;
		  case 'vertical':
			parsed.ort = 1;
			break;
		  default:
			throw new Error("noUiSlider: 'orientation' option is invalid.");
		}
	}

	function testMargin ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'margin' option must be numeric.");
		}

		parsed.margin = parsed.spectrum.getMargin(entry);

		if ( !parsed.margin ) {
			throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");
		}
	}

	function testLimit ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'limit' option must be numeric.");
		}

		parsed.limit = parsed.spectrum.getMargin(entry);

		if ( !parsed.limit ) {
			throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.");
		}
	}

	function testDirection ( parsed, entry ) {

		// Set direction as a numerical value for easy parsing.
		// Invert connection for RTL sliders, so that the proper
		// handles get the connect/background classes.
		switch ( entry ) {
		  case 'ltr':
			parsed.dir = 0;
			break;
		  case 'rtl':
			parsed.dir = 1;
			parsed.connect = [0,2,1,3][parsed.connect];
			break;
		  default:
			throw new Error("noUiSlider: 'direction' option was not recognized.");
		}
	}

	function testBehaviour ( parsed, entry ) {

		// Make sure the input is a string.
		if ( typeof entry !== 'string' ) {
			throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
		}

		// Check if the string contains any keywords.
		// None are required.
		var tap = entry.indexOf('tap') >= 0,
			drag = entry.indexOf('drag') >= 0,
			fixed = entry.indexOf('fixed') >= 0,
			snap = entry.indexOf('snap') >= 0;

		// Fix #472
		if ( drag && !parsed.connect ) {
			throw new Error("noUiSlider: 'drag' behaviour must be used with 'connect': true.");
		}

		parsed.events = {
			tap: tap || snap,
			drag: drag,
			fixed: fixed,
			snap: snap
		};
	}

	function testTooltips ( parsed, entry ) {

		if ( entry === true ) {
			parsed.tooltips = true;
		}

		if ( entry && entry.format ) {

			if ( typeof entry.format !== 'function' ) {
				throw new Error("noUiSlider: 'tooltips.format' must be an object.");
			}

			parsed.tooltips = {
				format: entry.format
			};
		}
	}

	function testFormat ( parsed, entry ) {

		parsed.format = entry;

		// Any object with a to and from method is supported.
		if ( typeof entry.to === 'function' && typeof entry.from === 'function' ) {
			return true;
		}

		throw new Error( "noUiSlider: 'format' requires 'to' and 'from' methods.");
	}

	function testCssPrefix ( parsed, entry ) {

		if ( entry !== undefined && typeof entry !== 'string' ) {
			throw new Error( "noUiSlider: 'cssPrefix' must be a string.");
		}

		parsed.cssPrefix = entry;
	}

	// Test all developer settings and parse to assumption-safe values.
	function testOptions ( options ) {

		var parsed = {
			margin: 0,
			limit: 0,
			animate: true,
			format: defaultFormatter
		}, tests;

		// Tests are executed in the order they are presented here.
		tests = {
			'step': { r: false, t: testStep },
			'start': { r: true, t: testStart },
			'connect': { r: true, t: testConnect },
			'direction': { r: true, t: testDirection },
			'snap': { r: false, t: testSnap },
			'animate': { r: false, t: testAnimate },
			'range': { r: true, t: testRange },
			'orientation': { r: false, t: testOrientation },
			'margin': { r: false, t: testMargin },
			'limit': { r: false, t: testLimit },
			'behaviour': { r: true, t: testBehaviour },
			'format': { r: false, t: testFormat },
			'tooltips': { r: false, t: testTooltips },
			'cssPrefix': { r: false, t: testCssPrefix }
		};

		var defaults = {
			'connect': false,
			'direction': 'ltr',
			'behaviour': 'tap',
			'orientation': 'horizontal'
		};

		// Set defaults where applicable.
		Object.keys(defaults).forEach(function ( name ) {
			if ( options[name] === undefined ) {
				options[name] = defaults[name];
			}
		});

		// Run all options through a testing mechanism to ensure correct
		// input. It should be noted that options might get modified to
		// be handled properly. E.g. wrapping integers in arrays.
		Object.keys(tests).forEach(function( name ){

			var test = tests[name];

			// If the option isn't set, but it is required, throw an error.
			if ( options[name] === undefined ) {

				if ( test.r ) {
					throw new Error("noUiSlider: '" + name + "' is required.");
				}

				return true;
			}

			test.t( parsed, options[name] );
		});

		// Forward pips options
		parsed.pips = options.pips;

		// Pre-define the styles.
		parsed.style = parsed.ort ? 'top' : 'left';

		return parsed;
	}


function closure ( target, options ){

	// All variables local to 'closure' are prefixed with 'scope_'
	var scope_Target = target,
		scope_Locations = [-1, -1],
		scope_Base,
		scope_Handles,
		scope_Spectrum = options.spectrum,
		scope_Values = [],
		scope_Events = {};

  var cssClasses = [
    /*  0 */  'target'
    /*  1 */ ,'base'
    /*  2 */ ,'origin'
    /*  3 */ ,'handle'
    /*  4 */ ,'horizontal'
    /*  5 */ ,'vertical'
    /*  6 */ ,'background'
    /*  7 */ ,'connect'
    /*  8 */ ,'ltr'
    /*  9 */ ,'rtl'
    /* 10 */ ,'draggable'
    /* 11 */ ,''
    /* 12 */ ,'state-drag'
    /* 13 */ ,''
    /* 14 */ ,'state-tap'
    /* 15 */ ,'active'
    /* 16 */ ,''
    /* 17 */ ,'stacking'
    /* 18 */ ,'tooltip'
  ].map(addCssPrefix(options.cssPrefix || defaultCssPrefix));


	// Delimit proposed values for handle positions.
	function getPositions ( a, b, delimit ) {

		// Add movement to current position.
		var c = a + b[0], d = a + b[1];

		// Only alter the other position on drag,
		// not on standard sliding.
		if ( delimit ) {
			if ( c < 0 ) {
				d += Math.abs(c);
			}
			if ( d > 100 ) {
				c -= ( d - 100 );
			}

			// Limit values to 0 and 100.
			return [limit(c), limit(d)];
		}

		return [c,d];
	}

	// Provide a clean event with standardized offset values.
	function fixEvent ( e, pageOffset ) {

		// Prevent scrolling and panning on touch events, while
		// attempting to slide. The tap event also depends on this.
		e.preventDefault();

		// Filter the event to register the type, which can be
		// touch, mouse or pointer. Offset changes need to be
		// made on an event specific basis.
		var touch = e.type.indexOf('touch') === 0,
			mouse = e.type.indexOf('mouse') === 0,
			pointer = e.type.indexOf('pointer') === 0,
			x,y, event = e;

		// IE10 implemented pointer events with a prefix;
		if ( e.type.indexOf('MSPointer') === 0 ) {
			pointer = true;
		}

		if ( touch ) {
			// noUiSlider supports one movement at a time,
			// so we can select the first 'changedTouch'.
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY;
		}

		pageOffset = pageOffset || getPageOffset();

		if ( mouse || pointer ) {
			x = e.clientX + pageOffset.x;
			y = e.clientY + pageOffset.y;
		}

		event.pageOffset = pageOffset;
		event.points = [x, y];
		event.cursor = mouse || pointer; // Fix #435

		return event;
	}

	// Append a handle to the base.
	function addHandle ( direction, index ) {

		var origin = document.createElement('div'),
			handle = document.createElement('div'),
			additions = [ '-lower', '-upper' ];

		if ( direction ) {
			additions.reverse();
		}

		addClass(handle, cssClasses[3]);
		addClass(handle, cssClasses[3] + additions[index]);

		addClass(origin, cssClasses[2]);
		origin.appendChild(handle);

		return origin;
	}

	// Add the proper connection classes.
	function addConnection ( connect, target, handles ) {

		// Apply the required connection classes to the elements
		// that need them. Some classes are made up for several
		// segments listed in the class list, to allow easy
		// renaming and provide a minor compression benefit.
		switch ( connect ) {
			case 1:	addClass(target, cssClasses[7]);
					addClass(handles[0], cssClasses[6]);
					break;
			case 3: addClass(handles[1], cssClasses[6]);
					/* falls through */
			case 2: addClass(handles[0], cssClasses[7]);
					/* falls through */
			case 0: addClass(target, cssClasses[6]);
					break;
		}
	}

	// Add handles to the slider base.
	function addHandles ( nrHandles, direction, base ) {

		var index, handles = [];

		// Append handles.
		for ( index = 0; index < nrHandles; index += 1 ) {

			// Keep a list of all added handles.
			handles.push( base.appendChild(addHandle( direction, index )) );
		}

		return handles;
	}

	// Initialize a single slider.
	function addSlider ( direction, orientation, target ) {

		// Apply classes and data to the target.
		addClass(target, cssClasses[0]);
		addClass(target, cssClasses[8 + direction]);
		addClass(target, cssClasses[4 + orientation]);

		var div = document.createElement('div');
		addClass(div, cssClasses[1]);
		target.appendChild(div);
		return div;
	}


	function defaultFormatTooltipValue ( formattedValue ) {
		return formattedValue;
	}

	function addTooltip ( handle ) {
		var element = document.createElement('div');
		element.className = cssClasses[18];
		return handle.firstChild.appendChild(element);
	}

	// The tooltips option is a shorthand for using the 'update' event.
	function tooltips ( tooltipsOptions ) {

		var formatTooltipValue = tooltipsOptions.format ? tooltipsOptions.format : defaultFormatTooltipValue,
			tips = scope_Handles.map(addTooltip);

		bindEvent('update', function(formattedValues, handleId, rawValues) {
			tips[handleId].innerHTML = formatTooltipValue(formattedValues[handleId], rawValues[handleId]);
		});
	}


	function getGroup ( mode, values, stepped ) {

		// Use the range.
		if ( mode === 'range' || mode === 'steps' ) {
			return scope_Spectrum.xVal;
		}

		if ( mode === 'count' ) {

			// Divide 0 - 100 in 'count' parts.
			var spread = ( 100 / (values-1) ), v, i = 0;
			values = [];

			// List these parts and have them handled as 'positions'.
			while ((v=i++*spread) <= 100 ) {
				values.push(v);
			}

			mode = 'positions';
		}

		if ( mode === 'positions' ) {

			// Map all percentages to on-range values.
			return values.map(function( value ){
				return scope_Spectrum.fromStepping( stepped ? scope_Spectrum.getStep( value ) : value );
			});
		}

		if ( mode === 'values' ) {

			// If the value must be stepped, it needs to be converted to a percentage first.
			if ( stepped ) {

				return values.map(function( value ){

					// Convert to percentage, apply step, return to value.
					return scope_Spectrum.fromStepping( scope_Spectrum.getStep( scope_Spectrum.toStepping( value ) ) );
				});

			}

			// Otherwise, we can simply use the values.
			return values;
		}
	}

	function generateSpread ( density, mode, group ) {

		function safeIncrement(value, increment) {
			// Avoid floating point variance by dropping the smallest decimal places.
			return (value + increment).toFixed(7) / 1;
		}

		var originalSpectrumDirection = scope_Spectrum.direction,
			indexes = {},
			firstInRange = scope_Spectrum.xVal[0],
			lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length-1],
			ignoreFirst = false,
			ignoreLast = false,
			prevPct = 0;

		// This function loops the spectrum in an ltr linear fashion,
		// while the toStepping method is direction aware. Trick it into
		// believing it is ltr.
		scope_Spectrum.direction = 0;

		// Create a copy of the group, sort it and filter away all duplicates.
		group = unique(group.slice().sort(function(a, b){ return a - b; }));

		// Make sure the range starts with the first element.
		if ( group[0] !== firstInRange ) {
			group.unshift(firstInRange);
			ignoreFirst = true;
		}

		// Likewise for the last one.
		if ( group[group.length - 1] !== lastInRange ) {
			group.push(lastInRange);
			ignoreLast = true;
		}

		group.forEach(function ( current, index ) {

			// Get the current step and the lower + upper positions.
			var step, i, q,
				low = current,
				high = group[index+1],
				newPct, pctDifference, pctPos, type,
				steps, realSteps, stepsize;

			// When using 'steps' mode, use the provided steps.
			// Otherwise, we'll step on to the next subrange.
			if ( mode === 'steps' ) {
				step = scope_Spectrum.xNumSteps[ index ];
			}

			// Default to a 'full' step.
			if ( !step ) {
				step = high-low;
			}

			// Low can be 0, so test for false. If high is undefined,
			// we are at the last subrange. Index 0 is already handled.
			if ( low === false || high === undefined ) {
				return;
			}

			// Find all steps in the subrange.
			for ( i = low; i <= high; i = safeIncrement(i, step) ) {

				// Get the percentage value for the current step,
				// calculate the size for the subrange.
				newPct = scope_Spectrum.toStepping( i );
				pctDifference = newPct - prevPct;

				steps = pctDifference / density;
				realSteps = Math.round(steps);

				// This ratio represents the ammount of percentage-space a point indicates.
				// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
				// Round the percentage offset to an even number, then divide by two
				// to spread the offset on both sides of the range.
				stepsize = pctDifference/realSteps;

				// Divide all points evenly, adding the correct number to this subrange.
				// Run up to <= so that 100% gets a point, event if ignoreLast is set.
				for ( q = 1; q <= realSteps; q += 1 ) {

					// The ratio between the rounded value and the actual size might be ~1% off.
					// Correct the percentage offset by the number of points
					// per subrange. density = 1 will result in 100 points on the
					// full range, 2 for 50, 4 for 25, etc.
					pctPos = prevPct + ( q * stepsize );
					indexes[pctPos.toFixed(5)] = ['x', 0];
				}

				// Determine the point type.
				type = (group.indexOf(i) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );

				// Enforce the 'ignoreFirst' option by overwriting the type for 0.
				if ( !index && ignoreFirst ) {
					type = 0;
				}

				if ( !(i === high && ignoreLast)) {
					// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
					indexes[newPct.toFixed(5)] = [i, type];
				}

				// Update the percentage count.
				prevPct = newPct;
			}
		});

		// Reset the spectrum.
		scope_Spectrum.direction = originalSpectrumDirection;

		return indexes;
	}

	function addMarking ( spread, filterFunc, formatter ) {

		var style = ['horizontal', 'vertical'][options.ort],
			element = document.createElement('div');

		addClass(element, 'noUi-pips');
		addClass(element, 'noUi-pips-' + style);

		function getSize( type ){
			return [ '-normal', '-large', '-sub' ][type];
		}

		function getTags( offset, source, values ) {
			return 'class="' + source + ' ' +
				source + '-' + style + ' ' +
				source + getSize(values[1]) +
				'" style="' + options.style + ': ' + offset + '%"';
		}

		function addSpread ( offset, values ){

			if ( scope_Spectrum.direction ) {
				offset = 100 - offset;
			}

			// Apply the filter function, if it is set.
			values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

			// Add a marker for every point
			element.innerHTML += '<div ' + getTags(offset, 'noUi-marker', values) + '></div>';

			// Values are only appended for points marked '1' or '2'.
			if ( values[1] ) {
				element.innerHTML += '<div '+getTags(offset, 'noUi-value', values)+'>' + formatter.to(values[0]) + '</div>';
			}
		}

		// Append all points.
		Object.keys(spread).forEach(function(a){
			addSpread(a, spread[a]);
		});

		return element;
	}

	function pips ( grid ) {

	var mode = grid.mode,
		density = grid.density || 1,
		filter = grid.filter || false,
		values = grid.values || false,
		stepped = grid.stepped || false,
		group = getGroup( mode, values, stepped ),
		spread = generateSpread( density, mode, group ),
		format = grid.format || {
			to: Math.round
		};

		return scope_Target.appendChild(addMarking(
			spread,
			filter,
			format
		));
	}


	// Shorthand for base dimensions.
	function baseSize ( ) {
		return scope_Base['offset' + ['Width', 'Height'][options.ort]];
	}

	// External event handling
	function fireEvent ( event, handleNumber ) {

		if ( handleNumber !== undefined && options.handles !== 1 ) {
			handleNumber = Math.abs(handleNumber - options.dir);
		}

		Object.keys(scope_Events).forEach(function( targetEvent ) {

			var eventType = targetEvent.split('.')[0];

			if ( event === eventType ) {
				scope_Events[targetEvent].forEach(function( callback ) {
					// .reverse is in place
					// Return values as array, so arg_1[arg_2] is always valid.
					callback( asArray(valueGet()), handleNumber, inSliderOrder(Array.prototype.slice.call(scope_Values)) );
				});
			}
		});
	}

	// Returns the input array, respecting the slider direction configuration.
	function inSliderOrder ( values ) {

		// If only one handle is used, return a single value.
		if ( values.length === 1 ){
			return values[0];
		}

		if ( options.dir ) {
			return values.reverse();
		}

		return values;
	}


	// Handler for attaching events trough a proxy.
	function attach ( events, element, callback, data ) {

		// This function can be used to 'filter' events to the slider.
		// element is a node, not a nodeList

		var method = function ( e ){

			if ( scope_Target.hasAttribute('disabled') ) {
				return false;
			}

			// Stop if an active 'tap' transition is taking place.
			if ( hasClass(scope_Target, cssClasses[14]) ) {
				return false;
			}

			e = fixEvent(e, data.pageOffset);

			// Ignore right or middle clicks on start #454
			if ( events === actions.start && e.buttons !== undefined && e.buttons > 1 ) {
				return false;
			}

			e.calcPoint = e.points[ options.ort ];

			// Call the event handler with the event [ and additional data ].
			callback ( e, data );

		}, methods = [];

		// Bind a closure on the target for every event type.
		events.split(' ').forEach(function( eventName ){
			element.addEventListener(eventName, method, false);
			methods.push([eventName, method]);
		});

		return methods;
	}

	// Handle movement on document for handle and range drag.
	function move ( event, data ) {

		// Fix #498
		// Check value of .buttons in 'start' to work around a bug in IE10 mobile.
		// https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
		// IE9 has .buttons zero on mousemove.
		if ( event.buttons === 0 && event.which === 0 && data.buttonsProperty !== 0 ) {
			return end(event, data);
		}

		var handles = data.handles || scope_Handles, positions, state = false,
			proposal = ((event.calcPoint - data.start) * 100) / data.baseSize,
			handleNumber = handles[0] === scope_Handles[0] ? 0 : 1, i;

		// Calculate relative positions for the handles.
		positions = getPositions( proposal, data.positions, handles.length > 1);

		state = setHandle ( handles[0], positions[handleNumber], handles.length === 1 );

		if ( handles.length > 1 ) {

			state = setHandle ( handles[1], positions[handleNumber?0:1], false ) || state;

			if ( state ) {
				// fire for both handles
				for ( i = 0; i < data.handles.length; i++ ) {
					fireEvent('slide', i);
				}
			}
		} else if ( state ) {
			// Fire for a single handle
			fireEvent('slide', handleNumber);
		}
	}

	// Unbind move events on document, call callbacks.
	function end ( event, data ) {

		// The handle is no longer active, so remove the class.
		var active = scope_Base.querySelector( '.' + cssClasses[15] ),
			handleNumber = data.handles[0] === scope_Handles[0] ? 0 : 1;

		if ( active !== null ) {
			removeClass(active, cssClasses[15]);
		}

		// Remove cursor styles and text-selection events bound to the body.
		if ( event.cursor ) {
			document.body.style.cursor = '';
			document.body.removeEventListener('selectstart', document.body.noUiListener);
		}

		var d = document.documentElement;

		// Unbind the move and end events, which are added on 'start'.
		d.noUiListeners.forEach(function( c ) {
			d.removeEventListener(c[0], c[1]);
		});

		// Remove dragging class.
		removeClass(scope_Target, cssClasses[12]);

		// Fire the change and set events.
		fireEvent('set', handleNumber);
		fireEvent('change', handleNumber);
	}

	// Bind move events on document.
	function start ( event, data ) {

		var d = document.documentElement;

		// Mark the handle as 'active' so it can be styled.
		if ( data.handles.length === 1 ) {
			addClass(data.handles[0].children[0], cssClasses[15]);

			// Support 'disabled' handles
			if ( data.handles[0].hasAttribute('disabled') ) {
				return false;
			}
		}

		// A drag should never propagate up to the 'tap' event.
		event.stopPropagation();

		// Attach the move and end events.
		var moveEvent = attach(actions.move, d, move, {
			start: event.calcPoint,
			baseSize: baseSize(),
			pageOffset: event.pageOffset,
			handles: data.handles,
			buttonsProperty: event.buttons,
			positions: [
				scope_Locations[0],
				scope_Locations[scope_Handles.length - 1]
			]
		}), endEvent = attach(actions.end, d, end, {
			handles: data.handles
		});

		d.noUiListeners = moveEvent.concat(endEvent);

		// Text selection isn't an issue on touch devices,
		// so adding cursor styles can be skipped.
		if ( event.cursor ) {

			// Prevent the 'I' cursor and extend the range-drag cursor.
			document.body.style.cursor = getComputedStyle(event.target).cursor;

			// Mark the target with a dragging state.
			if ( scope_Handles.length > 1 ) {
				addClass(scope_Target, cssClasses[12]);
			}

			var f = function(){
				return false;
			};

			document.body.noUiListener = f;

			// Prevent text selection when dragging the handles.
			document.body.addEventListener('selectstart', f, false);
		}
	}

	// Move closest handle to tapped location.
	function tap ( event ) {

		var location = event.calcPoint, total = 0, handleNumber, to;

		// The tap event shouldn't propagate up and cause 'edge' to run.
		event.stopPropagation();

		// Add up the handle offsets.
		scope_Handles.forEach(function(a){
			total += offset(a)[ options.style ];
		});

		// Find the handle closest to the tapped position.
		handleNumber = ( location < total/2 || scope_Handles.length === 1 ) ? 0 : 1;

		location -= offset(scope_Base)[ options.style ];

		// Calculate the new position.
		to = ( location * 100 ) / baseSize();

		if ( !options.events.snap ) {
			// Flag the slider as it is now in a transitional state.
			// Transition takes 300 ms, so re-enable the slider afterwards.
			addClassFor( scope_Target, cssClasses[14], 300 );
		}

		// Support 'disabled' handles
		if ( scope_Handles[handleNumber].hasAttribute('disabled') ) {
			return false;
		}

		// Find the closest handle and calculate the tapped point.
		// The set handle to the new position.
		setHandle( scope_Handles[handleNumber], to );

		fireEvent('slide', handleNumber);
		fireEvent('set', handleNumber);
		fireEvent('change', handleNumber);

		if ( options.events.snap ) {
			start(event, { handles: [scope_Handles[handleNumber]] });
		}
	}

	// Attach events to several slider parts.
	function events ( behaviour ) {

		var i, drag;

		// Attach the standard drag event to the handles.
		if ( !behaviour.fixed ) {

			for ( i = 0; i < scope_Handles.length; i += 1 ) {

				// These events are only bound to the visual handle
				// element, not the 'real' origin element.
				attach ( actions.start, scope_Handles[i].children[0], start, {
					handles: [ scope_Handles[i] ]
				});
			}
		}

		// Attach the tap event to the slider base.
		if ( behaviour.tap ) {

			attach ( actions.start, scope_Base, tap, {
				handles: scope_Handles
			});
		}

		// Make the range draggable.
		if ( behaviour.drag ){

			drag = [scope_Base.querySelector( '.' + cssClasses[7] )];
			addClass(drag[0], cssClasses[10]);

			// When the range is fixed, the entire range can
			// be dragged by the handles. The handle in the first
			// origin will propagate the start event upward,
			// but it needs to be bound manually on the other.
			if ( behaviour.fixed ) {
				drag.push(scope_Handles[(drag[0] === scope_Handles[0] ? 1 : 0)].children[0]);
			}

			drag.forEach(function( element ) {
				attach ( actions.start, element, start, {
					handles: scope_Handles
				});
			});
		}
	}


	// Test suggested values and apply margin, step.
	function setHandle ( handle, to, noLimitOption ) {

		var trigger = handle !== scope_Handles[0] ? 1 : 0,
			lowerMargin = scope_Locations[0] + options.margin,
			upperMargin = scope_Locations[1] - options.margin,
			lowerLimit = scope_Locations[0] + options.limit,
			upperLimit = scope_Locations[1] - options.limit,
			newScopeValue = scope_Spectrum.fromStepping( to );

		// For sliders with multiple handles,
		// limit movement to the other handle.
		// Apply the margin option by adding it to the handle positions.
		if ( scope_Handles.length > 1 ) {
			to = trigger ? Math.max( to, lowerMargin ) : Math.min( to, upperMargin );
		}

		// The limit option has the opposite effect, limiting handles to a
		// maximum distance from another. Limit must be > 0, as otherwise
		// handles would be unmoveable. 'noLimitOption' is set to 'false'
		// for the .val() method, except for pass 4/4.
		if ( noLimitOption !== false && options.limit && scope_Handles.length > 1 ) {
			to = trigger ? Math.min ( to, lowerLimit ) : Math.max( to, upperLimit );
		}

		// Handle the step option.
		to = scope_Spectrum.getStep( to );

		// Limit to 0/100 for .val input, trim anything beyond 7 digits, as
		// JavaScript has some issues in its floating point implementation.
		to = limit(parseFloat(to.toFixed(7)));

		// Return false if handle can't move and ranges were not updated
		if ( to === scope_Locations[trigger] && newScopeValue === scope_Values[trigger]) {
			return false;
		}

		// Set the handle to the new position.
		// Use requestAnimationFrame for efficient painting.
		// No significant effect in Chrome, Edge sees dramatic
		// performace improvements.
		if ( window.requestAnimationFrame ) {
			window.requestAnimationFrame(function(){
				handle.style[options.style] = to + '%';
			});
		} else {
			handle.style[options.style] = to + '%';
		}

		// Force proper handle stacking
		if ( !handle.previousSibling ) {
			removeClass(handle, cssClasses[17]);
			if ( to > 50 ) {
				addClass(handle, cssClasses[17]);
			}
		}

		// Update locations.
		scope_Locations[trigger] = to;

		// Convert the value to the slider stepping/range.
		scope_Values[trigger] = scope_Spectrum.fromStepping( to );

		fireEvent('update', trigger);

		return true;
	}

	// Loop values from value method and apply them.
	function setValues ( count, values ) {

		var i, trigger, to;

		// With the limit option, we'll need another limiting pass.
		if ( options.limit ) {
			count += 1;
		}

		// If there are multiple handles to be set run the setting
		// mechanism twice for the first handle, to make sure it
		// can be bounced of the second one properly.
		for ( i = 0; i < count; i += 1 ) {

			trigger = i%2;

			// Get the current argument from the array.
			to = values[trigger];

			// Setting with null indicates an 'ignore'.
			// Inputting 'false' is invalid.
			if ( to !== null && to !== false ) {

				// If a formatted number was passed, attemt to decode it.
				if ( typeof to === 'number' ) {
					to = String(to);
				}

				to = options.format.from( to );

				// Request an update for all links if the value was invalid.
				// Do so too if setting the handle fails.
				if ( to === false || isNaN(to) || setHandle( scope_Handles[trigger], scope_Spectrum.toStepping( to ), i === (3 - options.dir) ) === false ) {
					fireEvent('update', trigger);
				}
			}
		}
	}

	// Set the slider value.
	function valueSet ( input ) {

		var count, values = asArray( input ), i;

		// The RTL settings is implemented by reversing the front-end,
		// internal mechanisms are the same.
		if ( options.dir && options.handles > 1 ) {
			values.reverse();
		}

		// Animation is optional.
		// Make sure the initial values where set before using animated placement.
		if ( options.animate && scope_Locations[0] !== -1 ) {
			addClassFor( scope_Target, cssClasses[14], 300 );
		}

		// Determine how often to set the handles.
		count = scope_Handles.length > 1 ? 3 : 1;

		if ( values.length === 1 ) {
			count = 1;
		}

		setValues ( count, values );

		// Fire the 'set' event for both handles.
		for ( i = 0; i < scope_Handles.length; i++ ) {
			fireEvent('set', i);
		}
	}

	// Get the slider value.
	function valueGet ( ) {

		var i, retour = [];

		// Get the value from all handles.
		for ( i = 0; i < options.handles; i += 1 ){
			retour[i] = options.format.to( scope_Values[i] );
		}

		return inSliderOrder( retour );
	}

	// Removes classes from the root and empties it.
	function destroy ( ) {
		cssClasses.forEach(function(cls){
			if ( !cls ) { return; } // Ignore empty classes
			removeClass(scope_Target, cls);
		});
		scope_Target.innerHTML = '';
		delete scope_Target.noUiSlider;
	}

	// Get the current step size for the slider.
	function getCurrentStep ( ) {

		// Check all locations, map them to their stepping point.
		// Get the step point, then find it in the input list.
		var retour = scope_Locations.map(function( location, index ){

			var step = scope_Spectrum.getApplicableStep( location ),

				// As per #391, the comparison for the decrement step can have some rounding issues.
				// Round the value to the precision used in the step.
				stepDecimals = countDecimals(String(step[2])),

				// Get the current numeric value
				value = scope_Values[index],

				// To move the slider 'one step up', the current step value needs to be added.
				// Use null if we are at the maximum slider value.
				increment = location === 100 ? null : step[2],

				// Going 'one step down' might put the slider in a different sub-range, so we
				// need to switch between the current or the previous step.
				prev = Number((value - step[2]).toFixed(stepDecimals)),

				// If the value fits the step, return the current step value. Otherwise, use the
				// previous step. Return null if the slider is at its minimum value.
				decrement = location === 0 ? null : (prev >= step[1]) ? step[2] : (step[0] || false);

			return [decrement, increment];
		});

		// Return values in the proper order.
		return inSliderOrder( retour );
	}

	// Attach an event to this slider, possibly including a namespace
	function bindEvent ( namespacedEvent, callback ) {
		scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
		scope_Events[namespacedEvent].push(callback);

		// If the event bound is 'update,' fire it immediately for all handles.
		if ( namespacedEvent.split('.')[0] === 'update' ) {
			scope_Handles.forEach(function(a, index){
				fireEvent('update', index);
			});
		}
	}

	// Undo attachment of event
	function removeEvent ( namespacedEvent ) {

		var event = namespacedEvent.split('.')[0],
			namespace = namespacedEvent.substring(event.length);

		Object.keys(scope_Events).forEach(function( bind ){

			var tEvent = bind.split('.')[0],
				tNamespace = bind.substring(tEvent.length);

			if ( (!event || event === tEvent) && (!namespace || namespace === tNamespace) ) {
				delete scope_Events[bind];
			}
		});
	}


	// Throw an error if the slider was already initialized.
	if ( scope_Target.noUiSlider ) {
		throw new Error('Slider was already initialized.');
	}


	// Create the base element, initialise HTML and set classes.
	// Add handles and links.
	scope_Base = addSlider( options.dir, options.ort, scope_Target );
	scope_Handles = addHandles( options.handles, options.dir, scope_Base );

	// Set the connect classes.
	addConnection ( options.connect, scope_Target, scope_Handles );

	// Attach user events.
	events( options.events );

	if ( options.pips ) {
		pips(options.pips);
	}

	if ( options.tooltips ) {
		tooltips(options.tooltips);
	}

	// can be updated:
	// margin
	// limit
	// step
	// range
	// animate
	function updateOptions ( optionsToUpdate ) {

		var newOptions = testOptions({
			start: [0, 0],
			margin: optionsToUpdate.margin,
			limit: optionsToUpdate.limit,
			step: optionsToUpdate.step,
			range: optionsToUpdate.range,
			animate: optionsToUpdate.animate
		});

		options.margin = newOptions.margin;
		options.limit = newOptions.limit;
		options.step = newOptions.step;
		options.range = newOptions.range;
		options.animate = newOptions.animate;

		scope_Spectrum = newOptions.spectrum;
	}

	return {
		destroy: destroy,
		steps: getCurrentStep,
		on: bindEvent,
		off: removeEvent,
		get: valueGet,
		set: valueSet,
		updateOptions: updateOptions
	};

}


	// Run the standard initializer
	function initialize ( target, originalOptions ) {

		if ( !target.nodeName ) {
			throw new Error('noUiSlider.create requires a single element.');
		}

		// Test the options and create the slider environment;
		var options = testOptions( originalOptions, target ),
			slider = closure( target, options );

		// Use the public value method to set the start values.
		slider.set(options.start);

		target.noUiSlider = slider;
		return slider;
	}

	// Use an object instead of a function for future expansibility;
	return {
		create: initialize
	};

}));
},{}],3:[function(require,module,exports){

var fields = {
	
	functions: {}
	
};

module.exports = fields;
},{}],4:[function(require,module,exports){

//var state = require('./includes/state');

var pagination = {
	
	setupLegacy: function(){
		
		
	},
	
	setupLegacy: function(){
		
		/*if(typeof(self.ajax_links_selector)!="undefined")
		{
			var $ajax_links_object = jQuery(self.ajax_links_selector);
			
			if($ajax_links_object.length>0)
			{
				$ajax_links_object.on('click', function(e) {
					
					e.preventDefault();
					
					var link = jQuery(this).attr('href');
					self.ajax_action = "pagination";
					
					self.fetchLegacyAjaxResults(link);
					return false;
				});
			}
		}*/
	}
};

module.exports = pagination;
},{}],5:[function(require,module,exports){

var $ 				= (window.jQuery);
var state 			= require('./state');
var process_form 	= require('./process_form');
var noUiSlider		= require('nouislider');

module.exports = function(options)
{
	var defaults = {
		startOpened: false,
		isInit: true,
		action: ""
	};

	var opts = jQuery.extend(defaults, options);

	//loop through each item matched
	this.each(function()
	{

		var $this = $(this);
		var self = this;
		this.sfid = $this.attr("data-sf-form-id");

		state.addSearchForm(this.sfid, this);

		this.$fields = $this.find("> ul > li"); //a reference to each fields parent LI

		process_form.init();
		process_form.enableInputs(self);

		this.extra_query_params = {};

		this.template_is_loaded = $this.attr("data-template-loaded");
		this.is_ajax = $this.attr("data-ajax");

		this.$ajax_results_container = jQuery($this.attr("data-ajax-target"));
		this.results_url = $this.attr("data-results-url");
		this.debug_mode = $this.attr("data-debug-mode");
		this.update_ajax_url = $this.attr("data-update-ajax-url");
		this.auto_count_refresh_mode = $this.attr("data-auto-count-refresh-mode");
		this.only_results_ajax = $this.attr("data-only-results-ajax"); //if we are not on the results page, redirect rather than try to load via ajax
		this.scroll_to_pos = $this.attr("data-scroll-to-pos");
		this.custom_scroll_to = $this.attr("data-custom-scroll-to");
		this.scroll_on_action = $this.attr("data-scroll-on-action");
		this.lang_code = $this.attr("data-lang-code");
		this.ajax_url = $this.attr('data-ajax-url');
		this.ajax_form_url = $this.attr('data-ajax-form-url');
		this.is_rtl = $this.attr('data-is-rtl');
		this.ajax_action = "";
		this.last_submit_query_params = "";

		this.ajax_target_attr = $this.attr("data-ajax-target");
		this.use_history_api = $this.attr("data-use-history-api");

		this.last_ajax_request = null;

		if(typeof(this.use_history_api)=="undefined")
		{
			this.use_history_api = "";
		}

		if(typeof(this.ajax_target_attr)=="undefined")
		{
			this.ajax_target_attr = "";
		}

		if(typeof(this.ajax_url)=="undefined")
		{
			this.ajax_url = "";
		}

		if(typeof(this.ajax_form_url)=="undefined")
		{
			this.ajax_form_url = "";
		}

		if(typeof(this.results_url)=="undefined")
		{
			this.results_url = "";
		}

		if(typeof(this.scroll_to_pos)=="undefined")
		{
			this.scroll_to_pos = "";
		}

		if(typeof(this.scroll_on_action)=="undefined")
		{
			this.scroll_on_action = "";
		}
		if(typeof(this.custom_scroll_to)=="undefined")
		{
			this.custom_scroll_to = "";
		}
		this.$custom_scroll_to = jQuery(this.custom_scroll_to);

		if(typeof(this.update_ajax_url)=="undefined")
		{
			this.update_ajax_url = "";
		}

		if(typeof(this.debug_mode)=="undefined")
		{
			this.debug_mode = "";
		}

		if(typeof(this.ajax_target_object)=="undefined")
		{
			this.ajax_target_object = "";
		}

		if(typeof(this.template_is_loaded)=="undefined")
		{
			this.template_is_loaded = "0";
		}

		if(typeof(this.auto_count_refresh_mode)=="undefined")
		{
			this.auto_count_refresh_mode = "0";
		}

		this.ajax_links_selector = $this.attr("data-ajax-links-selector");


		this.auto_update = $this.attr("data-auto-update");
		this.inputTimer = 0;


		/* functions */

		this.reset = function(submit_form)
		{
					
			this.resetForm(submit_form);
			return true;
		}

		this.inputUpdate = function(delayDuration)
		{
			if(typeof(delayDuration)=="undefined")
			{
				var delayDuration = 300;
			}

			self.resetTimer(delayDuration);
		}

		this.dateInputType = function()
		{
			var $thise = $(this);

			if((self.auto_update==1)||(self.auto_count_refresh_mode==1))
			{
				var $tf_date_pickers = $this.find(".sf-datepicker");
				var no_date_pickers = $tf_date_pickers.length;

				if(no_date_pickers>1)
				{
					//then it is a date range, so make sure both fields are filled before updating
					var dp_counter = 0;
					var dp_empty_field_count = 0;
					$tf_date_pickers.each(function(){

						if($(this).val()=="")
						{
							dp_empty_field_count++;
						}

						dp_counter++;
					});

					if(dp_empty_field_count==0)
					{
						self.inputUpdate(1200);
					}
				}
				else
				{
					self.inputUpdate(1200);
				}
			}
		}

		this.scrollToPos = function()
		{
			var offset = 0;
			var canScroll = true;

			if(self.is_ajax==1)
			{
				if(self.scroll_to_pos=="window")
				{
					offset = 0;

				}
				else if(self.scroll_to_pos=="form")
				{
					offset = $this.offset().top;
				}
				else if(self.scroll_to_pos=="results")
				{
					if(self.$ajax_results_container.length>0)
					{
						offset = self.$ajax_results_container.offset().top;
					}
				}
				else if(self.scroll_to_pos=="custom")
				{
					//custom_scroll_to
					if(self.$custom_scroll_to.length>0)
					{
						offset = self.$custom_scroll_to.offset().top;
					}
				}
				else
				{
					canScroll = false;
				}

				if(canScroll)
				{
					$("html, body").stop().animate({
						  scrollTop: offset
					}, "normal", "easeOutQuad" );
				}
			}

		}

		this.initAutoUpdateEvents = function(){

			/* auto update */
			if((self.auto_update==1)||(self.auto_count_refresh_mode==1))
			{
				$this.on('change', 'input[type="radio"], input[type="checkbox"], select', function(e)
				{
					self.inputUpdate(200);
				});
				$this.on('change', '.meta-slider', function(e)
				{
					self.inputUpdate(200);
				});
				$this.on('input', 'input[type="number"]', function(e)
				{
					self.inputUpdate(800);
				});


				var $textInput = $this.find('input[type="text"]:not(.sf-datepicker)');
				var lastValue = $textInput.val();

				$this.on('input', 'input[type="text"]:not(.sf-datepicker)', function()
				{
					if(lastValue!=$textInput.val())
					{
						self.inputUpdate(1200);
					}

					lastValue = $textInput.val();
				});


				$this.on('keypress', 'input[type="text"]:not(.sf-datepicker)', function(e)
				{
					if (e.which == 13)
					{
						e.preventDefault();
						self.submitForm();
						return false;
					}

				});

				$this.on('input', 'input.sf-datepicker', self.dateInputType);

			}
		};

		//this.initAutoUpdateEvents();


		this.clearTimer = function(delayDuration)
		{
			clearTimeout(self.inputTimer);
		};
		this.resetTimer = function(delayDuration)
		{
			clearTimeout(self.inputTimer);
			self.inputTimer = setTimeout(self.formUpdated, delayDuration);

		};

		this.addDatePickers = function()
		{
			var $date_picker = $this.find(".sf-datepicker");

			if($date_picker.length>0)
			{
				$date_picker.each(function(){

					var $this = $(this);
					var dateFormat = "";
					var dateDropdownYear = false;
					var dateDropdownMonth = false;

					var $closest_date_wrap = $this.closest(".sf_date_field");
					if($closest_date_wrap.length>0)
					{
						dateFormat = $closest_date_wrap.attr("data-date-format");

						if($closest_date_wrap.attr("data-date-use-year-dropdown")==1)
						{
							dateDropdownYear = true;
						}
						if($closest_date_wrap.attr("data-date-use-month-dropdown")==1)
						{
							dateDropdownMonth = true;
						}
					}

					var datePickerOptions = {
						inline: true,
						showOtherMonths: true,
						onSelect: self.dateSelect,
						dateFormat: dateFormat,

						changeMonth: dateDropdownMonth,
						changeYear: dateDropdownYear
					};

					if(self.is_rtl==1)
					{
						datePickerOptions.direction = "rtl";
					}

					$this.datepicker(datePickerOptions);

					if(self.lang_code!="")
					{
						$.datepicker.setDefaults(
						  $.extend(
							{'dateFormat':dateFormat},
							$.datepicker.regional[ self.lang_code]
						  )
						);

					}
					else
					{
						$.datepicker.setDefaults(
						  $.extend(
							{'dateFormat':dateFormat},
							$.datepicker.regional["en"]
						  )
						);

					}

				});

				if($('.ll-skin-melon').length==0)
				{
					$date_picker.datepicker('widget').wrap('<div class="ll-skin-melon searchandfilter-date-picker"/>');
				}

			}
		};

		this.dateSelect = function()
		{
			var $thise = $(this);

			if((self.auto_update==1)||(self.auto_count_refresh_mode==1))
			{
				var $tf_date_pickers = $this.find(".sf-datepicker");
				var no_date_pickers = $tf_date_pickers.length;

				if(no_date_pickers>1)
				{
					//then it is a date range, so make sure both fields are filled before updating
					var dp_counter = 0;
					var dp_empty_field_count = 0;
					$tf_date_pickers.each(function(){

						if($(this).val()=="")
						{
							dp_empty_field_count++;
						}

						dp_counter++;
					});

					if(dp_empty_field_count==0)
					{
						self.inputUpdate(1);
					}
				}
				else
				{
					self.inputUpdate(1);
				}
			}
		};

		this.addRangeSliders = function()
		{
			var $meta_range = $this.find(".sf-meta-range-slider");

			if($meta_range.length>0)
			{
				$meta_range.each(function(){

					var $this = $(this);
					var min = $this.attr("data-min");
					var max = $this.attr("data-max");
					var smin = $this.attr("data-start-min");
					var smax = $this.attr("data-start-max");
					var display_value_as = $this.attr("data-display-values-as");
					var step = $this.attr("data-step");
					var $start_val = $this.find('.sf-range-min');
					var $end_val = $this.find('.sf-range-max');


					var decimal_places = $this.attr("data-decimal-places");
					var thousand_seperator = $this.attr("data-thousand-seperator");

					var field_format = wNumb({
						mark: '.',
						decimals: parseFloat(decimal_places),
						thousand: thousand_seperator
					});



					var min_formatted = field_format.to(parseFloat(smin));
					var max_formatted = field_format.to(parseFloat(smax));

					if(display_value_as=="textinput")
					{
						$start_val.val(min_formatted);
						$end_val.val(max_formatted);
					}
					else if(display_value_as=="text")
					{
						$start_val.html(min_formatted);
						$end_val.html(max_formatted);
					}


					var noUIOptions = {
						range: {
							'min': [ parseFloat(min) ],
							'max': [ parseFloat(max) ]
						},
						start: [parseFloat(smin), parseFloat(smax)],
						handles: 2,
						connect: true,
						step: parseFloat(step),

						behaviour: 'extend-tap',
						format: field_format
					};



					if(self.is_rtl==1)
					{
						noUIOptions.direction = "rtl";
					}

					//$(this).find(".meta-slider").noUiSlider(noUIOptions);

					var slider_object = $(this).find(".meta-slider")[0];

					noUiSlider.create(slider_object, noUIOptions);

					//


					$start_val.off();
					$start_val.on('change', function(){
						slider_object.noUiSlider.set([$(this).val(), null]);
					});

					$end_val.off();
					$end_val.on('change', function(){
						slider_object.noUiSlider.set([null, $(this).val()]);
					});

					slider_object.noUiSlider.off('update');
					slider_object.noUiSlider.on('update', function( values, handle ) {

						var slider_start_val  = min_formatted;
						var slider_end_val  = max_formatted;

						var value = values[handle];


						if ( handle ) {
							max_formatted = value;
						} else {
							min_formatted = value;
						}

						if(display_value_as=="textinput")
						{
							$start_val.val(min_formatted);
							$end_val.val(max_formatted);
						}
						else if(display_value_as=="text")
						{
							$start_val.html(min_formatted);
							$end_val.html(max_formatted);
						}


						//i think the function that builds the URL needs to decode the formatted string before adding to the url
						if((self.auto_update==1)||(self.auto_count_refresh_mode==1))
						{
							//only try to update if the values have actually changed
							if((slider_start_val!=min_formatted)||(slider_end_val!=max_formatted))
							{
								self.inputUpdate(800);
							}


						}

					});

				});
			}
		};

		this.init = function(keep_pagination)
		{

			if(typeof(keep_pagination)=="undefined")
			{
				var keep_pagination = false;
			}

			this.initAutoUpdateEvents();

			this.addDatePickers();
			this.addRangeSliders();

			//init combo boxes
			var $combobox = $this.find("select[data-combobox='1']");

			if($combobox.length>0)
			{
				if (typeof $combobox.chosen != "undefined")
				{
					// safe to use the function
					//search_contains
					if(self.is_rtl==1)
					{
						$combobox.addClass("chosen-rtl");
					}

					$combobox.chosen({
						search_contains: true
					});
				}
				else
				{
					
					var select2options = {};
					
					if(self.is_rtl==1)
					{
						select2options.dir = "rtl";
					}
					$combobox.select2(select2options);
				}
			}



			//if ajax is enabled init the pagination
			if(self.is_ajax==1)
			{
				self.setupAjaxPagination();
			}

			$this.submit(this.submitForm);

			self.initWooCommerceControls(); //woocommerce orderby

			if(keep_pagination==false)
			{
				self.last_submit_query_params = self.getUrlParams(false);
			}

		}


		/*if(this.debug_mode=="1")
		{//error logging

			if(self.is_ajax==1)
			{
				if(self.display_results_as=="shortcode")
				{
					if(self.$ajax_results_container.length==0)
					{
						console.log("Search & Filter | Form ID: "+self.sfid+": cannot find the results container on this page - ensure you use the shortcode on this page or provide a URL where it can be found (Results URL)");
					}
					if(self.results_url=="")
					{
						console.log("Search & Filter | Form ID: "+self.sfid+": No Results URL has been defined - ensure that you enter this in order to use the Search Form on any page)");
					}
					//check if results URL is on same domain for potential cross domain errors
				}
				else
				{
					if(self.$ajax_results_container.length==0)
					{
						console.log("Search & Filter | Form ID: "+self.sfid+": cannot find the results container on this page - ensure you use are using the right content selector");
					}
				}
			}
			else
			{

			}

		}*/


		this.stripQueryStringAndHashFromPath = function(url) {
			return url.split("?")[0].split("#")[0];
		}

		this.gup = function( name, url ) {
			if (!url) url = location.href
			name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			var regexS = "[\\?&]"+name+"=([^&#]*)";
			var regex = new RegExp( regexS );
			var results = regex.exec( url );
			return results == null ? null : results[1];
		};


		this.getUrlParams = function(keep_pagination)
		{
			if(typeof(keep_pagination)=="undefined")
			{
				var keep_pagination = true;
			}

			var url_params_str = "";

			// get all params from fields
			var url_params_array = process_form.getUrlParams(self);

			var length = Object.keys(url_params_array).length;
			var count = 0;

			if(length>0)
			{
				for (var k in url_params_array) {
					if (url_params_array.hasOwnProperty(k)) {

						url_params_str += k+"="+url_params_array[k];

						if(count<length-1)
						{
							url_params_str += "&";
						}

						count++;
					}
				}
			}

			var query_params = "";

			//form params as url query string
			//var form_params = url_params_str.replaceAll("%2B", "+").replaceAll("%2C", ",")
			var form_params = url_params_str;

			//get url params from the form itself (what the user has selected)
			query_params = self.joinUrlParam(query_params, form_params);

			//add pagination
			if(keep_pagination==true)
			{
				var pageNumber = self.$ajax_results_container.attr("data-paged");

				if(typeof(pageNumber)=="undefined")
				{
					pageNumber = 1;
				}

				if(pageNumber>1)
				{
					query_params = self.joinUrlParam(query_params, "sf_paged="+pageNumber);
				}
			}

			//add sfid
			//query_params = self.joinUrlParam(query_params, "sfid="+self.sfid);

			// loop through any extra params (from ext plugins) and add to the url (ie woocommerce `orderby`)
			var extra_query_param = "";
			var length = Object.keys(self.extra_query_params).length;
			var count = 0;

			if(length>0)
			{

				for (var k in self.extra_query_params) {
					if (self.extra_query_params.hasOwnProperty(k)) {

						if(self.extra_query_params[k]!="")
						{
							extra_query_param = k+"="+self.extra_query_params[k];
							query_params = self.joinUrlParam(query_params, extra_query_param);
						}
					}
				}
			}


			return query_params;
		}

		this.addUrlParam = function(url, string)
		{
			var add_params = "";

			if(url!="")
			{
				if(url.indexOf("?") != -1)
				{
					add_params += "&";
				}
				else
				{
					//url = this.trailingSlashIt(url);
					add_params += "?";
				}
			}

			if(string!="")
			{

				return url + add_params + string;
			}
			else
			{
				return url;
			}
		};

		this.joinUrlParam = function(params, string)
		{
			var add_params = "";

			if(params!="")
			{
				add_params += "&";
			}

			if(string!="")
			{

				return params + add_params + string;
			}
			else
			{
				return params;
			}
		};

		this.setAjaxResultsURLs = function(query_params)
		{
			if(typeof(self.ajax_results_conf)=="undefined")
			{
				self.ajax_results_conf = new Array();
			}

			self.ajax_results_conf['processing_url'] = "";
			self.ajax_results_conf['results_url'] = "";
			self.ajax_results_conf['data_type'] = "";

			if(self.ajax_url!="")
			{//then we want to do a request to the ajax endpoint
				self.ajax_results_conf['results_url'] = self.addUrlParam(self.results_url, query_params);

				//add lang code to ajax api request, lang code should already be in there for other requests (ie, supplied in the Results URL)

				if(self.lang_code!="")
				{
					//so add it
					query_params = self.joinUrlParam(query_params, "lang="+self.lang_code);
				}

				self.ajax_results_conf['processing_url'] = self.addUrlParam(self.ajax_url, query_params);

				self.ajax_results_conf['data_type'] = 'json';

			}
			else
			{//otherwise we want to pull the results directly from the results page
				self.ajax_results_conf['results_url'] = self.addUrlParam(self.results_url, query_params);
				self.ajax_results_conf['processing_url'] = self.ajax_results_conf['results_url'];
				self.ajax_results_conf['data_type'] = 'html';
			}
		};

		this.fetchAjaxResults = function()
		{
			//trigger start event
			var event_data = {
				sfid: self.sfid,
				targetSelector: self.ajax_target_attr
			};

			$this.trigger("sf:ajaxstart", [ event_data ]);

			//refocus any input fields after the form has been updated
			var $last_active_input_text = $this.find('input[type="text"]:focus').not(".sf-datepicker");
			if($last_active_input_text.length==1)
			{
				var last_active_input_text = $last_active_input_text.attr("name");
			}

			$this.addClass("search-filter-disabled");
			process_form.disableInputs(self);

			//fade out results
			self.$ajax_results_container.animate({ opacity: 0.5 }, "fast"); //loading

			if(self.ajax_action=="pagination")
			{
				query_params = self.last_submit_query_params;

				//now add the new pagination
				var pageNumber = self.$ajax_results_container.attr("data-paged");

				if(typeof(pageNumber)=="undefined")
				{
					pageNumber = 1;
				}

				if(pageNumber>1)
				{
					query_params = self.joinUrlParam(query_params, "sf_paged="+pageNumber);
				}
			}
			else if(self.ajax_action=="submit")
			{
				var query_params = self.getUrlParams();
				self.last_submit_query_params = self.getUrlParams(false); //grab a copy of hte URL params without pagination already added
			}

			var ajax_processing_url = "";
			var ajax_results_url = "";
			var data_type = "";

			self.setAjaxResultsURLs(query_params);
			ajax_processing_url = self.ajax_results_conf['processing_url'];
			ajax_results_url = self.ajax_results_conf['results_url'];
			data_type = self.ajax_results_conf['data_type'];


			//abort any previous ajax requests
			if(self.last_ajax_request)
			{
				self.last_ajax_request.abort();
			}


			self.last_ajax_request = $.get(ajax_processing_url, function(data, status, request)
			{
				self.last_ajax_request = null;

				/* scroll */
				self.scrollResults();

				//updates the resutls & form html
				self.updateResults(data, data_type);

				//setup pagination
				self.setupAjaxPagination();

				/* update URL */
				self.updateUrlHistory(ajax_results_url);


				/* user def */
				self.initWooCommerceControls(); //woocommerce orderby


			}, data_type).fail(function(jqXHR, textStatus, errorThrown)
			{
				var data = {};
				data.sfid = self.sfid;
				data.targetSelector = self.ajax_target_attr;
				data.ajaxURL = ajax_processing_url;
				data.jqXHR = jqXHR;
				data.textStatus = textStatus;
				data.errorThrown = errorThrown;
				$this.trigger("sf:ajaxerror", [ data ]);
				/*console.log("AJAX FAIL");
				console.log(e);
				console.log(x);*/

			}).always(function()
			{
				self.$ajax_results_container.stop(true,true).animate({ opacity: 1}, "fast"); //finished loading
				var data = {};
				data.sfid = self.sfid;
				data.targetSelector = self.ajax_target_attr;

				$this.removeClass("search-filter-disabled");
				process_form.enableInputs(self);

				//refocus the last active text field
				if(last_active_input_text!="")
				{
					var $input = [];
					self.$fields.each(function(){

						var $active_input = $(this).find("input[name='"+last_active_input_text+"']");
						if($active_input.length==1)
						{
							$input = $active_input;
						}

					});
					if($input.length==1)
					{
						$input.focus().val($input.val());
					}


				}

				$this.find("input[name='_sf_search']").focus();
				$this.trigger("sf:ajaxfinish", [ data ]);
			});
		};

		this.fetchAjaxForm = function()
		{
			//trigger start event
			/*var event_data = {
				sfid: self.sfid,
				targetSelector: self.ajax_target_attr
			};*/

			//$this.trigger("sf:ajaxstart", [ event_data ]);

			$this.addClass("search-filter-disabled");
			process_form.disableInputs(self);

			var query_params = self.getUrlParams();

			if(self.lang_code!="")
			{
				//so add it
				query_params = self.joinUrlParam(query_params, "lang="+self.lang_code);
			}

			var ajax_processing_url = self.addUrlParam(self.ajax_form_url, query_params);
			var data_type = "json";


			//abort any previous ajax requests
			/*if(self.last_ajax_request)
			{
				self.last_ajax_request.abort();
			}*/


			//self.last_ajax_request =

			$.get(ajax_processing_url, function(data, status, request)
			{
				//self.last_ajax_request = null;

				//updates the resutls & form html
				self.updateForm(data, data_type);


			}, data_type).fail(function(jqXHR, textStatus, errorThrown)
			{
				var data = {};
				data.sfid = self.sfid;
				data.targetSelector = self.ajax_target_attr;
				data.ajaxURL = ajax_processing_url;
				data.jqXHR = jqXHR;
				data.textStatus = textStatus;
				data.errorThrown = errorThrown;
				$this.trigger("sf:ajaxerror", [ data ]);

			}).always(function()
			{
				var data = {};
				data.sfid = self.sfid;
				data.targetSelector = self.ajax_target_attr;
				//$this.trigger("sf:ajaxfinish", [ data ]);

				$this.removeClass("search-filter-disabled");
				process_form.enableInputs(self);
			});
		};

		this.copyListItemsContents = function($list_from, $list_to)
		{
			var li_contents_array = new Array();

			$list_from.find("> ul > li").each(function(i){

				li_contents_array.push($(this).html());

			});

			var li_it = 0;
			$list_to.find("> ul > li").each(function(i){

				$(this).html(li_contents_array[li_it])

				li_it++;
			});
		}

		this.updateForm = function(data, data_type)
		{
			var self = this;

			if(data_type=="json")
			{//then we did a request to the ajax endpoint, so expect an object back

				if(typeof(data['form'])!=="undefined")
				{
					//remove all events from S&F form
					$this.off();

					//refresh the form (auto count)
					self.copyListItemsContents($(data['form']), $this);

					//re init S&F class on the form
					//$this.searchAndFilter();

					//if ajax is enabled init the pagination

					this.init(true);

					if(self.is_ajax==1)
					{
						self.setupAjaxPagination();
					}



				}
			}


		}
		this.updateResults = function(data, data_type)
		{
			var self = this;

			if(data_type=="json")
			{//then we did a request to the ajax endpoint, so expect an object back
				//grab the results and load in
				self.$ajax_results_container.html(data['results']);

				if(typeof(data['form'])!=="undefined")
				{
					//remove all events from S&F form
					$this.off();

					//remove pagination
					self.removeAjaxPagination();

					//refresh the form (auto count)
					self.copyListItemsContents($(data['form']), $this);

					//re init S&F class on the form
					$this.searchAndFilter({'isInit': false});
				}
				else
				{
					//$this.find("input").removeAttr("disabled");
				}
			}
			else if(data_type=="html")
			{//we are expecting the html of the results page back, so extract the html we need

				var $data_obj = $(data);

				self.$ajax_results_container.html($data_obj.find(self.ajax_target_attr).html());

				var $new_search_form = $data_obj.find(".searchandfilter[data-sf-form-id='"+self.sfid+"']");

				if($new_search_form.length==1)
				{//then replace the search form with the new one

					//remove all events from S&F form
					$this.off();

					//remove pagination
					self.removeAjaxPagination();

					//refresh the form (auto count)
					self.copyListItemsContents($new_search_form, $this);

					//re init S&F class on the form
					$this.searchAndFilter({'isInit': false});
				}
				else
				{
					//$this.find("input").removeAttr("disabled");
				}
			}

		}

		this.removeWooCommerceControls = function(){
			var $woo_orderby = $('.woocommerce-ordering .orderby');
			var $woo_orderby_form = $('.woocommerce-ordering');

			$woo_orderby_form.off();
			$woo_orderby.off();
		};

		this.initWooCommerceControls = function(){

			self.removeWooCommerceControls();

			var $woo_orderby = $('.woocommerce-ordering .orderby');
			var $woo_orderby_form = $('.woocommerce-ordering');

			var order_val = "";
			if($woo_orderby.length>0)
			{
				order_val = $woo_orderby.val();
			}
			else
			{
				order_val = self.getQueryParamFromURL("orderby", window.location.href);
			}

			if(order_val=="menu_order")
			{
				order_val = "";
			}

			if((order_val!="")&&(!!order_val))
			{
				self.extra_query_params.orderby = order_val;
			}


			$woo_orderby_form.on('submit', function(e)
			{
				e.preventDefault();
				//var form = e.target;
				return false;
			});

			$woo_orderby.on("change", function(e)
			{
				e.preventDefault();

				var val = $(this).val();
				if(val=="menu_order")
				{
					val = "";
				}

				self.extra_query_params.orderby = val;

				$this.submit();

				return false;
			});

		}

		this.scrollResults = function()
		{
			var self = this;

			if((self.scroll_on_action==self.ajax_action)||(self.scroll_on_action=="all"))
			{
				self.scrollToPos(); //scroll the window if it has been set
				//self.ajax_action = "";
			}
		}
		this.updateUrlHistory = function(ajax_results_url)
		{
			var self = this;

			var use_history_api = 0;
			if (window.history && window.history.pushState)
			{
				use_history_api = $this.attr("data-use-history-api");
			}

			if((self.update_ajax_url==1)&&(use_history_api==1))
			{
				//now check if the browser supports history state push :)
				if (window.history && window.history.pushState)
				{
					history.pushState(null, null, ajax_results_url);
				}
			}
		}
		this.removeAjaxPagination = function()
		{
			var self = this;

			if(typeof(self.ajax_links_selector)!="undefined")
			{
				var $ajax_links_object = jQuery(self.ajax_links_selector);

				if($ajax_links_object.length>0)
				{
					$ajax_links_object.off();
				}
			}
		}

		this.canFetchAjaxResults = function(fetch_type)
		{
			if(typeof(fetch_type)=="undefined")
			{
				var fetch_type = "";
			}

			var self = this;
			var fetch_ajax_results = false;

			if(self.is_ajax==1)
			{//then we will ajax submit the form

				//and if we can find the results container
				if(self.$ajax_results_container.length==1)
				{
					fetch_ajax_results = true;
				}

				var results_url = self.results_url;
				var current_url = window.location.href;
				var current_url_contains_results_url = current_url.indexOf(results_url);

				if(self.only_results_ajax==1)
				{//if a user has chosen to only allow ajax on results pages (default behaviour)

					if( current_url_contains_results_url > -1)
					{//this means the current URL contains the results url, which means we can do ajax
						fetch_ajax_results = true;
					}
					else
					{
						fetch_ajax_results = false;
					}
				}
				else
				{
					if(fetch_type=="pagination")
					{
						if( current_url_contains_results_url > -1)
						{//this means the current URL contains the results url, which means we can do ajax

						}
						else
						{
							//don't ajax pagination when not on a S&F page
							fetch_ajax_results = false;
						}


					}

				}
			}

			return fetch_ajax_results;
		}

		this.setupAjaxPagination = function()
		{
			if(typeof(self.ajax_links_selector)=="undefined")
			{
				return;
			}

			var $ajax_links_object = jQuery(self.ajax_links_selector);

			if($ajax_links_object.length>0)
			{
				$ajax_links_object.off('click');
				$ajax_links_object.on('click', function(e) {

					if(self.canFetchAjaxResults("pagination"))
					{
						e.preventDefault();

						var link = jQuery(this).attr('href');
						self.ajax_action = "pagination";

						var pageNumber = self.getPagedFromURL(link);

						self.$ajax_results_container.attr("data-paged", pageNumber);

						self.fetchAjaxResults();

						return false;
					}
				});
			}
		};

		this.getPagedFromURL = function(URL){

			var pagedVal = 1;
			//first test to see if we have "/page/4/" in the URL
			var tpVal = self.getQueryParamFromURL("sf_paged", URL);
			if((typeof(tpVal)=="string")||(typeof(tpVal)=="number"))
			{
				pagedVal = tpVal;
			}

			return pagedVal;
		};

		this.getQueryParamFromURL = function(name, URL){

			var qstring = "?"+URL.split('?')[1];
			if(typeof(qstring)!="undefined")
			{
				var val = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(qstring)||[,""])[1].replace(/\+/g, '%20'))||null;
				return val;
			}
			return "";
		};



		this.formUpdated = function(e){

			//e.preventDefault();

			if(self.auto_update==1)
			{
				self.submitForm();
			}
			else if((self.auto_update==0)&&(self.auto_count_refresh_mode==1))
			{
				self.formUpdatedFetchAjax();
			}

			return false;
		};

		this.formUpdatedFetchAjax = function(){

			//loop through all the fields and build the URL
			self.fetchAjaxForm();


			return false;
		};

		this.submitForm = function(e){

			//loop through all the fields and build the URL
			clearTimeout(self.inputTimer);

			self.$ajax_results_container.attr("data-paged", 1); //init paged

			if(self.canFetchAjaxResults())
			{//then we will ajax submit the form
				self.ajax_action = "submit"; //so we know it wasn't pagination


				self.fetchAjaxResults();
			}
			else
			{//then we will simply redirect to the Results URL
				var query_params = self.getUrlParams();
				results_url = self.addUrlParam(self.results_url, query_params);
				window.location.href = results_url;
			}

			return false;
		};



		this.resetForm = function(submit_form)
		{
			//unset all fields
			self.$fields.each(function(){

				var $field = $(this);

				//standard field types
				$field.find("select:not([multiple='multiple']) > option:first-child").prop("selected", true);
				$field.find("select[multiple='multiple'] > option").prop("selected", false);
				$field.find("input[type='checkbox']").prop("checked", false);
				$field.find("> ul > li:first-child input[type='radio']").prop("checked", true);
				$field.find("input[type='text']").val("");


				//number range - 2 number input fields
				$field.find("input[type='number']").each(function(index){

					var $thisInput = $(this);

					if($thisInput.parent().hasClass("sf-meta-range"))
					{
						if(index==0)
						{
							$thisInput.val($thisInput.attr("min"));
						}
						else if(index==1)
						{
							$thisInput.val($thisInput.attr("max"));
						}
					}

				});

				//meta / numbers with 2 inputs (from / to fields) - second input must be reset to max value
				var $meta_select_from_to = $field.find(".sf-meta-range-select-fromto");

				if($meta_select_from_to.length>0)
				{
					var start_min = $meta_select_from_to.attr("data-min");
					var start_max = $meta_select_from_to.attr("data-max");

					$meta_select_from_to.find("select").each(function(index){

						var $thisInput = $(this);

						if(index==0)
						{
							$thisInput.val(start_min);
						}
						else if(index==1)
						{
							$thisInput.val(start_max);
						}

					});
				}

				var $meta_radio_from_to = $field.find(".sf-meta-range-radio-fromto");

				if($meta_radio_from_to.length>0)
				{
					var start_min = $meta_radio_from_to.attr("data-min");
					var start_max = $meta_radio_from_to.attr("data-max");

					var $radio_groups = $meta_radio_from_to.find('.sf-input-range-radio');

					$radio_groups.each(function(index){


						var $radios = $(this).find(".sf-input-radio");
						$radios.prop("checked", false);

						if(index==0)
						{
							$radios.filter('[value="'+start_min+'"]').prop("checked", true);
						}
						else if(index==1)
						{
							$radios.filter('[value="'+start_max+'"]').prop("checked", true);
						}

					});

				}

				//number slider - noUiSlider
				$field.find(".meta-slider").each(function(index){

					 var slider_object = $(this)[0];
					/*var slider_object = $container.find(".meta-slider")[0];
					var slider_val = slider_object.noUiSlider.get();*/

					var $slider_el = $(this).closest(".sf-meta-range-slider");
					var minVal = $slider_el.attr("data-min");
					var maxVal = $slider_el.attr("data-max");
					slider_object.noUiSlider.set([minVal, maxVal]);

				});

				//need to see if any are combobox and act accordingly
				var $combobox = $field.find("select[data-combobox='1']");
				if($combobox.length>0)
				{
					if (typeof $combobox.chosen != "undefined")
					{
						$combobox.trigger("chosen:updated"); //for chosen only
					}
					else
					{
						$combobox.val('');
						$combobox.trigger('change.select2');
					}
				}
				

			});
			self.clearTimer();
			
			
			
			if(submit_form=="always")
			{
				self.submitForm();
			}
			else if(submit_form=="never")
			{
				if(this.auto_count_refresh_mode==1)
				{
					self.formUpdatedFetchAjax();
				}
			}
			else if(submit_form=="auto")
			{
				if(this.auto_update==true)
				{
					self.submitForm();
				}
				else
				{
					if(this.auto_count_refresh_mode==1)
					{
						self.formUpdatedFetchAjax();
					}
				}
			}
			
		};

		this.init();

		var event_data = {};
		event_data.sfid = self.sfid;
		event_data.targetSelector = self.ajax_target_attr;
		if(opts.isInit)
		{
			$this.trigger("sf:init", [ event_data ]);
		}

	});
};

},{"./process_form":6,"./state":7,"nouislider":2}],6:[function(require,module,exports){

var $ = (window.jQuery);

module.exports = {
	
	init: function(){
		
		//this.$fields = $fields;
		
		this.clearUrlComponents();
	},
	
	getUrlParams: function($form){
		
		this.buildUrlComponents($form, true);
		return this.url_params;
			
	},
	clearUrlComponents: function(){
		//this.url_components = "";
		this.url_params = {};
	},
	disableInputs: function($form){
		var self = this;
		
		$form.$fields.each(function(){
			
			var $inputs = $(this).find("input, select, .meta-slider");
			$inputs.attr("disabled", "disabled");
			$inputs.attr("disabled", true);
			$inputs.prop("disabled", true);
			$inputs.trigger("chosen:updated");
			
		});
		
		
	},
	enableInputs: function($form){
		var self = this;
		
		$form.$fields.each(function(){
			
			var $inputs = $(this).find("input, select, .meta-slider");
			$inputs.prop("disabled", true);
			$inputs.removeAttr("disabled");
			$inputs.trigger("chosen:updated");			
		});
		
		
	},
	buildUrlComponents: function($form, clear_components){
		
		var self = this;
		
		if(typeof(clear_components)!="undefined")
		{
			if(clear_components==true)
			{
				this.clearUrlComponents();
			}
		}
		
		$form.$fields.each(function(){
			
			var fieldName = $(this).attr("data-sf-field-name");
			var fieldType = $(this).attr("data-sf-field-type");
			
			if(fieldType=="search")
			{
				self.processSearchField($(this));
			}
			else if((fieldType=="tag")||(fieldType=="category")||(fieldType=="taxonomy"))
			{
				self.processTaxonomy($(this));
			}
			else if(fieldType=="sort_order")
			{
				self.processSortOrderField($(this));
			}
			else if(fieldType=="posts_per_page")
			{
				self.processResultsPerPageField($(this));
			}
			else if(fieldType=="author")
			{
				self.processAuthor($(this));
			}
			else if(fieldType=="post_type")
			{
				self.processPostType($(this));
			}
			else if(fieldType=="post_date")
			{
				self.processPostDate($(this));
			}
			else if(fieldType=="post_meta")
			{
				self.processPostMeta($(this));
				
			}
			else
			{
				
			}
			
		});
		
	},
	processSearchField: function($container)
	{
		var self = this;
		
		var $field = $container.find("input");
		
		if($field.length>0)
		{
			var fieldName = $field.attr("name").replace('[]', '');;
			var fieldVal = $field.val();
			
			if(fieldVal!="")
			{
				//self.url_components += "&_sf_s="+encodeURIComponent(fieldVal);
				self.url_params['_sf_s'] = encodeURIComponent(fieldVal);
			}
		}
	},
	processSortOrderField: function($container)
	{
		this.processAuthor($container);
		
	},
	processResultsPerPageField: function($container)
	{
		this.processAuthor($container);
		
	},
	getSelectVal: function($field){
		
		var fieldVal = "";
		
		if($field.val()!=0)
		{
			fieldVal = $field.val();
		}
		
		if(fieldVal==null)
		{
			fieldVal = "";
		}
		
		return fieldVal;
	},
	getMetaSelectVal: function($field){
		
		var fieldVal = "";
		
		fieldVal = $field.val();
						
		if(fieldVal==null)
		{
			fieldVal = "";
		}
		
		return fieldVal;
	},
	getMultiSelectVal: function($field, operator){
		
		var delim = "+";
		if(operator=="or")
		{
			delim = ",";
		}
		
		if(typeof($field.val())=="object")
		{
			if($field.val()!=null)
			{
				return $field.val().join(delim);
			}
		}
		
	},
	getMetaMultiSelectVal: function($field, operator){
		
		var delim = "-+-";
		if(operator=="or")
		{
			delim = "-,-";
		}
				
		if(typeof($field.val())=="object")
		{
			if($field.val()!=null)
			{
				
				var fieldval = [];
				
				$($field.val()).each(function(index,value){
					
					fieldval.push((value));
				});
				
				return fieldval.join(delim);
			}
		}
		
		return "";
		
	},
	getCheckboxVal: function($field, operator){
		
		
		var fieldVal = $field.map(function(){
			if($(this).prop("checked")==true)
			{
				return $(this).val();
			}
		}).get();
		
		var delim = "+";
		if(operator=="or")
		{
			delim = ",";
		}
		
		return fieldVal.join(delim);
	},
	getMetaCheckboxVal: function($field, operator){
		
		
		var fieldVal = $field.map(function(){
			if($(this).prop("checked")==true)
			{
				return ($(this).val());
			}
		}).get();
		
		var delim = "-+-";
		if(operator=="or")
		{
			delim = "-,-";
		}
		
		return fieldVal.join(delim);
	},
	getRadioVal: function($field){
							
		var fieldVal = $field.map(function()
		{
			if($(this).prop("checked")==true)
			{
				return $(this).val();
			}
			
		}).get();
		
		
		if(fieldVal[0]!=0)
		{
			return fieldVal[0];
		}
	},
	getMetaRadioVal: function($field){
							
		var fieldVal = $field.map(function()
		{
			if($(this).prop("checked")==true)
			{
				return $(this).val();
			}
			
		}).get();
		
		return fieldVal[0];
	},
	processAuthor: function($container)
	{
		var self = this;
		
		
		var fieldType = $container.attr("data-sf-field-type");
		var inputType = $container.attr("data-sf-field-input-type");
		
		var $field;
		var fieldName = "";
		var fieldVal = "";
		
		if(inputType=="select")
		{
			$field = $container.find("select");
			fieldName = $field.attr("name").replace('[]', '');
			
			fieldVal = self.getSelectVal($field); 
		}
		else if(inputType=="multiselect")
		{
			$field = $container.find("select");
			fieldName = $field.attr("name").replace('[]', '');
			var operator = $field.attr("data-operator");
			
			fieldVal = self.getMultiSelectVal($field, "or");
			
		}
		else if(inputType=="checkbox")
		{
			$field = $container.find("ul > li input:checkbox");
			
			if($field.length>0)
			{
				fieldName = $field.attr("name").replace('[]', '');
										
				var operator = $container.find("> ul").attr("data-operator");
				fieldVal = self.getCheckboxVal($field, "or");
			}
			
		}
		else if(inputType=="radio")
		{
			
			$field = $container.find("ul > li input:radio");
						
			if($field.length>0)
			{
				fieldName = $field.attr("name").replace('[]', '');
				
				fieldVal = self.getRadioVal($field);
			}
		}
		
		if(typeof(fieldVal)!="undefined")
		{
			if(fieldVal!="")
			{
				var fieldSlug = "";
				
				if(fieldName=="_sf_author")
				{
					fieldSlug = "authors";
				}
				else if(fieldName=="_sf_sort_order")
				{
					fieldSlug = "sort_order";
				}
				else if(fieldName=="_sf_ppp")
				{
					fieldSlug = "_sf_ppp";
				}
				else if(fieldName=="_sf_post_type")
				{
					fieldSlug = "post_types";
				}
				else
				{
				
				}
				
				if(fieldSlug!="")
				{
					//self.url_components += "&"+fieldSlug+"="+fieldVal;
					self.url_params[fieldSlug] = fieldVal;
				}
			}
		}
		
	},
	processPostType : function($this){
		
		this.processAuthor($this);
		
	},
	processPostMeta: function($container)
	{
		var self = this;
		
		var fieldType = $container.attr("data-sf-field-type");
		var inputType = $container.attr("data-sf-field-input-type");
		var metaType = $container.attr("data-sf-meta-type");
		
		//console.log("-------");
		//console.log("metaType: " + metaType);
		//console.log("fieldType: " + fieldType);
		
		var fieldVal = "";
		var $field;
		var fieldName = "";
		
		if(metaType=="number")
		{
			if(inputType=="range-number")
			{
				$field = $container.find(".sf-meta-range-number input");
				
				var values = [];
				$field.each(function(){
					
					values.push($(this).val());
				
				});
				
				fieldVal = values.join("+");
				
			}
			else if(inputType=="range-slider")
			{
				$field = $container.find(".sf-meta-range-slider input");
				
				//get any number formatting stuff
				var $meta_range = $container.find(".sf-meta-range-slider");
				
				var decimal_places = $meta_range.attr("data-decimal-places");
				var thousand_seperator = $meta_range.attr("data-thousand-seperator");
				
				var field_format = wNumb({
					mark: '.',
					decimals: parseFloat(decimal_places),
					thousand: thousand_seperator
				});
				
				var values = [];
				
				var slider_object = $container.find(".meta-slider")[0];
				var slider_val = slider_object.noUiSlider.get();
				
				values.push(field_format.from(slider_val[0]));
				values.push(field_format.from(slider_val[1]));
				
				fieldVal = values.join("+");
				
				fieldName = $meta_range.attr("data-sf-field-name");
				
				
			}
			else if(inputType=="range-radio")
			{
				$field = $container.find(".sf-input-range-radio");
				
				if($field.length==0)
				{
					//then try again, we must be using a single field
					$field = $container.find("> ul");
				}
				
				
				/*if($field.length>0)
				{
					fieldVal = self.getRadioVal($field);
				}*/
				
				console.log("here");
				
				var $meta_range = $container.find(".sf-meta-range");
				
				//there is an element with a from/to class - so we need to get the values of the from & to input fields seperately
				
				if($field.length>0)
				{	
					var field_vals = [];
					
					$field.each(function(){
						
						var $radios = $(this).find(".sf-input-radio");;
						field_vals.push(self.getMetaRadioVal($radios));
						
					});
					
					//prevent second number from being lower than the first
					if(field_vals.length==2)
					{
						if(Number(field_vals[1])<Number(field_vals[0]))
						{
							field_vals[1] = field_vals[0];
						}
					}
					
					fieldVal = field_vals.join("+");
				}
								
				if($field.length==1)
				{
					fieldName = $field.find(".sf-input-radio").attr("name").replace('[]', '');
				}
				else
				{
					fieldName = $meta_range.attr("data-sf-field-name");
				}
				
				console.log("$field.length: "+$field.length);
			}
			else if(inputType=="range-select")
			{
				$field = $container.find(".sf-input-select");
				var $meta_range = $container.find(".sf-meta-range");
				
				//there is an element with a from/to class - so we need to get the values of the from & to input fields seperately
				
				if($field.length>0)
				{
					var field_vals = [];
					
					$field.each(function(){
						
						var $this = $(this);
						field_vals.push(self.getMetaSelectVal($this));
						
					});
					
					//prevent second number from being lower than the first
					if(field_vals.length==2)
					{
						if(Number(field_vals[1])<Number(field_vals[0]))
						{
							field_vals[1] = field_vals[0];
						}
					}
					
					
					fieldVal = field_vals.join("+");
				}
								
				if($field.length==1)
				{
					fieldName = $field.attr("name").replace('[]', '');
				}
				else
				{
					fieldName = $meta_range.attr("data-sf-field-name");
				}
				
			}
			else if(inputType=="range-checkbox")
			{
				$field = $container.find("ul > li input:checkbox");
				
				if($field.length>0)
				{
					fieldVal = self.getCheckboxVal($field, "and");
				}
			}
			
			if(fieldName=="")
			{
				fieldName = $field.attr("name").replace('[]', '');
			}
		}
		else if(metaType=="choice")
		{
			if(inputType=="select")
			{
				$field = $container.find("select");
				
				fieldVal = self.getMetaSelectVal($field); 
				
			}
			else if(inputType=="multiselect")
			{
				$field = $container.find("select");
				var operator = $field.attr("data-operator");
				
				fieldVal = self.getMetaMultiSelectVal($field, operator);
			}
			else if(inputType=="checkbox")
			{
				$field = $container.find("ul > li input:checkbox");
				
				if($field.length>0)
				{
					var operator = $container.find("> ul").attr("data-operator");
					fieldVal = self.getMetaCheckboxVal($field, operator);
				}
			}
			else if(inputType=="radio")
			{
				$field = $container.find("ul > li input:radio");
				
				if($field.length>0)
				{
					fieldVal = self.getMetaRadioVal($field);
				}
			}
			
			fieldVal = encodeURIComponent(fieldVal);
			if(typeof($field)!=="undefined")
			{
				if($field.length>0)
				{
					fieldName = $field.attr("name").replace('[]', '');
					
					//for those who insist on using & ampersands in the name of the custom field (!)
					fieldName = (fieldName);
				}
			}
			
		}
		else if(metaType=="date")
		{
			self.processPostDate($container);
		}
		
		if(typeof(fieldVal)!="undefined")
		{
			if(fieldVal!="")
			{
				//self.url_components += "&"+encodeURIComponent(fieldName)+"="+(fieldVal);
				self.url_params[encodeURIComponent(fieldName)] = (fieldVal);
			}
		}
	},
	processPostDate: function($container)
	{
		var self = this;
		
		var fieldType = $container.attr("data-sf-field-type");
		var inputType = $container.attr("data-sf-field-input-type");
		
		var $field;
		var fieldName = "";
		var fieldVal = "";
		
		$field = $container.find("ul > li input:text");
		fieldName = $field.attr("name").replace('[]', '');
		
		var dates = [];
		$field.each(function(){
			
			dates.push($(this).val());
		
		});
		
		if($field.length==2)
		{
			if((dates[0]!="")||(dates[1]!=""))
			{
				fieldVal = dates.join("+");
				fieldVal = fieldVal.replace(/\//g,'');
			}
		}
		else if($field.length==1)
		{
			if(dates[0]!="")
			{
				fieldVal = dates.join("+");
				fieldVal = fieldVal.replace(/\//g,'');
			}
		}
		
		if(typeof(fieldVal)!="undefined")
		{
			if(fieldVal!="")
			{
				var fieldSlug = "";
				
				if(fieldName=="_sf_post_date")
				{
					fieldSlug = "post_date";
				}
				else
				{
					fieldSlug = fieldName;
				}
				
				if(fieldSlug!="")
				{
					//self.url_components += "&"+fieldSlug+"="+fieldVal;
					self.url_params[fieldSlug] = fieldVal;
				}
			}
		}
		
	},
	processTaxonomy: function($container)
	{
		//if()					
		//var fieldName = $(this).attr("data-sf-field-name");
		var self = this;
	
		var fieldType = $container.attr("data-sf-field-type");
		var inputType = $container.attr("data-sf-field-input-type");
		
		var $field;
		var fieldName = "";
		var fieldVal = "";
		
		if(inputType=="select")
		{
			$field = $container.find("select");
			fieldName = $field.attr("name").replace('[]', '');
			
			fieldVal = self.getSelectVal($field); 
		}
		else if(inputType=="multiselect")
		{
			$field = $container.find("select");
			fieldName = $field.attr("name").replace('[]', '');
			var operator = $field.attr("data-operator");
			
			fieldVal = self.getMultiSelectVal($field, operator);
		}
		else if(inputType=="checkbox")
		{
			$field = $container.find("ul > li input:checkbox");
			if($field.length>0)
			{
				fieldName = $field.attr("name").replace('[]', '');
										
				var operator = $container.find("> ul").attr("data-operator");
				fieldVal = self.getCheckboxVal($field, operator);
			}
		}
		else if(inputType=="radio")
		{
			$field = $container.find("ul > li input:radio");
			if($field.length>0)
			{
				fieldName = $field.attr("name").replace('[]', '');
				
				fieldVal = self.getRadioVal($field);
			}
		}
		
		if(typeof(fieldVal)!="undefined")
		{
			if(fieldVal!="")
			{
				//self.url_components += "&"+fieldName+"="+fieldVal;
				self.url_params[fieldName] = fieldVal;
			}
		}
	}
};
},{}],7:[function(require,module,exports){

module.exports = {
	
	searchForms: {},
	
	init: function(){
		
		
	},
	addSearchForm: function(id, object){
		
		this.searchForms[id] = object;
	},
	getSearchForm: function(id)
	{
		return this.searchForms[id];	
	}
	
};
},{}]},{},[1]);

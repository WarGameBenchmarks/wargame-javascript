// https://gist.github.com/saich/2993641
/**
 * @constructor
 */
function Profiler() {
}

/**
 * Uses the best resolution timer that is currently available.
 * The return value of this can only be used for measuring the time interval,
 * and *MUST NOT* be used to get the absolute current time.
 *
 * Make sure now to change any global variable/state. (Do not override the window.performance object,
 * but just maintain a reference to the browser function if you just want to use it)
 *
 * @return {Number}
 */
Profiler.time = (function() {
	var perf = window.performance || {};
	var fn = perf.now || perf.mozNow || perf.webkitNow || perf.msNow || perf.oNow;
	// fn.bind will be available in all the browsers that support the advanced window.performance... ;-)
	return fn ? fn.bind(perf) : function() { return new Date().getTime(); };
})();

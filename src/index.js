import isString from 'is-string';
import { intersection as getIntersectionData } from 'mezr/mezr.js';

let globalTimerIntervals = [];

/**
 * @readonly
 * @enum {string}
 */
const overlapTypes = {
    intersect: 'intersect', // if any of the pixels are touching
    overlap: 'overlap',     // if `element1` completely surrounds `element2`
    contain: 'contain'      // if `element2` completely surrounds `element1`
};

/**
 * @readonly
 * @enum {string}
 */
const listenOnOptions = {
    timer: 'timer',
    scroll: 'scroll',
    resize: 'resize'
};

/**
 * @name listenForOverlapOptions
 * @type {object}
 * @property {(listenOnOptions|Array.<listenOnOptions>)}        listenOn
 * @property {number}                                           timerInterval
 * @property {overlapTypes}                                     requiredIntersection
 * @property {*}                                                callbackData
 */

/**
 * Gets an HTML element. If `element` is a CSS selector, it will find the element in the DOM. If
 * `element` is already an `HTMLElement`, it will return it.
 *
 * @param {(string|HTMLElement)} element
 * @return {Element}
 */
function getElement(element) {
    if (isString(element)) {
        return document.querySelector(element);
    } else {
        return element;
    }
}

/**
 * @param {!HTMLElement} a
 * @param {!HTMLElement} b
 */
function doesElementContainElement(a,b) {
    const el1Rect = a.getBoundingClientRect();
    const el2Rect = b.getBoundingClientRect();

    const doesContainHorizontally   = (el1Rect.left <= el2Rect.left) && (el1Rect.right >= el2Rect.right);
    const doesContainVertically     = (el1Rect.top <= el2Rect.top) && (el1Rect.bottom >= el2Rect.bottom);

    return doesContainHorizontally && doesContainVertically;
}

/**
 * @param {!HTMLElement} element1
 * @param {!HTMLElement} element2
 * @param {!function} callback
 * @param {!Object} options
 * @return {null}
 */
function triggerCallbackIfElementsAreOverlapping(element1, element2, callback, options) {

    const intersection = getIntersectionData(element1, element2, true);

    if (!intersection) {
        return null;
    }

    switch (options.intersection) {
        case overlapTypes.intersect:
            callback(options.callbackData);
            break;
        case overlapTypes.contain:
            if (doesElementContainElement(element2, element1)) {
                callback(options.callbackData);
            }
            break;
        case overlapTypes.overlap:
            if (doesElementContainElement(element1, element2)) {
                callback(options.callbackData);
            }
            break;
        default:
            throw new RangeError('Unsupported intersection type ' + options.intersection);
    }
}

/**
 * @param {!(string|HTMLElement)} element1
 * @param {!(string|HTMLElement)} element2
 * @param {!function} callback
 * @param {(listenForOverlapOptions|Object]} [options]
 */
export function listenForOverlap(element1, element2, callback, options = {}) {
    if (!element1) {
        throw new ReferenceError(
            'Required argument element1 was not set. ' +
            'Please provide an element to target, or a CSS selector string'
        );
    }

    if (!element2) {
        throw new ReferenceError(
            'Required argument element2 was not set. ' +
            'Please provide an element to target, or a CSS selector string'
        );
    }

    /**
     * @type {HTMLElement}
     */
    element1 = getElement(element1);

    if (!element1) {
        throw new ReferenceError(
            'element1 was not found. ' +
            'Please ensure that the target elements exist at the time of calling this function'
        );
    }

    /**
     * @type {HTMLElement}
     */
    element2 = getElement(element2);

    if (!element2) {
        throw new ReferenceError(
            'element2 was not found. ' +
            'Please ensure that the target elements exist at the time of calling this function'
        );
    }

    /**
     * @type {listenForOverlapOptions}
     */
    const defaultOptions = {
        listenOn: ['timer'],
        timerInterval: (1000 / 2), // defaults to 2-FPS checks
        requiredIntersection: overlapTypes.intersect,
        callbackData: null
    };

    if (isString(options.listenOn)) {
        options = {
            ...options,
            listenOn: [options.listenOn]
        };
    }

    /**
     * @type {listenForOverlapOptions}
     */
    const params = {
        ...defaultOptions,
        ...options
    };

    const theCall = triggerCallbackIfElementsAreOverlapping.bind(
        null,
        element1,
        element2,
        callback,
        {
            intersection: params.requiredIntersection,
            callbackData: params.callbackData
        }
    );

    if (params.listenOn.includes(listenOnOptions.timer)) {
        globalTimerIntervals.push(setInterval(
            theCall,
            params.timerInterval
        ));
    }

    if (params.listenOn.includes(listenOnOptions.scroll)) {
        window.addEventListener('scroll', theCall);
    }

    if (params.listenOn.includes(listenOnOptions.resize)) {
        window.addEventListener('resize', theCall);
    }
}
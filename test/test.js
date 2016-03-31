import {listenForOverlap} from '../lib/index.js';
//var listenForOverlap = require('../lib/index.js').listenForOverlap;

listenForOverlap(
    '#el1', '#el2',
    function(callbackData) {
        alert('The callback data is: ' + callbackData);
    },
    {
        callbackData: 'Hello, world!'
    }
);
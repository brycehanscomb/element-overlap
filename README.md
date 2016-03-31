# element-overlap

Trigger a callback when two DOM elements overlap.

## Usage Example

```js
// For ES6:
import listenForOverlap from 'element-overlap';
// ...or for CommonJS: 
var listenForOverlap = require('element-overlap').listenForOverlap;

listenForOverlap(
    '#element1', '#element2', 
    function() {
        alert('The elements have overlapped!');
    }
);
```

## API and Options

### `void listenForOverlap(element1, element2, callback, options)`

The main method to set up a listener for the overlap. Will call `callback` when the elements are
overlapping according to the value `options.requiredIntersection`.

#### Arguments

##### **`element1`** : < `string` | `HTMLElement` >

The first of the two elements to compare. This can either be a 
[CSS selector string](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors)
or a reference to a DOM element (eg: the result of `getElementById` or `querySelector`).

##### **`element2`** : < `string` | `HTMLElement` >

The second of the two elements to compare. This can either be a 
[CSS selector string](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors)
or a reference to a DOM element (eg: the result of `getElementById` or `querySelector`).

##### **`callback`** : < `function` >

The method to be called when the elements have overlapped (according to the value of 
`options.requiredIntersection`).

If `options.callbackData` is set, this method will be called with `options.callbackData` provided as
its first argument. For example:

```js
listenForOverlap(
    '#element1', '#element2', 
    function(callbackData) {
        alert('The callback data is: ' + callbackData);
    },
    {
        callbackData: 'Hello, world!'
    }
);
```

Then the browser will alert:

```
The callback data is: Hello, world!"
```

This is useful if you want to pass some data to your handler functions or you want to give each 
listener a unique ID.

##### **`options`** : < `Object` > (*optional*)

Extra configuration values can be passed in to customise this module from its default behaviour. 
Pass an object with any of the following:

###### `options.listenOn` : < `string` | `Array.<string>`

The method/s with which to check for overlaps (and subsequently trigger the `callback`). 

Possible values are: 

* `'timer'` - Check every `n` milliseconds (where `n` is set in `options.timerInterval`)
* `'scroll'` - Check whenever user scrolls the browser
* `'resize'` - Check whenever the browser has been resized

Defaults to `'timer'`. If you want to listen on multiple cases, pass in a list like 
`['scroll', 'resize']`. 

**PROTIP: for performance-critical code, don't use `timer`, because it will be doing calculations
every `n` milliseconds even if the browser is not moving. Most of the time you want to react to 
`scroll` and / or `resize`.**

###### `options.timerInterval` : < `number` >

How often the collision-detection should be checked, in milliseconds. Only used if 
`options.listenOn`is set to `'timer'` or `[..., 'timer', ...]`.
  
**PROTIP: Check less often (ie: use a higher number) if your code is performance-critical, because 
then you can avoid doing calculations when not strictly necessary.**

Defaults to `500`, ie: check twice every second (or 2 FPS). This should be good enough for most non-
game applications. Set it even higher if you can in your application. Or even better, use `'resize'`
and / or `'scroll'` in `options.listenOn` instead.

###### `options.requiredIntersection` : < string >

Determines what is considered a proper 'overlap' and subsequently trigger `callback`. The options 
are:

* `'intersect'` - Triggers if any of `element1`'s and `element2`'s pixels are touching.
* `'overlap'` - Triggers if `element1` completely surrounds `element2`. Note that stacking order
does not matter here, just that `element1` must be bigger than `element2`.
* `'contain'` - Triggers if `element1` is completely surrounded by `element2`. Note that stacking 
order does not matter here, just that `element1` must be smaller than `element2`.

Defaults to `'intersect'`.

###### `options.callbackData` : < any >

Arbitrary data to be passed to `callback` when it is eventually triggered. For example:

```js
listenForOverlap(
    '#element1', '#element2', 
    function(callbackData) {
        alert('The callback data is: ' + callbackData);
    },
    {
        callbackData: 'Hello, world!'
    }
);
```

Then the browser will alert:

```
The callback data is: Hello, world!"
```

This is useful if you want to pass some data to your handler functions or you want to give each 
listener a unique ID.
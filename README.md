# Maybe Later.

The module delays the execution of function at a later time.
Deferring a function returns a method that cancels the function execution.

## exports

A function object that provide different ways to delay the execution of a function.

```js
var defer = require("maybe-later")
var cancel = defer(function(){
    console.log("hello world")
})

// if you change your mind
cancel()
```

## method: immediate

Defers the execution of a function in the next iteration loop, as soon as possible.
Uses `setImmediate` if available, falls back to `setTimeout 0`.

```js
var defer = require("maybe-later")
defer.immediate(function(){
    console.log("hello world")
})
```

### note

`defer()` is an alias for `defer.immediate()` (no second argument)
and `defer.timeout()` (second argument as timeout in milliseconds).

## method: frame

Like `defer.immediate`, however `defer.frame` defers the execution of a function on the next animation frame.
If `requestAnimationFrame` is not available, `defer.frame` falls back to `setTimeout` with a 1000 / 60 delay (60 fps).

```js
var defer = require("maybe-later")
defer.frame(function(){
    console.log("hello world")
})
```

### note

This is more resource friendly and faster than simply stacking `requestAnimationFrame` calls
(might depend on the native implementation), as every deferred function belonging
to the same call stack gets executed inside the same `requestAnimationFrame` call.

## method: timeout

Defers the execution of a function on a specified interval.

```js
var defer = require("maybe-later")
defer.timeout(function(){
    console.log("hello world")
}, 1000)
```

### note

This is more resource friendly and faster than simply stacking `setTimeout` calls
(might depend on the native implementation), as every deferred function belonging
to the same call stack with the same timeout gets executed inside the same `setTimeout` call.

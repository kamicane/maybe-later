# Maybe Later

`maybe-later` defers the execution of functions at a later time.
Deferring a function returns a method that cancels the function execution.

`maybe-later` is more resource friendly and faster than simply stacking `requestAnimationFrame` or `setTimeout` calls: every deferred function belonging to the same call stack with the same timeout gets executed inside the same call, at the same time.

When using `maybe-later` for animations everything will be synced properly.

## Basic Usage

```js
const defer = require("maybe-later")
const cancel1 = defer(() => {
  console.log("hello immediate")
})

const cancel2 = defer(() => {
  console.log("hello timeout")
}, 100)

// if you change your mind
cancel1()
cancel2()
```

> `defer()` is an alias for `defer.immediate()` when called with no second argument, and `defer.timeout()` when the second argument is a number (timeout in milliseconds).

## Method: immediate

Defers the execution of a function in the next iteration loop, as soon as possible.
Uses `setImmediate` where available, falls back to `setTimeout(0)`.

```js
const defer = require("maybe-later")
defer.immediate(() => {
  console.log("hello world")
})
```

## Method: frame

Like `defer.immediate`, however `defer.frame` defers the execution of a function on the next animation frame.
If `requestAnimationFrame` is not available, `defer.frame` falls back to `setTimeout` with a `1000 / 60` delay.

```js
const defer = require("maybe-later")
defer.frame(() => {
  console.log("hello world")
})
```

## Method: timeout

Defers the execution of a function after a specified number of milliseconds.

```js
const defer = require("maybe-later")
defer.timeout(() => {
  console.log("hello world")
}, 1000)
```

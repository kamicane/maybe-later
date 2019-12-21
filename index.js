'use strict'

const callbacks = {
  timeout: {},
  frame: {},
  immediate: {}
}

let UID = 0

const push = function (collection, callback, deferrer) {
  let some = false
  // some is assigned a value if there's anything in collection
  for (some in collection) break

  if (!some) {
    deferrer(function () {
      const time = Date.now()

      for (const id in collection) {
        collection[id](time)
        delete collection[id]
      }
    })
  }

  const ID = UID++
  collection[ID] = callback

  return function clear () {
    delete collection[ID]
  }
}

const defer = function (callback, argument) {
  return (typeof argument === 'number')
    ? defer.timeout(callback, argument)
    : defer.immediate(callback, argument)
}

if (global.setImmediate) {
  defer.immediate = function (callback) {
    return push(callbacks.immediate, callback, global.setImmediate)
  }
} else {
  defer.immediate = function (callback) {
    return defer.timeout(callback, 0)
  }
}

const requestAnimationFrame = global.requestAnimationFrame

defer.frame = requestAnimationFrame ? function (callback) {
  return push(callbacks.frame, callback, requestAnimationFrame)
} : (callback) => {
  return defer.timeout(callback, 1000 / 60)
}

let mark

defer.timeout = function (callback, ms) {
  // Destroy the callbacks.timeout collection, so that same-timer timeouts
  // added after the runloop get assigned to a different sub collections.
  // For example, adding a 40ms timeout, then waiting 20ms, then adding
  // another 40ms timeout would results in the two 40ms timeouts getting
  // squished together which is obviously wrong. This makes sure that
  // timeout collections only live for a single runloop.
  if (!mark) {
    mark = defer.immediate(function () {
      mark = null
      callbacks.timeout = {}
    })
  }

  const collection = callbacks.timeout[ms] || (callbacks.timeout[ms] = {})

  return push(collection, callback, (callback) => {
    setTimeout(callback, ms)
  })
}

module.exports = defer

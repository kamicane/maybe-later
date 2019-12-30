'use strict'

const CALLBACKS = {
  timeout: Object.create(null),
  frame: Object.create(null),
  immediate: Object.create(null)
}

let UID = 0

const push = (collection, callback, deferrer) => {
  let some = false
  // some is assigned a value if there's anything in collection
  for (some in collection) break

  if (!some) {
    deferrer(() => {
      const time = Date.now()

      for (const id in collection) {
        collection[id](time)
        delete collection[id]
      }
    })
  }

  const id = UID++
  collection[id] = callback

  return () => {
    delete collection[id]
  }
}

const defer = (callback, argument) =>
  typeof argument === 'number'
    ? defer.timeout(callback, argument)
    : defer.immediate(callback, argument)

if (global.setImmediate) {
  defer.immediate = (callback) =>
    push(CALLBACKS.immediate, callback, global.setImmediate)
} else {
  defer.immediate = (callback) => defer.timeout(callback, 0)
}

const requestAnimationFrame = global.requestAnimationFrame

defer.frame = requestAnimationFrame
  ? (callback) => push(CALLBACKS.frame, callback, requestAnimationFrame)
  : (callback) => defer.timeout(callback, 1000 / 60)

let mark

defer.timeout = (callback, ms) => {
  // Destroy the callbacks.timeout collection, so that same-timer timeouts
  // added after the runloop get assigned to a different sub collections.
  // For example, adding a 40ms timeout, then waiting 20ms, then adding
  // another 40ms timeout would results in the two 40ms timeouts getting
  // squished together which is obviously wrong. This makes sure that
  // timeout collections only live for a single runloop.
  if (!mark) {
    mark = defer.immediate(() => {
      mark = null
      CALLBACKS.timeout = Object.create(null)
    })
  }

  const collection =
    CALLBACKS.timeout[ms] ||
    (CALLBACKS.timeout[ms] = Object.create(null))

  return push(collection, callback, (callback) => {
    setTimeout(callback, ms)
  })
}

defer.wait = (...args) =>
  new Promise((resolve) => {
    defer(resolve, ...args)
  })

const CANCELS = Object.create(null)

defer.once = (name, ...args) => {
  if (CANCELS[name]) {
    CANCELS[name]()
    delete CANCELS[name]
  }
  return (CANCELS[name] = defer(...args))
}

module.exports = defer

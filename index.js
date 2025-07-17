import { PriorityQueue } from './pq';

/** @typedef {{ t: number, i: number, r: boolean }} QueuedFunction */

/** @type {PriorityQueue<QueuedFunction>} */
const q = new PriorityQueue((a, b) => a.t - b.t);
const qLock = new (Java.type('java.util.concurrent.locks.ReentrantLock'))();
/** @type {Map<number, () => void>} */
const funcMap = new Map();
const funcMapLock = new (Java.type('java.util.concurrent.locks.ReentrantLock'))();
const getNextFuncId = (function() {
  const num = new (Java.type('java.util.concurrent.atomic.AtomicInteger'))(0);
  /** @returns {number} */
  return () => num.incrementAndGet();
})();
function checkQueue() {
  const t = Date.now();
  while (true) {
    qLock.lock();
    try {
      if (q.size() === 0 || q.peek().t > t) break;
      var v = q.pop();
    } finally {
      qLock.unlock();
    }
    funcMapLock.lock();
    try {
      var f = funcMap.get(v.i);
    } finally {
      funcMapLock.unlock();
    }
    try {
      f?.();
    } finally {
      if (v.r) funcMap.delete(v.i);
    }
  }
}

register('renderWorld', checkQueue).setPriority(Priority.LOWEST);
register('renderOverlay', checkQueue).setPriority(Priority.LOWEST);
register('tick', checkQueue).setPriority(Priority.LOWEST);

const lmaoFuckRhino = a => a ? a : [];
/**
 * @param {() => void} func
 * @param {number} timeout
 * @param {number} id
 * @param {boolean} remove
 * @returns {number}
 */
function scheduleCall(func, timeout, id, remove) {
  funcMapLock.lock();
  try {
    funcMap.set(id, func);
  } finally {
    funcMapLock.unlock();
  }
  addToQueue(id, timeout, remove);
  return id;
}
const getTime = (function() {
  let p = 0;
  let c = 0;
  return function() {
    const t = Date.now();
    if (p === t) return t + (++c) / 1000;
    p = t;
    c = 0;
    return t;
  };
})();
/**
 * @param {number} id
 * @param {number} timeout
 * @param {boolean} remove
 */
function addToQueue(id, timeout, remove) {
  qLock.lock();
  try {
    q.push({ i: id, t: getTime() + timeout, r: remove });
  } finally {
    qLock.unlock();
  }
}

/**
 * @template T
 * @param {(...args: T) => void} func
 * @param {number} [timeout]
 * @param {...T} args
 */
export function setTimeout(func, timeout = 0, ...args) {
  return scheduleCall(func.bind(this, ...lmaoFuckRhino(args)), timeout + 0.9999, getNextFuncId(), true);
}
export function clearTimeout(id) {
  funcMapLock.lock();
  try {
    funcMap.delete(id);
  } finally {
    funcMapLock.unlock();
  }
}
/**
 * @template T
 * @param {(...args: T) => void} func
 * @param {...T} args
 */
export function setImmediate(func, ...args) {
  return scheduleCall(func.bind(this, ...lmaoFuckRhino(args)), 0, getNextFuncId(), true);
}
export function clearImmediate(id) {
  clearTimeout(id);
}
/**
 * NOTE: will automatically schedule a new call *after* the function has ran.
 *
 * that is: theoretical execution time -> actual execution time -> function call time -> **THEN** schedule another call in `interval` ms
 *
 * whereas in a browser it would attempt to execute every `interval` ms, even if a call is already overlapping. this will make a large difference, if per se, `interval = 500` but `func` takes 499ms to run. in a browser, func would be available to call in 1s but this polyfill will wait another full 500ms
 *
 * i was too lazy to change my implementation to do that, as well as build a detection for however many calls for that function are queued up, as well as impose a limit on the maximum number of queued calls. deal with it who tf uses `setInterval` anyway use `register('step', () => {})`
 * @template T
 * @param {(...args: T) => void} func
 * @param {number} [interval]
 * @param {...T} args
 */
export function setInterval(func, interval = 0, ...args) {
  const id = getNextFuncId();
  const f = func.bind(this, ...lmaoFuckRhino(args));
  return scheduleCall(() => {
    f();
    // why is it associated with the queue and not the function?
    // good question idk
    // fyi. the item in queue is always deleted, the map is only deleted if queue item tells it to
    addToQueue(id, interval, false);
  }, interval, id, false);
}
export function clearInterval(id) {
  clearTimeout(id);
}
// what are you doing

/** @typedef {{}} Future */

/** @type {Map<number, Future>} */
const futureMap = new Map();
const futureMapLock = new (Java.type('java.util.concurrent.locks.ReentrantLock'))();
const getNextFuncId = (function() {
  const num = new (Java.type('java.util.concurrent.atomic.AtomicInteger'))(0);
  /** @returns {number} */
  return () => num.incrementAndGet();
})();

const lmaoFuckRhino = a => a ? a : [];
/**
 * @param {Future} future
 * @param {number} id
 * @returns {number}
 */
function registerCall(future, id) {
  futureMapLock.lock();
  try {
    futureMap.set(id, future);
  } finally {
    futureMapLock.unlock();
  }
  return id;
}
const wrap = (func, id) => () => {
  func();
  futureMapLock.lock();
  try {
    futureMap.delete(id);
  } finally {
    futureMapLock.unlock();
  }
};

const executor = java.util.concurrent.Executors.newSingleThreadScheduledExecutor();
const MS = java.util.concurrent.TimeUnit.MILLISECONDS;
/**
 * @template T
 * @param {(...args: T[]) => void} func
 * @param {number} [timeout]
 * @param {...T} args
 */
export function setTimeout(func, timeout = 0, ...args) {
  const future = executor['schedule(java.lang.Runnable,long,java.util.concurrent.TimeUnit)'](wrap(func.bind(this, ...lmaoFuckRhino(args))), timeout, MS);
  const id = registerCall(future, getNextFuncId());
  return id;
}
export function clearTimeout(id) {
  futureMapLock.lock();
  try {
    var future = futureMap.get(id);
    futureMap.delete(id);
  } finally {
    futureMapLock.unlock();
  }
  future.cancel(false);
}
/**
 * @template T
 * @param {(...args: T[]) => void} func
 * @param {...T} args
 */
export function setImmediate(func, ...args) {
  const future = executor['schedule(java.lang.Runnable,long,java.util.concurrent.TimeUnit)'](wrap(func.bind(this, ...lmaoFuckRhino(args))), 0, MS);
  const id = registerCall(future, getNextFuncId());
  return id;
}
export function clearImmediate(id) {
  futureMapLock.lock();
  try {
    var future = futureMap.get(id);
    futureMap.delete(id);
  } finally {
    futureMapLock.unlock();
  }
  future.cancel(false);
}
/**
 * @template T
 * @param {(...args: T[]) => void} func
 * @param {number} [interval]
 * @param {...T} args
 */
export function setInterval(func, interval = 0, ...args) {
  const future = executor.scheduleAtFixedRate(wrap(func.bind(this, ...lmaoFuckRhino(args))), interval, interval, MS);
  const id = registerCall(future, getNextFuncId());
  return id;
}
export function clearInterval(id) {
  futureMapLock.lock();
  try {
    var future = futureMap.get(id);
    futureMap.delete(id);
  } finally {
    futureMapLock.unlock();
  }
  future.cancel(false);
}
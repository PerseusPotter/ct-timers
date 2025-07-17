const main = require('./mainThread');
const packet = require('./packetThread');
const dedicated = require('./dedicatedThread');

let mainThread;
let packetThread;

function select() {
  const curr = Thread.currentThread();
  return mainThread === curr ? main : packetThread === curr ? packet : dedicated;
}

Client.scheduleTask(() => mainThread = Thread.currentThread());
const packetReg = register('packetReceived', () => {
  packetThread = Thread.currentThread();
  packetReg.unregister();
});

/** @type {ReturnType<typeof import('./util/timer')['default']>['exports']['setTimeout']} */
export function setTimeout() {
  return select().setTimeout.apply(this, arguments);
}
/** @type {ReturnType<typeof import('./util/timer')['default']>['exports']['clearTimeout']} */
export function clearTimeout() {
  return select().clearTimeout.apply(this, arguments);
}
/** @type {ReturnType<typeof import('./util/timer')['default']>['exports']['setImmediate']} */
export function setImmediate() {
  return select().setImmediate.apply(this, arguments);
}
/** @type {ReturnType<typeof import('./util/timer')['default']>['exports']['clearImmediate']} */
export function clearImmediate() {
  return select().clearImmediate.apply(this, arguments);
}
/** @type {ReturnType<typeof import('./util/timer')['default']>['exports']['setInterval']} */
export function setInterval() {
  return select().setInterval.apply(this, arguments);
}
/** @type {ReturnType<typeof import('./util/timer')['default']>['exports']['clearInterval']} */
export function clearInterval() {
  return select().clearInterval.apply(this, arguments);
}
import createTimer from './util/timer';

const timer = createTimer();
register('packetSent', timer.checkQueue).setPriority(Priority.LOWEST);
register('packetReceived', timer.checkQueue).setPriority(Priority.LOWEST);

module.exports = timer.exports;
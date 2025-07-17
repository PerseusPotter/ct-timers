import createTimer from './util/timer';

const timer = createTimer();
register('renderWorld', timer.checkQueue).setPriority(Priority.LOWEST);
register('renderOverlay', timer.checkQueue).setPriority(Priority.LOWEST);
register('tick', timer.checkQueue).setPriority(Priority.LOWEST);

module.exports = timer.exports;
import exitHook from 'async-exit-hook';

import { start, stop } from './server';

const ws = start();

exitHook.uncaughtExceptionHandler((e) => {
  console.log(e);
});

exitHook.unhandledRejectionHandler((e) => {
  console.log(e);
});

exitHook(async (callback: () => void) => {
  stop(ws);
  callback();
});

exitHook.uncaughtExceptionHandler(async () => {
  process.exit(-1);
});

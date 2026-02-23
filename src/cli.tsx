import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

const args = process.argv.slice(2);
let staleDays = 30;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--stale-days' && args[i + 1]) {
    const val = parseInt(args[i + 1], 10);
    if (!isNaN(val) && val > 0) staleDays = val;
  }
}

render(<App staleDays={staleDays} />);

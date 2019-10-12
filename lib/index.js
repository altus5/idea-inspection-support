#!/usr/bin/env node
'use strict';

const report = require('./report');

if (process.argv.length != 3) {
  console.error("idea-inspect-report [inspection result directory]");
  process.exit(1);
}

const resultDir = process.argv[2];
const reportCount = report(resultDir);
process.exit(reportCount == 0 ? 0 : 1);

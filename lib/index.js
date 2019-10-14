#!/usr/bin/env node
'use strict';

const support = require('./support');

if ((process.argv.length == 6 || process.argv.length == 7) && process.argv[2] === 'scope') {
  const projectPath = process.argv[3];
  const scopeName  = process.argv[4];
  const filePatternFile = process.argv[5];
  const moduleName = process.argv.length == 7 ? process.argv[6] : '';
  support.scope(projectPath, moduleName, scopeName, filePatternFile);
  process.exit(0);
} else if (process.argv.length == 4 && process.argv[2] === 'report') {
  const resultDir = process.argv[3];
  const reportCount = support.report(resultDir);
  process.exit(reportCount == 0 ? 0 : 1);
} else if (process.argv.length == 4 && process.argv[2] === 'clean') {
  const resultDir = process.argv[3];
  const reportCount = support.clean(resultDir);
  process.exit(reportCount == 0 ? 0 : 1);
} else {
  console.error("Usage:");
  console.error("idea-inspect-support scope [project path] [scope name] [json file] [module name]");
  console.error("  OR");
  console.error("idea-inspect-support report [inspection result directory]");
  console.error("  OR");
  console.error("idea-inspect-support clean [inspection result directory]");
  process.exit(1);
}

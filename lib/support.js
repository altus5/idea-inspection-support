'use strict';

const fs = require('fs-extra');
const path = require('path');
const parser = require('fast-xml-parser');
const he = require('he');

function scope(projectPath, scopeName, filePatternFile) {
  let filePatterns = require(filePatternFile);
  const prefix = 'file[learningware]:';
  filePatterns = filePatterns.map(f => {
    return prefix + f;
  });
  const pattern = filePatterns.join('||');
  const xml = 
`<component name="DependencyValidationManager">
  <scope name="${scopeName}" pattern="${pattern}" />
</component>`;
  const scopeDir = path.join(projectPath, '/.idea/scopes');
  if (!fs.existsSync(scopeDir)) {
    fs.mkdirSync(scopeDir);
  }
  const scopePath = path.join(scopeDir, `/${scopeName}.xml`);
  fs.writeFileSync(scopePath, xml);
} 

module.exports.scope = scope;

function report(resultDir) {
  const files = fs.readdirSync(resultDir);
  const parserOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr",
    textNodeName : "#text",
    ignoreAttributes : false,
    allowBooleanAttributes : true,
    parseNodeValue : true,
    parseAttributeValue : true,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    localeRange: "",
    parseTrueNumberOnly: false,
    attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),
    tagValueProcessor : a => he.decode(a)
  };
  
  const srcfileMap = {};
  files.forEach(file => {
    if (file.startsWith('.')) {
      return;
    }
    let problems = [];
    let xmlData;
    try {
      xmlData = fs.readFileSync(path.join(resultDir, file), {encoding: "utf-8"});
      if (!xmlData.match(/^<problems>/)) {
        xmlData = '<problems>' + xmlData;
      }
      const result = parser.parse(xmlData, parserOptions);
      if (!Array.isArray(result.problems.problem)) {
        problems = [result.problems.problem];
      } else {
        problems = result.problems.problem;
      }
    } catch (e) {
      console.error('ERROR: ' + xmlData);
      throw e;
    }
    problems.forEach(problem => {
      //console.log(problem);
      /*
      { file: 'file://$PROJECT_DIR$/controllers/ErrorController.php',
      line: 9,
      module: 'learningware',
      entry_point:
      { attr:
          { '@_TYPE': 'phpClass',
            '@_FQNAME': '\\app\\controllers\\ErrorController' } },
      problem_class:
      { '#text': 'unused declaration',
        attr:
          { '@_severity': 'WEAK WARNING',
            '@_attribute_key': 'NOT_USED_ELEMENT_ATTRIBUTES' } },
      hints: '',
      description: 'Class is not instantiated.' }
      */
      const file = problem.file.replace(/^file:\/\/\$PROJECT_DIR\$\//, '');
      // WARNING と ERROR 以外は、チェックしない
      const severity = problem.problem_class.attr['@_severity'];
      if (!severity.match(/^(WARNING|ERROR)$/)) {
        return;
      }
      // view の Unhandled exception は、チェックしない
      const text = problem.problem_class['#text'];
      if (file.match(/^.*\/?views\//) && text === 'Unhandled exception') {
        return;
      }
      // ファイル名でいったんまとめる
      if (!srcfileMap[file]) {
        srcfileMap[file] = [];
      }
      srcfileMap[file].push(problem);
    });
  });
  
  let errCount = 0;
  Object.keys(srcfileMap).forEach(file => {
    //console.log(`${file} ...`);
    const problems = srcfileMap[file];
    problems.forEach(problem => {
      console.log(`${file} (${problem.line}): [${problem.problem_class.attr['@_severity']}] ${problem.problem_class['#text']}\n  ${problem.description}`);
      errCount++;
    });
  });

  return errCount;
} 

module.exports.report = report;


function clean(resultDir) {
  fs.emptyDirSync(resultDir);
}

module.exports.clean = clean;

const fs = require('fs');

const csv2json = require('./dependencies/csv2json');

const json2csv = require('./dependencies/json2csv');

module.exports.read = (file) => {
  const data = fs.readFileSync(file.path, {encoding: 'utf8'});
  fs.unlinkSync(file.path);
  return csv2json(data);
};

module.exports.tocsv = (json) => {
  return json2csv(json);
};

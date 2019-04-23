const fs = require('fs');
const csv2json = require('./dependencies/csv2json');

const json2csv = require('./dependencies/json2csv');

module.exports.read = async (file) => {
  const data = await fs.readFile(file.path, { encoding: 'utf8' }, function(err, contents) {
    if (err)
      throw err;
    return contents;
  });
  fs.unlinkSync(file.path);
  await csv2json(data, {parseNumbers: false})
};

module.exports.tocsv = (json) => {
  return json2csv(json);
};

const csv = require('csvtojson');
const fs = require('fs');

module.exports.read = (file) => {
  const fileRows = [];

  csv()
    .fromFile(file.path)
    .then((object) => {
      console.log(object);
      return object;
    });
};

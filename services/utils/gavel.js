const _ = require('lodash');

module.exports.construct = (projects, parameters) => {
  let accumulator = [];
  const descriptionParameters = parameters.description;
  const locationParameter = parameters.location;

  _.forEach(projects, (project) => {
    let description = "";
    _.forEach(descriptionParameters, (descriptionParameter) => {
      description += _.trim(project[descriptionParameter]) + "\n***\n";
    });
    accumulator.push({
      name: project["Submission Title"],
      location: project[locationParameter],
      /* subtract 7 chars to remove extra "\n***\n" */
      description: _.trim(description.substr(0,description.length-5))
    })
  });
  return accumulator;
};

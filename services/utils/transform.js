const _ = require('lodash');


// {"description": ["Describe Your Hack In 140 Characters. Target This To A 5th Grader.","Describe Your Hack In 140 Characters. Target This To A Peer.","Describe Your Hack In 140 Characters. Target This To A Senior Engineer With Years Of Experience."],
//   "location": "What's Your Table Number? Format Is Floor #, Section #, Row/Table #S, I.E. 1 1 A1."};

module.exports.constructGavel = (projects, parameters) => {
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
      /* subtract 5 chars to remove extra "\n***\n" */
      description: _.trim(description.substr(0,description.length-5))
    })
  });
  return accumulator;
};

module.exports.constructPdf = (projects, parameters) => {
  let accumulator = [];
  const descriptionParameters = parameters.description;
  const locationParameter = parameters.location;

  _.forEach(projects, (project) => {
    let description = "";
    _.forEach(descriptionParameters, (descriptionParameter) => {
      description += _.trim(project[descriptionParameter])+"\n\n";
    });
    accumulator.push({
      name: project["Submission Title"],
      location: project[locationParameter],
      description: _.trim(description),
      challenges: project["Opt-in prize"]
    })
  });
  return accumulator;
};


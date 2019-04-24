const fs = require('fs');

const jsPDF = require('jspdf').jsPDF();
require('jspdf-autotable');

const _ = require('lodash');

jsPDF.autoTableSetDefaults({
  theme: 'striped',
  overflow: 'linebreak'
});

/*
* data: {[
* name, location, description, challenges: [ challenge1, challenge2, challenge3 ]
* ], }
* */
module.exports.sponsorChallenges = async(data) => {
  const documents = [];
  const challenges = await countChallengesInAll(_.map(data, 'challenges'));
  _.forEach(challenges, (challenge) => {
    const projects = [];
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text(
      challenge,
      10,
      10,
      {align: "center"});
    pdf.setFontSize(14);
    _.forEach(data, (project) => {
      const pc = project.challenges;
      if (_.includes(pc, challenge))
        projects.push(project);
    });
    pdf.autoTable({
      columns: [{
        header: 'Project Name',
        dataKey: 'name'
      }, {
        header: 'Location',
        dataKey: 'location'
      }, {
        header: 'Description',
        dataKey: 'description'
      }],
      body: projects
    });
    documents.push(pdf);
  });
  return await documents;
};

const countChallengesInAll = (challengesAll) => {
  const accumulator = [];

  _.forEach(challengesAll, (challenges) => {
    if(!_.includes(accumulator, challenges))
      accumulator.push(challenges);
  });
  return accumulator;
};

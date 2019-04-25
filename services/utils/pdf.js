const fs = require('fs');
const _ = require('lodash');
const PdfTable = require('voilab-pdf-table');
const PdfDocument = require('pdfkit');

/*
* data: {[
* name, location, description, challenges: [ challenge1, challenge2, challenge3 ]
* ], }
* */
module.exports.sponsorChallenges = async(data, rawData) => {
  let documents = [];
  console.log(data);
  const challenges = await countChallengesInAll(_.map(data, 'challenges'));
  console.log(challenges);
  _.forEach(challenges, (challenge) => {
    if(!challenge || challenge.isEmpty)
      return;
    const projects = [];

    _.forEach(data, (project) => {
      const pc = project.challenges;
      if (pc === challenge)
        projects.push(project);
    });

    console.log(projects);

    //const pdf = new jsPDF();
    const pdf = new PdfDocument({
      autoFirstPage: false
    }),
      table = new PdfTable(pdf, {
        bottomMargin: 30
      });
    table
      .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
        column: 'description'
      }))
      .setColumnsDefaults({
        headerBorder: 'B',
        align: 'right'
      })
      .addColumns([
        {
          id: 'name',
          header: 'Name',
          align: 'left'
        },
        {
          id: 'location',
          header: 'Location',
          align: 'left'
        },
        {
          id: 'description',
          header: 'Description',
          align: 'left'
        },
        {
          id: 'challenges',
          header: 'Challenge',
          align: 'left'
        }
      ])
      .onPageAdded((tb) => {
        tb.addHeader();
      });
    pdf.addPage();

    console.log(projects);

    table.addBody([
      {name: "nama asd asd", location: "place asdasd", description: "deascraipas da sdasd", challenges: "hackdfw asd chalc"}
    ]);

    documents.push({challenge: challenge, pdf: pdf});
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

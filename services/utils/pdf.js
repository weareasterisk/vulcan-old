const fs = require('fs');
const _ = require('lodash');
const PdfPrinter = require('pdfmake');

/*
* * Paths are based on the root directory of project
* */

const fonts = {
  Roboto: {
    normal: './public/fonts/roboto/Roboto-Regular.ttf',
    bold: './public/fonts/roboto/Roboto-Medium.ttf',
    italics: './public/fonts/roboto/Roboto-Italic.ttf',
    bolditalics: './public/fonts/roboto/Roboto-MediumItalic.ttf'
  }
};

const image = './public/image';

const printer = new PdfPrinter(fonts);

/*
* data: {[
* name, location, description, challenges: [ challenge1, challenge2, challenge3 ]
* ], }
* */
module.exports.sponsorChallenges = (data) => {
  let documents = [];
  const challenges = countChallengesInAll(_.map(data, 'challenges'));
  _.forEach(challenges, (challenge) => {
    if(!challenge || challenge.isEmpty)
      return;
    const projects = [];

    _.forEach(data, (project) => {
      const pc = project.challenges;
      if (pc === challenge)
        projects.push(project);
    });

    const sortedProjects = _.sortBy(projects, "location");

    const pdfData = transformToPdfKitData(sortedProjects);

    const document = printer.createPdfKitDocument({
      pageMargins: [30, 30, 30, 40],
      orientation: 'portrait',
      footer: {
        stack: [
          {
            text: ((currentPage, pageCount) => {
              return currentPage.toString() + ' of ' + pageCount;
            })
          }
        ],
        margin: [20]
      },
      header: {
        stack: [
          {
            image: './public/images/logo-black-min.jpg', fit: [50,200]
          }
        ],
        margin: [15, 15]
      },
      content: [
        {
          text: challenge,
          style: "header"
        },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            dontBreakRows: true,
            widths: ['*', '*', 'auto'],

            body: pdfData
          }
        }
      ],
      defaultStyle: {
        font: 'Roboto'
      },
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        header: {
          fontSize: 15,
          bold: true,
          alignment: 'center'
        },
      }
    });
    documents.push({challenge: challenge, pdf: document});
  });
  return documents;
};

const countChallengesInAll = (challengesAll) => {
  const accumulator = [];
  _.forEach(challengesAll, (challenges) => {
    if(!_.includes(accumulator, challenges))
      accumulator.push(challenges);
  });
  return accumulator;
};

const transformToPdfKitData = (projects) => {
  let output = [];
  let header = [
    {text: "Name", style: "tableHeader"},
    {text: "Location", style: "tableHeader"},
    {text: "Description(s)", style: "tableHeader"}
  ];

  output.push(header);
  _.forEach(projects, (project) => {
    let transProject = [];
    transProject.push(project.name);
    transProject.push(project.location);
    transProject.push(project.description);
    output.push(transProject);
  });
  return output;
};

const fs = require('fs');
const pdf = require('jspdf');
const _ = require('lodash');

/*
* data: {[
* name, location, description, challenges: [ challenge1, challenge2, challenge3 ]
* ], }
* */
module.exports.sponsorChallenges = async(data) => {
  const documents = [];
  const challenges = countChallengesInAll(_.map(data, 'challenges'));
  _.forEach(data, async (datum) => {

  });

};

const countChallengesInAll = (challengesAll) => {
  const accumulator = [];

  _.forEach(challengesAll, (challenges) => {
    if(!_.includes(accumulator, challenges))
      accumulator.push(challenges);
  });
  return accumulator;
};

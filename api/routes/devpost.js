const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { read, tocsv } = require('../../services/utils/csv');
const _ = require('lodash');
const { constructGavel, constructPdf } = require('../../services/utils/transform');
const { sponsorChallenges } = require('../../services/utils/pdf');
const uuidv4 = require('uuid/v4');

const router = express.Router();

// Instantiate multer with uploads/ as destination.
/* NOTE: DELETE FILES AFTER READING */
const upload = multer({
  dest: 'uploads/'
});

/* GET users listing. */
router.post('/gavel', upload.single('file'), async (req, res, next) => {
  const { file } = req;
  try {
    const data = await read(file);

    const parameters = JSON.parse(req.body.parameters);

    const gavelData = await constructGavel(data, parameters);

    res.send(tocsv(gavelData));
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(400).send(error);
    try {
      fs.unlinkSync(file.path);
    } catch(e) {

    }
  }
});

// Requires that the "sort by opt-in" prize be checked.
router.post('/challenges', upload.single('file'), async (req, res, next) => {
  const { file } = req;
  try {

    const data = await read(file);
    const parameters = JSON.parse(req.body.parameters);


    const gavelData = await constructPdf(data, parameters);

    const docdata = await sponsorChallenges(gavelData);

    let filesInfo = [];
    await _.forEach(docdata, (doc) => {
      const { pdf, challenge } = doc;
      const path = {};
      const filename = (_.trim(_.toLower(_.replace(challenge, /\s+/g, '-'))));
      const fileending = ".pdf";
      path.name = filename + fileending;
      path.path = './api/pdfstorage/' + filename + (Math.round((new Date()).getTime())) + uuidv4() + fileending;
      pdf.pipe(
        fs.createWriteStream(path.path)
      );

      pdf.end();
      filesInfo.push(path);
    });


    await res.zip({
      files: filesInfo,
      filename: "sponsor_challenges.zip"
    });
    _.forEach(filesInfo, (path) => {
      fs.unlink(path.path, (err) => {
        if(err) throw err;
      })
    });
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(400).send(error)
  }
});


module.exports = router;

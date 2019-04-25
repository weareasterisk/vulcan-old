const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { read, tocsv } = require('../../services/utils/csv');
const { constructGavel, constructPdf } = require('../../services/utils/transform');
const { sponsorChallenges } = require('../../services/utils/pdf');
const _ = require('lodash');

const router = express.Router();

// Instantiate multer with uploads/ as destination.
/* NOTE: DELETE FILES AFTER READING */
const upload = multer({
  dest: 'uploads/'
});

/* GET users listing. */
router.post('/csv', upload.single('file'), async (req, res, next) => {
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

    const docdata = await sponsorChallenges(gavelData, data);

    let paths = [];
    _.forEach(docdata, async (doc) => {
      const { pdf, challenge } = doc;
      const path = '../pdfstorage/'.join(_.trim(_.toLower(_.replace(challenge, /\s+/g, '-')))).join('-').join(Math.round((new Date()).getTime() / 10));
      pdf.pipe(
        fs.createWriteStream(path)
      )
        .on('finish', () => {
          pdf.end();
        });
      await paths.push(path);
    });
    console.log(paths);
    return await paths;
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(400).send(error)
  }
});


module.exports = router;

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { read, tocsv } = require('../../services/utils/csv');
const { construct } = require('../../services/utils/gavel');

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

    const gavelData = await construct(data, parameters);

    res.send(tocsv(gavelData));
  }
  catch (error) {
    try {
      fs.unlinkSync(file.path);
    } catch(e) {

    }
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(400).send(error)
  }
});


module.exports = router;

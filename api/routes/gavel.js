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
    console.log(data);

    const gavelData = await construct(data, parameters);

    res.send(tocsv(gavelData));
    console.log(JSON.stringify(gavelData));
  }
  catch (error) {
    fs.unlinkSync(file.path);
    console.error(error);
    res.status(400).send(error)
  }

  /*{
    description: [
      "Describe Your Hack In 140 Characters. Target This To A 5th Grader.",
      "Describe Your Hack In 140 Characters. Target This To A Peer.",
      "Describe Your Hack In 140 Characters. Target This To A Senior Engineer With Years Of Experience."
    ],
    location: "What's Your Table Number? Format Is Floor #, Section #, Row/Table #S, I.E. 1 1 A1."
  };*/

});


module.exports = router;

const express = require('express');
const multer = require('multer');
const { read } = require('../../services/utils/csv');

const router = express.Router();

// Instantiate multer with uploads/ as destination.
/* NOTE: DELETE FILES AFTER READING */
const upload = multer({ dest: 'uploads/' });

/* GET users listing. */
router.post('/csv', upload.single('file'), (req, res, next) => {
  const { file } = req;

  const data = read(file);

  res.send(data);
  console.log(data,"asdasd asd asd asd");

});

module.exports = router;

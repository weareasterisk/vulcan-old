const express = require('express');
const gavel = require('./routes/gavel');

const router = express.Router();

router.use('/gavel', gavel);

module.exports = router;

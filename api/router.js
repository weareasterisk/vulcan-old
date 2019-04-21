const express = require('express');
const devpost = require('./routes/devpost');

const router = express.Router();

router.use('/devpost', devpost);

module.exports = router;

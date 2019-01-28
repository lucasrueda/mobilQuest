var express = require('express');
var router = express.Router();

var demo = true;

router.get('/', (req, res) => {
    return res.status(200).json({ demo: demo });
})

module.exports = router;
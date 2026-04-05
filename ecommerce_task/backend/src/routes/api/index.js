

const router = require('express').Router();

router.use('/user', require('./productRouter'));
router.use('/admin', require('./adminRouter'));

module.exports = router;
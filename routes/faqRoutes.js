// routes/faqRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllFAQs,
  createFAQ,
  addAnswer,
  upvoteFAQ,
  resolveFAQ,
} = require('../controllers/faqController');

router.route('/').get(getAllFAQs).post(createFAQ);
router.route('/:id/answer').post(addAnswer);
router.route('/:id/upvote').put(upvoteFAQ);
router.route('/:id/resolve').put(resolveFAQ);

module.exports = router;
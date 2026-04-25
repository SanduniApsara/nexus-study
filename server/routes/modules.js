const express = require('express');
const router  = express.Router();
const { getModules, createModule, updateModule, deleteModule, addGrade, deleteGrade } = require('../controllers/moduleController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getModules)
  .post(createModule);

router.route('/:id')
  .put(updateModule)
  .delete(deleteModule);

router.route('/:id/grades')
  .post(addGrade);

router.route('/:id/grades/:gradeId')
  .delete(deleteGrade);

module.exports = router;

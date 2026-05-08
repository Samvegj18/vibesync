/**
 * Database Explorer Routes
 * For viva demonstration of DBMS concepts
 */
const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get('/tables', dbController.getTables);
router.get('/views', dbController.getViews);
router.get('/triggers', dbController.getTriggers);
router.get('/procedures', dbController.getProcedures);
router.get('/er-diagram', dbController.getERDiagram);
router.post('/query', dbController.runQuery);

module.exports = router;

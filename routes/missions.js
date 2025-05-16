const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/missions
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT m.*, a.name AS astartes_name
      FROM missions m
      JOIN astartes a ON m.astartesid = a.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av missions:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});

module.exports = router;

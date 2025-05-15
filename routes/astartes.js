const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/astartes – Hämta alla astartes
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM astartes ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});

// POST /api/astartes – Skapa en ny astartes
router.post('/', async (req, res) => {
  const { name, rank, company, is_psyker } = req.body;

  if (!name || !rank) {
    return res.status(400).json({ error: 'Namn och rang krävs' });
  }

  try {
    const result = await db.query(
      'INSERT INTO astartes (name, rank, company, is_psyker) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, rank, company || null, is_psyker || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Fel vid skapande:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});

module.exports = router;

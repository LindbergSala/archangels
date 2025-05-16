const express = require('express');
const router = express.Router();
const db = require('../db');

// Listan över alla Missions
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT m.*, a.name AS astartes_name
      FROM missions m
      JOIN astartes a ON m.marine_id = a.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av missions:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});

// Lägg till ett mission för en Astarte
router.post('/', async (req, res) => {
  const { marine_id, mission_name, date, success } = req.body;

  if (!marine_id || !mission_name || !date) {
    return res.status(400).json({ error: 'Fält saknas: marine_id, mission_name och date krävs' });
  }

  try {
    const result = await db.query(
      `INSERT INTO missions (marine_id, mission_name, date, success)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [marine_id, mission_name, date, success ?? null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Fel vid skapande av mission:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});

module.exports = router;

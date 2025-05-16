const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/missions – Hämta alla missions med Astartes-namn
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        m.id,
        m.marine_id,
        a.name AS astartes_name,
        m.mission_name,
        m.date,
        m.success,
        m.location,
        m.objective
      FROM missions m
      JOIN astartes a ON m.marine_id = a.id
      ORDER BY m.date DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av missions:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});

// POST /api/missions – Lägg till ett mission för en Astarte
router.post('/', async (req, res) => {
  const { marine_id, mission_name, date, success, location, objective } = req.body;

  if (!marine_id || !mission_name || !date) {
    return res.status(400).json({ error: 'Fält saknas: marine_id, mission_name och date krävs' });
  }

  try {
    const result = await db.query(
      `INSERT INTO missions (marine_id, mission_name, date, success, location, objective)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [marine_id, mission_name, date, success ?? null, location || null, objective || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Fel vid skapande av mission:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});

// DELETE /api/missions/:id – Radera ett mission
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Ogiltigt ID' });
  }

  try {
    const result = await db.query('DELETE FROM missions WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Mission hittades inte' });
    }

    res.json({ message: 'Mission raderat', deleted: result.rows[0] });
  } catch (err) {
    console.error('Fel vid radering av mission:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});


module.exports = router;

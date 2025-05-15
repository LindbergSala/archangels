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
  const { name, rank, company, status, is_psyker } = req.body;

  if (!name || !rank) {
    return res.status(400).json({ error: 'Namn och rang krävs' });
  }

  try {
    const result = await db.query(
      'INSERT INTO astartes (name, rank, company, status, is_psyker) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, rank, company, status, is_psyker ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Fel vid skapande:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});


// DELETE /api/astartes/:id – Radera en Astarte
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await db.query('DELETE FROM astartes WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Ingen Astarte med det ID:t' });
    }

    res.json({ message: 'Astartes raderad', data: result.rows[0] });
  } catch (err) {
    console.error('Fel vid radering:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});


module.exports = router;

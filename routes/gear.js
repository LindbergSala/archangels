const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/test', (req, res) => {
  res.json({ message: 'POST fungerar!' });
});


// GET /api/gear – Hämta all utrustning med tillhörande Astartes-namn
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        g.id,
        g.weapon,
        g.armor,
        g.relic,
        g.astartes_id,
        a.name AS astartes_name
      FROM gear g
      JOIN astartes a ON g.astartes_id = a.id
      ORDER BY a.name;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av gear:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});


// POST /api/gear – Lägg till utrustning till en Astarte
router.post('/', async (req, res) => {
  const { astartes_id, weapon, armor, relic } = req.body;

  if (!astartes_id || !weapon || !armor) {
    return res.status(400).json({ error: 'Fält saknas: astartes_id, weapon och armor krävs' });
  }

  try {
    const result = await db.query(
      `INSERT INTO gear (astartes_id, weapon, armor, relic)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [astartes_id, weapon, armor, relic || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Fel vid skapande av gear:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});

// DELETE /api/gear/:id – Radera en gear-post med ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM gear WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Gear hittades inte' });
    }

    res.json({ message: 'Gear raderad', deleted: result.rows[0] });
  } catch (err) {
    console.error('Fel vid radering av gear:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});

module.exports = router;

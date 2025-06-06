const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET alla squads
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM squads');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET en squad by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM squads WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST skapa ny squad
router.post('/', async (req, res) => {
  const { name, company, specialization, gear_id, nr_missions } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO squads (name, company, specialization, gear_id, nr_missions)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, company, specialization, gear_id, nr_missions]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT uppdatera en squad
router.put('/:id', async (req, res) => {
  const { name, company, specialization, gear_id, nr_missions } = req.body;
  try {
    const result = await pool.query(
      `UPDATE squads SET name = $1, company = $2, specialization = $3, gear_id = $4, nr_missions = $5
       WHERE id = $6 RETURNING *`,
      [name, company, specialization, gear_id, nr_missions, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE en squad
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM squads WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted", squad: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET alla karaktärer i en viss squad
router.get('/:id/characters', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*
       FROM characters c
       WHERE c.squad_id = $1`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET detaljerad squad-info (inklusive gear, lista på medlemmar och deras missions)
router.get('/:id/details', async (req, res) => {
  try {
    // Hämta squad + gear
    const squadResult = await pool.query(
      `SELECT 
        s.*, 
        g.name AS gear_name, 
        g.weapons, 
        g.armors, 
        g.special_equipment, 
        g.relics_artifacts
      FROM squads s
      LEFT JOIN gears g ON s.gear_id = g.id
      WHERE s.id = $1`,
      [req.params.id]
    );

    if (squadResult.rows.length === 0) return res.status(404).json({ error: "Not found" });
    const squadInfo = squadResult.rows[0];

    // Hämta alla karaktärer i squaden
    const membersResult = await pool.query(
      `SELECT id, name, title, race, faction, psyker, status, gear_id, specializt
       FROM characters
       WHERE squad_id = $1`,
      [req.params.id]
    );
    const members = membersResult.rows;

    // Hämta alla missions för denna squad
    const missionsResult = await pool.query(
      `SELECT m.*
       FROM squad_missions sm
       JOIN missions m ON sm.mission_id = m.id
       WHERE sm.squad_id = $1`,
      [req.params.id]
    );
    const missions = missionsResult.rows;

    // Lägg till missions till varje medlem (alla får samma missions)
    for (let member of members) {
      member.missions = missions;
    }

    // Lägg till en members-array på squadInfo
    squadInfo.members = members;

    res.json(squadInfo);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

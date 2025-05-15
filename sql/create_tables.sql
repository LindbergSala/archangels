-- Tabell: Astartes
CREATE TABLE astartes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  rank TEXT NOT NULL,
  company TEXT,
  status TEXT,
  is_psyker BOOLEAN DEFAULT FALSE
);

-- Tabell: Loadouts (kopplad till Astartes)
CREATE TABLE loadouts (
  id SERIAL PRIMARY KEY,
  astartes_id INTEGER REFERENCES astartes(id),
  weapon TEXT,
  armor TEXT,
  relic TEXT
);

-- Tabell: Missions (kopplad till Astartes)
CREATE TABLE missions (
  id SERIAL PRIMARY KEY,
  marine_id INTEGER,
  mission_name TEXT,
  date TEXT,
  success BOOLEAN,
  FOREIGN KEY (marine_id) REFERENCES astartes(id)
);

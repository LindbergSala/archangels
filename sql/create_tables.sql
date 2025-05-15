CREATE TABLE astartes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  rank TEXT NOT NULL,
  company TEXT,
  is_psyker BOOLEAN DEFAULT FALSE
);

CREATE TABLE loadouts (
  id SERIAL PRIMARY KEY,
  astartes_id INTEGER REFERENCES astartes(id),
  weapon TEXT,
  armor TEXT,
  relic TEXT
);

CREATE TABLE missions (
  id INTEGER PRIMARY KEY,
  marine_id INTEGER,
  mission_name TEXT,
  date TEXT,
  success BOOLEAN,
  FOREIGN KEY (marine_id) REFERENCES marines(id)
);
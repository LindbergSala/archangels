const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routers
app.use('/api/astartes', require('./routes/astartes'));
app.use('/api/gear', require('./routes/gear'));
app.use('/api/missions', require('./routes/missions'));

app.listen(port, () => {
  console.log(`🚀 API körs på http://localhost:${port}`);
});

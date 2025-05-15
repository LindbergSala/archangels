const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/astartes', require('./routes/astartes'));

app.listen(port, () => {
  console.log(`Archangels-API körs på http://localhost:${port}`);
});

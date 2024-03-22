const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const {
  validateCreatePlayer,
  validateGetPlayer,
} = require('./validators/playerValidator');
const {
  onCreatePlayer,
  onUpdatePlayer,
  onGetPlayers,
  onGetSinglePlayer,
} = require('./playerControllers');

app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:5501',
    credentials: true,
  })
);

app.post('/api/players', validateCreatePlayer, onCreatePlayer);

app.put('/api/players/:id', validateCreatePlayer, onUpdatePlayer);

app.get('/api/players', validateGetPlayer, onGetPlayers);

app.get('/api/players/:id', validateGetPlayer, onGetSinglePlayer);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

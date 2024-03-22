const express = require('express');
const { check } = require('express-validator');
var cors = require('cors');
const app = express();
const port = 3000;
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

const { sequelize, Player } = require('./models');
const migrationhelper = require('./migrationhelper');

var bodyParser = require('body-parser');
const player = require('./models/player');
const { where } = require('sequelize');
const { Op } = require('sequelize');
const {
  validateCreatePlayer,
  validateGetPlayer,
} = require('./validators/playerValidator');
const e = require('express');

app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:5501',
    credentials: true,
  })
);

async function getNextId() {
  const players = await Player.findAll();
  let m = Math.max(...players.map((player) => player.id));
  return m + 1;
}

async function onCreatePlayer(req, res) {
  const { name, jersey, position, team } = req.body;
  const existingPlayer = await Player.findOne({
    where: {
      name: req.body.name,
      jersey: req.body.jersey,
      position: req.body.position,
      team: req.body.team,
    },
  });
  if (existingPlayer) {
    res.status(409).send('Player already exists');
  } else {
    await Player.create({
      name: name,
      jersey: jersey,
      position: position,
      team: team,
      id: await getNextId(),
    });
    res.status(201).json({ name });
  }
}

async function onGetPlayers(req, res) {
  const sortCol = req.query.sortCol || 'name';
  const sortOrder = req.query.sortOrder || 'asc';
  const q = req.query.q || '';

  const offset = Number(req.query.offset || 0);
  const limit = Number(req.query.limit || 30);

  const players = await Player.findAndCountAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: '%' + q + '%',
          },
        },
        {
          team: {
            [Op.like]: '%' + q + '%',
          },
        },
        {
          position: {
            [Op.like]: '%' + q + '%',
          },
        },
      ],
    },
    order: [[sortCol, sortOrder]],
    offset: offset,
    limit: limit,
  });
  const total = players.count;
  const result = players.rows.map((player) => {
    return {
      id: player.id,
      name: player.name,
      jersey: player.jersey,
      position: player.position,
      team: player.team,
    };
  });
  if (total == 0) {
    res.status(404).send({ message: 'Finns inte' });
  } else {
    return res.json({
      total,
      result,
    });
  }
}

app.post('/api/players', validateCreatePlayer, onCreatePlayer);

async function onUpdatePlayer(req, res) {
  const id = req.params.id;
  const player = await Player.findOne({
    where: { id: id },
  });
  if (player == undefined) {
    res.status(404).send('Finns inte');
  }
  player.name = req.body.name;
  player.jersey = req.body.jersey;
  player.position = req.body.position;
  player.team = req.body.team;

  await player.save();
  res.status(204).send({ message: 'Updated' });
}
app.put('/api/players/:id', validateCreatePlayer, onUpdatePlayer);


app.get('/api/players', validateGetPlayer, onGetPlayers);

app.get('/api/players/:id', async (req, res) => {
  const id = req.params.id;
  let player = await Player.findOne({
    where: { id: id },
  });

  // let p = players.find(player => player.id == req.params.player.id)
  if (player == undefined) {
    res.status(404).send({ message: 'Finns inte' });
  }
  res.json(player);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

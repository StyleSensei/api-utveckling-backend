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

app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:5501',
    credentials: true,
  })
);

async function getNextId(){
  const players = await Player.findAll()
    let m = Math.max(...players.map(player => player.id))
    return m + 1
}

async function onCreatePlayer(req, res){
const {name, jersey, position, team} = req.body

await Player.create({
  name:name,
  jersey:jersey,
  position:position,
  team:team,
  id:await getNextId(),
})
res.status(201).json({ name })
}
app.post('/api/players', onCreatePlayer)


// app.post('/api/players', async (req,res)=>{
//     const player = await Player.create({
//         name:req.body.name,
//         jersey: req.body.jersey,
//         position: req.body.position,
//         team: req.body.team,
//         id:getNextId()
//     }
//     )
//     await player.save()
//     // players.push(player)
    
//     console.log(req.body)
// res.status(201).send('Created')
// });





app.put('/api/players/:id', async (req, res) => {
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
  res.status(204).send('Updated');
});

// app.delete('/api/players/:anvId',(req,res)=>{
//     console.log(req.params.anvId)
//     let p = players.find(player=>player.id == req.params.anvId)
//     // 404???
//     if(p == undefined){
//         res.status(404).send('Finns inte')
//     }
//     players.splice(players.indexOf(p),1)
//     res.status(204).send('deleted')
// });

app.get('/api/players', check('q').trim().escape(), async (req, res) => {
  const sortCol = req.query.sortCol || 'id';
  const sortOrder = req.query.sortOrder || 'asc';
  const q = req.query.q || '';
  const offset = Number(req.query.offset || 0);
  // const page = req.query.offset || 0;
  const limit = Number(req.query.limit || 30);

  const players = await Player.findAndCountAll({
    where: {
      name: {
        [Op.like]: '%' + q + '%',
      },
    },
    order: [[sortCol, sortOrder]],
    offset: offset,
    limit: limit,
  });
  const total = players.count;
  const result = players.rows.map(player => {
    return {
    id: player.id,
    name: player.name,
    jersey: player.jersey,
    position: player.position,
    team: player.team,
    }
  });
  return res.json({
    total,
    result
  });
});

app.get('/api/players/:id', async (req, res) => {
  const id = req.params.id;
  let player = await Player.findOne({
    where: { id: id },
  });

  // let p = players.find(player => player.id == req.params.player.id)
  if (player == undefined) {
    res.status(404).send('Finns inte');
  }
  res.json(player);
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function listAll() {
  const players = await Player.findAll();
  for (const player of players) {
    console.log('************************');
    console.log('ID:', player.id);
    console.log('Name:', player.name);
  }
}
async function createNew() {
  console.log('** NEW ** ');
  const name = await rl.question('Name:');
  const jersey = await rl.question('Jersey:');
  const position = await rl.question('Position:');
  const team = await rl.question('Team:');
  await Player.create({
    name: name,
    jersey: jersey,
    position: position,
    team: team,
  });
}
async function findPlayer() {
  const thePlayer = await Player.findOne({
    where: { id: 3 },
  });
  if (thePlayer === null) {
    console.log('Not found');
  } else {
    console.log(thePlayer instanceof Player);
    console.log(thePlayer.name);
  }
}

async function updateOne() {
  const thePlayer = await Player.findOne({
    where: { id: 1 },
  });
  console.log(thePlayer.name);
}

async function main() {
  await migrationhelper.migrate();

  const thePlayer = await Player.findOne({
    where: { id: 3 },
  });
  // thePlayer.name = `Patrik Arell`
  thePlayer.team = 'Ekerö IK';

  // await thePlayer.save()

  while (true) {
    // await migrationhelper.migrate();
    console.log('1. Lista alla players');
    console.log('2. Skapa player');
    console.log('3. Lista en player');
    console.log('4. Ta bort player');
    console.log('9. Avsluta');

    const sel = await rl.question('Val:');
    if (sel == '1') {
      await listAll();
    }
    if (sel == '2') {
      await createNew();
    }
    if (sel == '3') {
      findPlayer();
    }
    if (sel == '4') {
      deleteOne();
    }
    if (sel == '5') {
      updateOne();
    }
    if (sel == '9') {
      break;
    }
  }
}

(async () => {
  main();
})();

// ---- //

const express = require('express');
const { check } = require('express-validator')
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
const { Op } = require('sequelize')


app.use(bodyParser.json());
app.use(cors({
  origin:'http://localhost:5501',
  credentials:true
}));

// function getNextId(){
//     let m = Math.max(...players.map(player => player.id))
//     return m + 1
// }

// app.post('/api/players',(req,res)=>{
//     const player = {
//         name:req.body.name,
//         jersey: req.body.jersey,
//         age: req.body.jersey,
//         id:getNextId()
//     }
//     players.push(player)
// console.log(req.body)
// res.status(201).send('Created')
// });

app.put('/api/players/:id', async (req,res)=>{
const id = req.params.id
 const player = await Player.findOne({
  where: { id: id },
 })
 if(player == undefined){
     res.status(404).send('Finns inte')
 }
 player.name = req.body.name
 player.jersey = req.body.jersey
 player.position = req.body.position
 player.team = req.body.team

await player.save()
 res.status(204).send('Updated')
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

app.get('/api/players', async (req, res) => {
  let players = await Player.findAll();
  let result = players.map((player) => ({
    id: player.id,
    name: player.name,
    jersey: player.jersey,
    position: player.position,
    team: player.team,
  }));
  res.json(result);
});

app.get('/api/players/:id' , async (req, res) => {
  const id = req.params.id
  let player = await Player.findOne({
    where: { id: id },
  });

  // let p = players.find(player => player.id == req.params.player.id)
  if (player == undefined) {
    res.status(404).send('Finns inte');
  }
  res.json(player);
});

// app.get('/api/updatestefan',(req,res) => {
//     players[0].age = players[0].age + 1
//     res.send('KLART2');
// });

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

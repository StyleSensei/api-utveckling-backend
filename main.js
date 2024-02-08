const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000;
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

const { sequelize, Player } = require('./models')
const migrationhelper = require('./migrationhelper')

var bodyParser = require('body-parser');
const player = require('./models/player');

app.use(bodyParser.json())
app.use(cors())

// const players = [{
//     name: "Patrik",
//     jersey: 29,
//     age:35,
//     id:1
// },{
// name: "Foppa",
// jersey: 13,
// age: 52,
// id:2
// },{
//     name:"Sudden",
//     jersey: 13,
//     age:52,
//     id:3
// }]

app.get('/api/players/:anvId', (req, res) => {
    console.log(req.params.anvId)


let p = players.find(player => player.id == req.params.anvId)
if(p == undefined){
    res.status(404).send('Finns inte')

}
res.json(p)
})


function getNextId(){
    let m = Math.max(...players.map(player => player.id))
    return m + 1
}

app.post('/api/players',(req,res)=>{
    const player = {
        name:req.body.name,
        jersey: req.body.jersey,
        age: req.body.jersey,
        id:getNextId()
    }
    players.push(player)
console.log(req.body)
res.status(201).send('Created')
});

app.put('/api/players/:anvId',(req,res)=>{
 let p = players.find(player=>player.id == req.params.anvId)
 if(p == undefined){
     res.status(404).send('Finns inte')
 }
 p.birthDate = req.body.birthDate
 p.name = req.body.name
 p.hourlySalary = req.body.hourlySalary
 res.status(204).send('Updated')
});

app.delete('/api/players/:anvId',(req,res)=>{
    console.log(req.params.anvId)
    let p = players.find(player=>player.id == req.params.anvId)
    // 404???
    if(p == undefined){
        res.status(404).send('Finns inte')
    }
    players.splice(players.indexOf(p),1)
    res.status(204).send('deleted')   
});


app.get('/api/players',(req,res)=>{
    
    let result = players.map(player => ({
        id: player.id,
        name: player.name
    }))
     res.json(result)
});

app.get('/api/updatestefan',(req,res) => {
    players[0].age = players[0].age + 1
    res.send('KLART2');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  

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
    Player.create({
      name: name,
      jersey:jersey,
    
    });
  }
  async function main() {
    await migrationhelper.migrate()
    
    const thePlayer = await Player.findOne({
        where: { id:2 }
    })
    thePlayer.name = 'Sudden'
    thePlayer.jersey = '13'

    await thePlayer.save()

    while (true) {
        await migrationhelper.migrate();
        console.log('1. Lista alla players');
        console.log('2. Skapa player');
        console.log('3. Uppdatera player');
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
          updateOne();
        }
        if (sel == '4') {
          deleteOne();
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

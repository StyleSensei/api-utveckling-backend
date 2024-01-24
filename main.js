const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000;

app.use(cors())

const players = [{
    name: "Patrik",
    jersey: 29,
    age:35,
    id:1
},{
name: "Foppa",
jersey: 13,
age: 52,
id:2
},{
    name:"Sudden",
    jersey: 13,
    age:52,
    id:3
}]

app.get('/api/players/:anvId', (req, res) => {
    console.log(req.params.anvId)


let p = players.find(player => player.id === req.params.anvId)
if(p === undefined){
    res.status(404).send('Finns inte')

}
res.json(p)
})
app.get('/api/players',(req,res)=>{
    
    let result = players.map(player=>({
        id: player.id,
        name: player.name
    }))
     res.json(result)
});

app.get('/api/updatestefan',(req,res)=>{
    players[0].age = players[0].age + 1
    res.send('KLART2');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  
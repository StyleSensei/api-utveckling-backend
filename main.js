const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000;

var bodyParser = require('body-parser')

app.use(bodyParser.json())
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

app.put('/api/players',(req,res)=>{
 let p = employees.find(employee=>employee.id == req.params.anvId)
 if(p == undefined){
     res.status(404).send('Finns inte')
 }
 p.birthDate = req.body.birthDate
 p.name = req.body.name
 p.hourlySalary = req.body.hourlySalary
 res.status(204).send('Updated')
});

app.delete('/api/players',(req,res)=>{
    console.log(req.params.anvId)
    let p = employees.find(employee=>employee.id == req.params.anvId)
    // 404???
    if(p == undefined){
        res.status(404).send('Finns inte')
    }
    employees.splice(employees.indexOf(p),1)
    res.status(204).send('')   
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
  
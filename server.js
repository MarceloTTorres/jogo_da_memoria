const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const { join } = require('path')
const os = require('os')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

var path = require('path')
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (request, response) => {
    response.sendFile(join(__dirname, 'index.html'))
}).get('/game', (request, response) => {
    response.sendFile(join(__dirname, 'game.html'))
})

var players = []
var entrou = 0;
var vez = 0;
var max_players = 2
var cartas = require('./public/cartas.json')

function reset(){
    embaralhar_cartas()
    players = []
    vez = 0
}

function embaralhar_cartas(){
    cartas = cartas.map( valor => ({valor, sort: Math.random()}))
                             .sort((a, b) => a.sort - b.sort)
                             .map(({valor}) => valor)
}

io.on('connection', (socket) => {
    // console.log(socket.id)
    if(players.length < max_players){
        let p = {
            id : socket.id,
            apelido : "",
            placar : 0
        }
        players.push(p)

        // socket.emit('voce', p)

        // if(players.length === max_players){
        //     vez = players[0].id
        //     io.emit('iniciar', players, cartas, vez)
        //     console.log(players)
        // }
    }else{
        socket.emit('sala-cheia')
        return
    }

    socket.on('escolhas', (skt) => {
        let jogada = skt.jogada
        let player = skt.player
        let c1 = jogada[0].id.substring(2)
        let c2 = jogada[1].id.substring(2)
        let c3 = jogada[2].id.substring(2)
        if(cartas[c1].substring(0, 1) === cartas[c2].substring(0, 1) && 
           cartas[c1].substring(0, 1) === cartas[c3].substring(0,1)){
            players.forEach(( (p, index) => {
                if(p.id === player.id){
                    players[index].placar++
                }
            }))
            io.emit('acertou', {
                "jogada" : jogada,
                "players" : players
            })
        }else{
            io.to(player.id).emit('errou')
        }
    })

    socket.on('troca-vez', () => {
        let index = players.findIndex(p => p.id === socket.id)
        if(index === 0){
            index = 1
        }else{
            index = 0
        }
        vez = players[index].id

        io.emit('troca', {vez : vez, players : players})
    })

    socket.on("entrar", (nickname) => {
        const index = players.findIndex(p => p.id === socket.id)
        if (index !== -1) {
            players[index].apelido = nickname;
            // console.log(`Jogador registrado: ${nickname} (${socket.id})`)
        }
        if(players.length === max_players){
            vez = players[0].id
            io.emit('iniciar', players, cartas, vez)
        }
    })

    socket.on('mostra', (id) => {
        io.emit('mostra-client', id)
    })

    socket.on('disconnect', (socket) => {
        reset()
        io.emit("reset");
    })
})

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      // Filter out internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0'; // Default if no suitable IP found
}

server.listen(80, () => {
    reset()
    const serverIp = getLocalIpAddress();
    console.log(`Servidor rodando na URL http://${serverIp}/`)
})
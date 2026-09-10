// const socket = io.connect("http://localhost/")
const socket = io()

var player = null
var vez_player = null
var minha_vez = null
var cartas = []
var escolhas = []
var selecionada = null


socket.on("connect", () => {
    const apelido = localStorage.getItem("apelido"); 
    if (apelido) {
        socket.emit("entrar", apelido);
    }
})

socket.on('iniciar', (...args) => {
    console.log('iniciar')
    //args[0] --> players
    //args[1] --> cartas
    //args[2] --> vez
    cartas = args[1]
    minha_vez = args[2]
    // console.log(vez)
    args[0].forEach( (p, index) => {
        document.getElementById(`p${index}`).innerHTML = p.apelido
        if(p.id === socket.id){
            document.getElementById(`p${index}`).innerHTML = `Você: ${p.apelido}`
            player = p
            console.log(p)
        }
        else{
            document.getElementById(`p${index}`).innerHTML = `Oponente: ${p.apelido}`
        }
        marca_vez(args[0])
        
    })
    monta_deck()
})

socket.on('acertou', (...args) => {
    mostra_acertos(args[0].jogada)
    atualiza_placar(args[0].players)
    escolhas = []
})

socket.on('errou', (plyr) => {
    // if(plyr.id == minha_vez){
        escolhas.forEach( (c, index) => {
            document.getElementById(c.id).classList.remove('escolhida')
        })
        escolhas = []
        socket.emit('troca-vez', {vez : minha_vez})
    // }
})

socket.on('troca', (...args) => {
    let players = args[0].players
    minha_vez = args[0].vez
    players.forEach((p, index) => {
        if(minha_vez === player.id){
            document.getElementById(`placar_p${index}`).classList.add("vez")
            // alert("É a sua vez!")
        }else{
            document.getElementById(`placar_p${index}`).classList.remove("vez")
        }
    })
    monta_deck()
    marca_vez(players)
})


socket.on("reset", () => {
    localStorage.clear()
    window.location = "/"
})


function mostra_acertos(cartas){
    cartas.forEach( (c, index) => {
        document.getElementById(c.id).setAttribute('data-descoberta', "true")
    })
}

function atualiza_placar(players){
    players.forEach( (p, index) => {
        document.getElementById(`placar_p${index}`).innerHTML = p.placar
    })
}

function marca_vez(players){
    players.forEach( (p, index) => {
        document.getElementById(`placar_p${index}`).innerHTML = p.placar
        if(p.id === minha_vez){
            document.getElementById(`placar_p${index}`).classList.add("vez")
        }else{
            document.getElementById(`placar_p${index}`).classList.remove("vez")
        }
    })
}

function monta_deck(){
    cartas.forEach( (c, index) => {
        let carta = document.getElementById(`c_${index}`)
        carta.setAttribute('class', '')
        if(carta.getAttribute('data-descoberta') === "false"){
            carta.innerHTML = `<img src="./images/carta.png">`
            // carta.innerHTML = `${c}`
            if(minha_vez === player.id){
                carta.addEventListener('click', carta._handler, true)
                carta.classList.add("clicavel")
                // carta.classList.remove("nao_clicavel")
            }
        }
        else{
            carta.removeEventListener('click', carta._handler, true)
            // carta.classList.remove("clicavel")
            carta.classList.add("nao_clicavel")
        }
    })
}

// function handler_carta(event) {
//     const id = event.id // ou event.target.id
//     vira_carta(id)
// }

function monta_deck_jogador(){
    console.log('monta_deck_jogador')
    cartas.forEach( (c, index) => {
        let carta = document.getElementById(`c_${index}`)
        // carta.innerHTML = `<img src="./images/carta.png">`
        carta.innerHTML = `${c}`
        // carta._handler = handler_carta(carta)
        carta.setAttribute('class', '')
        if(carta.getAttribute('data-descoberta') === "false" && minha_vez === player.id){
            carta.addEventListener('click', carta._handler, true)
            carta.classList.add("clicavel")
            // carta.classList.remove("nao_clicavel")
        }
        else{
            carta.removeEventListener('click', carta._handler, true)
            // carta.classList.remove("clicavel")
            carta.classList.add("nao_clicavel")
        }
    })
}

function monta_deck_oponente(){

}

function reset(){
    socket.emit('reset')
    localStorage.clear()
    window.location = "/"
}

socket.on('mostra-client', (id) => {
    let posicao = id.substring(2)
    let carta = document.getElementById(id)
    carta.innerHTML = `<img src="./images/${cartas[posicao]}">`
    carta.removeEventListener('click', carta._handler, true)
    
    carta.classList.remove("clicavel")
    carta.classList.add("nao_clicavel")
    carta.classList.add('escolhida')
})

function vira_carta(id){
    let carta = document.getElementById(id)
    if(carta.classList.contains("clicavel")){

        if(player.id == minha_vez){
            if(escolhas.length < 3 ){
                
                socket.emit('mostra', id)
        
                let posicao = carta.id.substring(2)
                carta.innerHTML = `<img src="./images/${cartas[posicao]}">`
                // carta.innerHTML = `${cartas[posicao]}`
                escolhas.push({
                    "id" : carta.id
                })
                if(escolhas.length === 3){
                    setTimeout(() => {
                        socket.emit('escolhas', {
                            "jogada": escolhas,
                            "player": player
                        })
                    }, 5000) //aguarda 5 segundos antes de desvirar as cartas
                }
            }
        }else{
            alert("Aguarde sua vez!")
        }
    }
}


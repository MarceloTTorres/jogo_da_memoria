# Jogo da Memória — ETEC de Araraquara

<p align="center">
  <strong>Real-Time Multiplayer Memory Game</strong>
</p>

<p align="center">
  A multiplayer memory game developed for the <strong>ETEC de Araraquara Course Fair</strong>, using JavaScript, Node.js, Express and Socket.IO.
</p>

---

## 🎓 About the Project

**Jogo da Memória** is a real-time multiplayer memory game developed specifically for the **Feira de Cursos da ETEC de Araraquara**.

The project was created as an interactive experience for visitors to the event, combining:

* Web development
* Game development
* Real-time communication
* Multiplayer interaction
* Educational technology
* Event engagement

Unlike a traditional single-player memory game, this application was designed around a **two-player real-time experience**, where the game state is synchronized between connected browsers.

---

## 🏫 ETEC de Araraquara Course Fair

The project was developed for the **Feira de Cursos da ETEC de Araraquara**, an event focused on presenting the school's courses and activities to visitors and prospective students.

The game was conceived as an interactive attraction that could demonstrate software-development concepts in an accessible and engaging way.

The project connects:

```text
ETEC Course Fair
       │
       ▼
Interactive Experience
       │
       ▼
Multiplayer Game
       │
       ▼
Real-Time Technology
       │
       ▼
Student Engagement
```

This real-world event context is an important part of the project.

It demonstrates how software can be developed not only as a technical exercise, but also as an **interactive solution for a specific institutional event**.

---

## 🎮 Game Concept

The objective is to match groups of cards and accumulate points.

The game supports **two simultaneous players**.

Each player:

1. Joins the game.
2. Selects a nickname.
3. Waits for another player.
4. Receives a turn.
5. Selects cards.
6. Attempts to find a matching group.
7. Earns points when successful.
8. Continues playing until the game is completed or restarted.

The game board contains **24 cards**, and the server controls the card configuration and game state.

---

## 🕹️ Multiplayer Gameplay

The main technical characteristic of this project is its **real-time multiplayer architecture**.

Two players can connect from different browser sessions while interacting with the same game state.

```text
                 ┌─────────────────┐
                 │  Node.js Server │
                 │                 │
                 │  Game State     │
                 │  Players        │
                 │  Turns          │
                 │  Score          │
                 │  Cards          │
                 └────────┬────────┘
                          │
                 Socket.IO / WebSocket
                     ┌────┴────┐
                     │         │
                     ▼         ▼
                Player 1   Player 2
                Browser    Browser
```

This architecture allows actions performed by one player to be communicated to the other connected client.

---

## ⚡ Real-Time Communication

The project uses **Socket.IO** to establish real-time communication between browsers and the Node.js server.

The server listens for game events such as:

* Player joining
* Player nickname registration
* Card selections
* Correct guesses
* Incorrect guesses
* Turn changes
* Card display
* Player disconnection
* Game reset

These events are transmitted through Socket.IO and used to synchronize the clients.

---

## 🏗️ Architecture

The application follows a client-server architecture.

```text
                    ┌──────────────────────┐
                    │      Browser 1       │
                    │                      │
                    │ HTML / CSS / JS      │
                    └──────────┬───────────┘
                               │
                               │ Socket.IO
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Node.js Server   │
                    │                      │
                    │ Express              │
                    │ Socket.IO            │
                    │ Game State           │
                    └──────────┬───────────┘
                               │
                               │ Socket.IO
                               │
                    ┌──────────▼───────────┐
                    │      Browser 2       │
                    │                      │
                    │ HTML / CSS / JS      │
                    └──────────────────────┘
```

The server acts as the **authoritative game-state manager**.

---

## 🧠 Server-Side Game State

The Node.js server maintains the central state of the game.

It tracks:

* Connected players
* Player IDs
* Player nicknames
* Player scores
* Current turn
* Card configuration
* Maximum number of players

The implementation defines a maximum of **two players per game session**.

Conceptually:

```text
Game State
│
├── Players
│   ├── Player 1
│   │   ├── ID
│   │   ├── Nickname
│   │   └── Score
│   │
│   └── Player 2
│       ├── ID
│       ├── Nickname
│       └── Score
│
├── Current Turn
│
└── Card Deck
```

---

## 🔀 Card Randomization

At the beginning of a game, the server randomizes the card deck.

The implementation maintains the card collection on the server and applies a shuffle operation before starting a new game.

This is important because the game board should not be determined independently by each browser.

Instead:

```text
Server
  │
  ▼
Shuffle Cards
  │
  ▼
Create Game State
  │
  ▼
Synchronize Players
```

This ensures that both clients operate against the same game configuration.

---

## 🏆 Scoring System

Each player has an associated score.

When a player successfully identifies a valid matching group, the server increments that player's score and broadcasts the updated state.

Conceptually:

```text
Player selects cards
        │
        ▼
Server validates selection
        │
        ├── Correct
        │     │
        │     ▼
        │   +1 point
        │
        └── Incorrect
              │
              ▼
           No point
```

Keeping score on the server rather than relying exclusively on the browser helps maintain a consistent multiplayer state.

---

## 🔄 Turn Management

The game implements explicit turn management.

After a player's action, the server can determine the next player and broadcast the updated turn information to the connected clients.

```text
Player 1
   │
   ▼
Make Move
   │
   ▼
Server
   │
   ▼
Update Game State
   │
   ▼
Player 2
   │
   ▼
Make Move
   │
   ▼
Server
```

This is a fundamental multiplayer-game concept and also demonstrates principles applicable to real-time distributed applications.

---

## 👥 Player Management

When a client connects, the server checks whether the game already has the maximum number of players.

If the room is full, the server sends a `sala-cheia` event to the new client.

This creates a simple matchmaking/room-capacity mechanism:

```text
Player connects
      │
      ▼
Players < 2?
   ┌──┴──┐
  YES    NO
   │      │
   ▼      ▼
Join    Room Full
Game
```

---

## 🔌 Connection Lifecycle

The server also handles client disconnections.

When a player disconnects, the current implementation resets the game state and notifies connected clients that the game should be reset.

This demonstrates an important aspect of multiplayer applications:

> The application must respond not only to gameplay events, but also to network and connection lifecycle events.

---

## 🌐 Technology Stack

| Technology | Purpose                             |
| ---------- | ----------------------------------- |
| Node.js    | Server-side JavaScript runtime      |
| Express    | HTTP server and static file serving |
| Socket.IO  | Real-time multiplayer communication |
| JavaScript | Client and server logic             |
| HTML5      | Game interface                      |
| CSS        | Game presentation                   |
| JSON       | Card data                           |
| WebSockets | Real-time communication layer       |

The project's `package.json` explicitly declares Express 5.1 and Socket.IO 4.8.1 as dependencies.

---

## 📂 Project Structure

The repository contains:

```text
jogo_da_memoria/
│
├── public/
│   ├── ...
│   └── cartas.json
│
├── index.html
├── game.html
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── LICENSE
```

The game page contains the 24-card board and loads the Socket.IO client together with the game's client-side JavaScript.

---

## 🔌 HTTP Routes

The Express server exposes the application pages through HTTP routes.

The current implementation provides:

```text
GET /
    ↓
index.html

GET /game
    ↓
game.html
```

Static files are served from the `public` directory.

---

## 🔄 Event-Driven Architecture

The application is fundamentally event-driven.

A simplified event model is:

```text
Client
  │
  ├── entrar
  │
  ├── escolhas
  │
  ├── troca-vez
  │
  └── mostra
  │
  ▼
Socket.IO Server
  │
  ├── iniciar
  ├── acertou
  ├── errou
  ├── troca
  ├── mostra-client
  ├── sala-cheia
  └── reset
  │
  ▼
Connected Clients
```

This architecture is particularly useful for applications where users need to see changes immediately without refreshing the page.

---

## 🧩 Software Engineering Concepts

Although the project is a game, it demonstrates several concepts that are highly relevant to professional software engineering.

### Client-Server Architecture

The browser acts as the client while the Node.js server manages shared state.

### Event-Driven Programming

Game interactions are represented as events transmitted through Socket.IO.

### Real-Time Communication

The application synchronizes game actions between connected clients.

### State Management

The server maintains the authoritative game state.

### Session Management

Players are associated with Socket.IO connection IDs.

### Distributed State

Multiple clients interact with a common state maintained by the server.

### Network Lifecycle

Connection and disconnection events are explicitly handled.

---

## 🧠 Why Multiplayer Makes This Project More Interesting

A traditional memory game could be implemented entirely inside a browser.

This project goes further by introducing a server and multiplayer communication layer.

Instead of:

```text
Browser
   │
   └── Game Logic
```

the project uses:

```text
Browser A
    │
    ▼
Node.js + Socket.IO
    ▲
    │
Browser B
```

That architectural change introduces concepts such as:

* Synchronization
* Shared state
* Network events
* Client/server boundaries
* Connection management
* Concurrency
* Real-time communication

These are concepts that extend well beyond game development.

---

## 🎓 Educational Context

The project was developed for the **Feira de Cursos da ETEC de Araraquara**.

Its purpose was to provide an interactive experience during an educational event while simultaneously demonstrating technologies used in modern software development.

The project therefore combines:

```text
Software Engineering
        +
Web Development
        +
Real-Time Systems
        +
Game Development
        +
Education
```

This makes it a practical example of using technology to support engagement at an educational institution.

---

## 🏫 Real-World Use Case

The application was designed around a specific event environment rather than as a generic programming exercise.

Visitors could interact with the game while experiencing a practical demonstration of software developed within the ETEC environment.

This type of project demonstrates an important engineering skill:

> Translating a concrete event or institutional requirement into an interactive software solution.

---

## 🚀 Running the Project

### Requirements

* Node.js
* NPM
* Modern web browser

### Install dependencies

```bash
npm install
```

### Start the server

```bash
node server.js
```

The current server listens on port `80` and also attempts to identify the machine's local IPv4 address when starting.

> On some operating systems, binding directly to port 80 may require administrator/root privileges. For development, a configurable non-privileged port would be preferable.

### Open the application

Open the address displayed by the server.

For example:

```text
http://localhost/
```

or the local network address displayed when the server starts.

---

## 🔮 Future Improvements

The project provides a foundation that could be extended considerably.

Potential improvements include:

* [ ] Configurable server port
* [ ] Multiple game rooms
* [ ] Matchmaking
* [ ] Player authentication
* [ ] Persistent player profiles
* [ ] Persistent scores
* [ ] Leaderboards
* [ ] Spectator mode
* [ ] Reconnection support
* [ ] Better disconnect handling
* [ ] Server-side validation improvements
* [ ] Automated tests
* [ ] TypeScript migration
* [ ] Docker support
* [ ] GitHub Actions CI/CD
* [ ] Cloud deployment
* [ ] Responsive mobile interface
* [ ] Accessibility improvements
* [ ] Internationalization

---

## ☁️ Cloud Architecture Opportunity

A production-oriented evolution could deploy the game server to a cloud environment:

```text
                  Internet
                     │
                     ▼
             ┌───────────────┐
             │ Load Balancer │
             └───────┬───────┘
                     │
              ┌──────▼──────┐
              │ Game Server  │
              │ Node.js      │
              │ Socket.IO    │
              └──────┬──────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
      Player A              Player B
```

Additional services could provide:

* Persistent scores
* User accounts
* Analytics
* Game history
* Monitoring
* Horizontal scaling

This would transform the project into a more complete **real-time multiplayer platform**.

---

## 🧪 Testing Opportunities

A modernized version could introduce automated tests for:

### Game Rules

* Valid card combinations
* Invalid selections
* Score calculation
* Turn changes

### Multiplayer

* Maximum player count
* Player connection
* Player disconnection
* Game reset
* Event broadcasting

### Server

* HTTP routes
* Socket.IO events
* Game-state transitions

Example conceptual test:

```text
Given two connected players
        ↓
When Player 1 makes a valid move
        ↓
Then Player 1 receives a point
        ↓
And both clients receive the updated state
        ↓
And the game advances correctly
```

---

## 💼 Portfolio Value

This project is particularly valuable because it demonstrates **real-time software development**.

For an international software engineering portfolio, the strongest message is not simply:

> "I developed a memory game."

It is:

> **"I developed a real-time multiplayer web application using Node.js and Socket.IO for an educational event at ETEC de Araraquara."**

That distinction is significant.

The project demonstrates experience with:

* Node.js
* Express
* Socket.IO
* WebSockets
* Event-driven architecture
* Multiplayer state management
* Client/server architecture
* Real-time synchronization
* JavaScript
* HTML/CSS

---

## 📊 Portfolio Positioning

This project complements the other repositories in the portfolio:

| Project             | Main Engineering Story                |
| ------------------- | ------------------------------------- |
| **ChamaSenha**      | Real-time queue system / Socket.IO    |
| **Jogo da Memória** | Real-time multiplayer / game state    |
| **FEC Web**         | Laravel / PHP / Vue / Full Stack      |
| **FEC App**         | Angular / Ionic / TypeScript / Mobile |
| **PrjGaragemCS**    | C# / .NET / SQL Server                |
| **jogoEtec**        | Unity / C# / Multiplayer              |
| **Odonto App**      | Flutter / API / Health Education      |

The combination of **ChamaSenha + Jogo da Memória** is especially interesting because both demonstrate your experience with **real-time communication using Socket.IO**, but applied to completely different domains.

---

## 🎓 Educational Technology

The project represents another example of applying software development to education.

Rather than creating software exclusively for commercial purposes, the application was designed for an educational institution and an academic event.

The project combines:

**Education + Technology + Interactive Software + Real-Time Communication**

This is consistent with the broader portfolio of projects developed in academic environments.

---

## 👨‍💻 Author

**Marcelo Torres**

Software Engineer | Full-Stack Developer | Technical Lead | Educator

Areas of interest:

* Software Engineering
* Backend Development
* Full-Stack Development
* Node.js
* Real-Time Systems
* WebSockets
* Mobile Development
* Cloud Computing
* Software Architecture
* Educational Technology
* Technical Leadership

---

## 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

---

## Final Note

**Jogo da Memória** was developed for the **Feira de Cursos da ETEC de Araraquara** as an interactive multiplayer experience.

Beyond the game itself, the project demonstrates practical experience with **Node.js, Express, Socket.IO, event-driven architecture, real-time communication and multiplayer state management**.

The project is therefore a useful example of how a relatively simple user experience can require meaningful software engineering decisions when real-time multiplayer functionality is introduced.

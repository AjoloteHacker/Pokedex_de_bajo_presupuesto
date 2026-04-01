const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

const httpServer = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  let filePath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  filePath = path.join(__dirname, 'public', filePath);

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('<h1>404</h1>'); return; }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// ── Signaling only ────────────────────────────────────────
// rooms: { code → [socketId, socketId] }
const rooms = {};

function genCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {

  // Player 1 creates room
  socket.on('create_room', ({ playerName }) => {
    const code = genCode();
    rooms[code] = [socket.id];
    socket.join(code);
    socket.data.room = code;
    socket.data.name = playerName;
    socket.emit('room_created', { code });
  });

  // Player 2 joins room
  socket.on('join_room', ({ code, playerName }) => {
    const room = rooms[code];
    if (!room) return socket.emit('signal_error', 'Sala no encontrada.');
    if (room.length >= 2) return socket.emit('signal_error', 'Sala llena.');

    room.push(socket.id);
    socket.join(code);
    socket.data.room = code;
    socket.data.name = playerName;

    // Tell both players who they are and who the opponent is
    const [p1id, p2id] = room;
    io.to(p1id).emit('peer_ready', { role: 'initiator', opponentName: playerName });
    io.to(p2id).emit('peer_ready', { role: 'receiver',  opponentName: socket.data.name || '?' });

    // Fix: send p1 name to p2
    const p1socket = io.sockets.sockets.get(p1id);
    io.to(p2id).emit('peer_ready', { role: 'receiver', opponentName: p1socket?.data?.name || '?' });
  });

  // WebRTC signaling relay — just forward to the other peer
  socket.on('signal', (data) => {
    const code = socket.data.room;
    if (!code) return;
    // Broadcast to everyone else in the room
    socket.to(code).emit('signal', data);
  });

  socket.on('disconnect', () => {
    const code = socket.data.room;
    if (!code) return;
    socket.to(code).emit('peer_disconnected');
    delete rooms[code];
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🔴 Pokédex server running!`);
  console.log(`📡 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
  console.log(`🔗 WebRTC signaling: active\n`);
});

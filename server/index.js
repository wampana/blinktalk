const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// Allow requests from the frontend (set CORS_ORIGIN env var in Render to your Vercel URL)
const allowedOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: allowedOrigin },
});

let waitingQueue = [];
let matchCounter = 1;

const removeFromQueue = (socket) => {
  waitingQueue = waitingQueue.filter((s) => s !== socket);
};

const enqueueUnique = (socket) => {
  removeFromQueue(socket);
  waitingQueue.push(socket);
};

const clearPartnerLink = (socket) => {
  if (!socket || !socket.partner) return;
  const partner = socket.partner;
  socket.partner = null;
  socket.matchId = null;
  if (partner.partner === socket) {
    partner.partner = null;
    partner.matchId = null;
  }
  partner.emit("partner-disconnected");
};

const dequeuePartnerFor = (socket) => {
  while (waitingQueue.length > 0) {
    const candidate = waitingQueue.shift();
    if (candidate && candidate !== socket && candidate.connected && !candidate.partner) {
      return candidate;
    }
  }
  return null;
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("find-match", () => {
    if (socket.partner) return;

    // Keep queue clean and prevent duplicates for this socket.
    removeFromQueue(socket);

    const partner = dequeuePartnerFor(socket);
    if (partner) {
      const matchId = `match-${matchCounter++}`;

      socket.emit("match-found", { initiator: true, matchId });
      partner.emit("match-found", { initiator: false, matchId });

      socket.partner = partner;
      partner.partner = socket;
      socket.matchId = matchId;
      partner.matchId = matchId;
    } else {
      enqueueUnique(socket);
    }
  });

  socket.on("signal", (data) => {
    if (!socket.partner || !socket.partner.connected) return;
    if (!data || data.matchId !== socket.matchId) return;
    if (socket.partner.matchId !== socket.matchId) return;

    if (socket.partner && socket.partner.connected) {
      socket.partner.emit("signal", data);
    }
  });

  socket.on("next", () => {
    clearPartnerLink(socket);
    enqueueUnique(socket);
  });

  socket.on("leave-chat", () => {
    clearPartnerLink(socket);
    removeFromQueue(socket);
  });

  socket.on("disconnect", () => {
    clearPartnerLink(socket);
    removeFromQueue(socket);
    socket.matchId = null;
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

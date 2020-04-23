import sirv from "sirv";
import polka from "polka";
import http from "http";
import io from "socket.io";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const server = http.createServer();

polka({ server }) // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });

io(server).on("connection", (socket) => {
  let room;
  const id = socket.id;
  socket.on("join", ({ roomId, ...metadata }) => {
    socket.join(roomId, () => {
      room = roomId;
      socket.nsp.to(room).emit("joined", { id, ...metadata });
    });
  });

  socket.on("setName", ({ name }) => {
    socket.nsp.to(room).emit("setName", { id, name });
  });

  socket.on("echoInfo", (metadata) => {
    socket.nsp.to(room).emit("echoInfo", { id, ...metadata });
  });

  socket.on("vote", ({ vote }) => {
    socket.nsp.to(room).emit("vote", { id, vote });
  });

  socket.on("clearVotes", () => {
    socket.nsp.to(room).emit("clearVotes");
  });

  socket.on("showVotes", () => {
    socket.nsp.to(room).emit("showVotes");
  });

  socket.on("disconnect", () => {
    socket.to(room).emit("remove", { id });
  });
});

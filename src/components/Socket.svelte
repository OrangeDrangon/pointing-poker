<script>
  import { io } from "socket.io-client";
  import { users, disconnected, showVotes } from "../routes/_stores";

  export let roomId;

  let socket = io();

  socket.on("connect", () => {
    $disconnected = false;
    users.reset();
    socket.emit("join", { roomId, name: "unknown" });
  });

  socket.on("joined", (user) => {
    users.addUser(user);
    if (user.id !== socket.id) {
      socket.emit("echoInfo", { showState: $showVotes, ...$users[socket.id] });
    }
  });

  socket.on("echoInfo", ({ showState, ...user }) => {
    users.addUser(user);
    $showVotes = showState;
  });

  socket.on("setName", ({ id, name }) => {
    users.setName(id, name);
  });

  socket.on("vote", ({ id, vote }) => {
    users.setVote(id, vote);
  });

  socket.on("clearVotes", () => {
    $showVotes = false;
    users.clearVotes();
  });

  socket.on("showVotes", () => {
    $showVotes = true;
  });

  socket.on("remove", ({ id }) => {
    users.removeUser(id);
  });

  socket.on("disconnect", () => {
    $disconnected = true;
  });
</script>

<slot {socket} />

<script context="module">
  export async function preload({ params }) {
    return { roomId: params.roomId };
  }
</script>

<script>
  import Text from "../components/Text";
  import io from "socket.io-client";
  export let roomId;
  let name = "unknown";
  let points = "";
  let showVotes = false;
  let disconnected = false;
  let users = {};
  $: usersIterable = Object.entries(users);

  let socket = io("/");
  $: socket.emit("setName", { name });

  socket.on("joined", user => {
    users[user.id] = user;
    if (user.id !== socket.id) {
      socket.emit("echoInfo", { showState: showVotes, ...users[socket.id] });
    }
    users = users;
  });

  socket.on("echoInfo", ({ id, showState, ...metadata }) => {
    users[id] = { ...metadata };
    showVotes = showState;
    users = users;
  });

  socket.on("setName", ({ id, name }) => {
    users[id].name = name;
    users = users;
  });

  socket.on("vote", ({ id, points }) => {
    users[id].points = points;
    users = users;
  });

  socket.on("clearVotes", () => {
    for (const id in users) {
      delete users[id].points;
    }
    users = users;
    showVotes = false;
  });

  socket.on("showVotes", () => {
    showVotes = true;
  });

  socket.on("remove", ({ id }) => {
    delete users[id];
    users = users;
  });

  socket.on("disconnect", () => {
    disconnected = true;
  });

  socket.on("connect", () => {
      users = {};
      socket.emit("join", { roomId, name });
      disconnected = false;
  });

  function handleVote() {
    socket.emit("vote", { points });
  }

  function handleClearAllVotes() {
    socket.emit("clearVotes");
  }

  function handleShowVotes() {
    socket.emit("showVotes");
  }

  function handleReconnect() {
    socket.open();
  }
</script>

<style>
  section {
    display: flex;
    flex-flow: column;
    width: 300px;
  }

  .green {
    color: green;
  }
</style>

<svelte:head>
  <title>{roomId}</title>
</svelte:head>

<header>
  <h1>{roomId}</h1>
  {#if disconnected}
  <h2>Disconnected</h2>
  <button on:click={handleReconnect}>Reconnect</button>
  {/if}
</header>
<section>
  <Text name="Name" bind:value={name} />
  <form on:submit|preventDefault={handleVote}>
    <Text name="Points" bind:value={points} />
    <button type="submit">Vote</button>
    <button on:click|preventDefault={handleShowVotes}>Show Votes</button>
    <button on:click|preventDefault={handleClearAllVotes}>
      Clear ALL Votes
    </button>
  </form>
</section>
<section>
  <ul>
    {#each usersIterable as [id, user]}
      <li class={user.points ? 'green' : ''}>
        {user.name}
        {#if showVotes && user.points != null}- {user.points}{/if}
      </li>
    {/each}
  </ul>
</section>

<script context="module">
  export async function preload({ params }) {
    return { roomId: params.roomId };
  }
</script>

<script>
  import Text from "../components/Text";
  import VotesTable from "../components/VotesTable";
  import UsersTable from "../components/UsersTable";

  import io from "socket.io-client";

  export let roomId;

  let name = "unknown";
  let vote = "";
  let showVotes = false;
  let disconnected = false;
  let users = {};
  let tallies = {};
  $: usersIterable = Object.entries(users);
  $: {
    tallies = {};
    for (const id in users) {
      const { vote } = users[id];
      if (vote) {
        if (tallies[vote] == null) {
          tallies[vote] = 0;
        }
        tallies[vote]++;
      }
    }
  }
  $: talliesIterable = Object.entries(tallies);
  $: talliesIterable.sort((a, b) => b[1] - a[1]);

  let socket = io("/");
  $: socket.emit("setName", { name });

  socket.on("joined", user => {
    users[user.id] = user;
    if (user.id !== socket.id) {
      socket.emit("echoInfo", { showState: showVotes, ...users[socket.id] });
    }
  });

  socket.on("echoInfo", ({ id, showState, ...metadata }) => {
    users[id] = { ...metadata };
    showVotes = showState;
  });

  socket.on("setName", ({ id, name }) => {
    users[id].name = name;
  });

  socket.on("vote", ({ id, vote }) => {
    users[id].vote = vote;
  });

  socket.on("clearVotes", () => {
    for (const id in users) {
      delete users[id].vote;
    }
    showVotes = false;
    users = users;
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
    if (vote) {
      socket.emit("vote", { vote });
    }
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
    margin: 10px;
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
    <Text name="Vote" bind:value={vote} />
    <button type="submit">Vote</button>
    <button on:click|preventDefault={handleShowVotes}>Show Votes</button>
    <button on:click|preventDefault={handleClearAllVotes}>
      Clear ALL Votes
    </button>
  </form>
</section>
<section>
  <UsersTable users={usersIterable} {showVotes} />
</section>
{#if showVotes}
  <section>
    <VotesTable votes={talliesIterable} />
  </section>
{/if}

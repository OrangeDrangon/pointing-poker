<script>
  import Text from "../components/Text";
  import VotesTable from "../components/VotesTable";
  import UsersTable from "../components/UsersTable";
  import {
    users,
    disconnected,
    showVotes,
    tallies,
    name,
    vote
  } from "../routes/_stores";

  export let socket;
  export let roomId;

  $: usersIterable = Object.entries($users);
  $: socket.emit("setName", { name: $name });

  function handleVote() {
    if (vote) {
      socket.emit("vote", { vote: $vote });
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
  {#if $disconnected}
    <h2>Disconnected</h2>
    <button on:click={handleReconnect}>Reconnect</button>
  {/if}
</header>
<section>
  <Text name="Name" bind:value={$name} />
  <form on:submit|preventDefault={handleVote}>
    <Text name="Vote" bind:value={$vote} />
    <button type="submit">Vote</button>
    <button on:click|preventDefault={handleShowVotes}>Show Votes</button>
    <button on:click|preventDefault={handleClearAllVotes}>
      Clear ALL Votes
    </button>
  </form>
</section>
<section class="users">
  <UsersTable users={usersIterable} showVotes={$showVotes} />
</section>
{#if $showVotes}
  <section class="votes">
    <VotesTable votes={$tallies} />
  </section>
{/if}

<script>
  let roomHref = `/${(Math.random() * 1e10).toFixed(0)}`;
</script>

<svelte:head>
  <title>Pointer Poker</title>
</svelte:head>

<header>
  <h1>Pointer Poker</h1>
</header>
<main>
  <a href={roomHref}>Create</a>
</main>

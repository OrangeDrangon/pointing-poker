<script>
  let roomHref = `/${(Math.random() * 1e10).toFixed(0)}`;
</script>

<svelte:head>
  <title>Pointing Poker</title>
</svelte:head>

<header>
  <h1>Pointing Poker</h1>
</header>
<main>
  <a href={roomHref} rel="prefetch">Create</a>
</main>

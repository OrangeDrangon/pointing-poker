<script>
  export let name;
  export let vote;
  export let showVote;
</script>

<style>
  .user {
    display: flex;
    flex-flow: row;
  }

  .user div {
    padding: 10px;
  }

</style>

<div class="user">
  <div class="voted">
    {#if vote}✅{:else}❌{/if}
  </div>
  <div class="name">{name}</div>
  {#if vote && showVote}
    <div class="vote">{vote}</div>
  {/if}
</div>

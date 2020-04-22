<script>
  import User from "./User";

  export let users;
  export let showVotes;
</script>

  {#each users as [id, { name, vote: vote }] (id)}
    <User {name} {vote} showVote={showVotes} />
  {/each}

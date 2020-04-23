<script>
  import Tally from "../components/Tally";
  export let votes;
</script>

<Tally name="Vote" value="Count" />
{#each votes as [name, value] (name)}
  <Tally {name} {value} />
{/each}

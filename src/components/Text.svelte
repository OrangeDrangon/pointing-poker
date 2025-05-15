<script>
  export let name;
  export let value;
  $: id = name.toLowerCase();
</script>

<div>
  <label for={id}>{name}</label>
  <input type="text" {id} bind:value />
</div>

<style>
  div {
    display: flex;
    flex-flow: column;
  }
</style>

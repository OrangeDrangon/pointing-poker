<script>
  export let name;
  export let value;
  $: id = name.toLowerCase();
</script>

<style>
  div {
    display: flex;
    flex-flow: column;
  }
</style>

<div>
  <label for={id}>{name}</label>
  <input type="text" {id} bind:value />
</div>

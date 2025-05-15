<script>
  export let name;
  export let value;
</script>

<div class="tally">
  <div class="col name">{name}</div>
  <div class="col">{value}</div>
</div>

<style>
  .tally {
    display: flex;
    flex-flow: row;
    width: 100%;
    border-top: solid 1px black;
  }

  .tally:last-of-type {
    border-bottom: solid 1px black;
  }

  .name {
    font-weight: bold;
  }

  .col {
    width: 50%;
    border: solid 1px black;
    border-bottom: none;
    border-top: none;
    text-align: center;
  }

  .col:last-child {
    border-left: none;
  }
</style>

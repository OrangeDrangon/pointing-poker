<script context="module">
  export async function preload({ params }) {
    return { roomId: params.roomId };
  }
</script>

<script>
  import Socket from "../components/Socket";
  import Room from "../components/Room";

  export let roomId;
</script>

<Socket {roomId} let:socket>
  <Room {roomId} {socket} />
</Socket>

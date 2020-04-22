import io from "socket.io-client";

export function initializeSocket() {
  let socket = io("/");
  return socket;
}

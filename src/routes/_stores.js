import { writable, derived } from "svelte/store";

function createUsersStore() {
  const { subscribe, set, update } = writable({});

  function setUserProp(propName) {
    return (id, val) =>
      update((state) => {
        state[id][propName] = val;
        return state;
      });
  }

  return {
    subscribe,
    reset: () => set({}),
    addUser: (user) =>
      update((state) => {
        state[user.id] = user;
        return state;
      }),
    removeUser: (id) =>
      update((state) => {
        delete state[id];
        return state;
      }),
    setName: setUserProp("name"),
    setVote: setUserProp("vote"),
    clearVotes: () =>
      update((state) => {
        for (const id in state) {
          delete state[id].vote;
        }
        return state;
      }),
  };
}

function deriveTallies($users) {
  const newTallies = {};
  for (const id in $users) {
    const { vote } = $users[id];
    if (vote) {
      if (newTallies[vote] == null) {
        newTallies[vote] = 0;
      }
      newTallies[vote]++;
    }
  }
  const talliesIterable = Object.entries(newTallies);
  talliesIterable.sort((a, b) => b[1] - a[1]);
  return talliesIterable;
}

export const users = createUsersStore();
export const tallies = derived(users, deriveTallies);
export const showVotes = writable(false);
export const disconnected = writable(false);
export const name = writable("unknown");
export const vote = writable("");

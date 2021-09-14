export const isOnline = () => window.navigator.onLine;

export const createStoreStructure = (items) =>
  items.reduce((acc, current) => Object.assign({}, acc, {[current.id]: current}), {});

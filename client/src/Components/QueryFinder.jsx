export const parseQuery = (search) => {
  return Object.fromEntries(new URLSearchParams(search));
};

export const sessionStorageSet = (key, val) =>
  sessionStorage.setItem(key, val);

export const sessionStorageGet = async (key) => {
  const get = await sessionStorage.getItem(key);
  if (get === 'true' || get === 'false') return JSON.parse(get);
  else return get;
};

export const sessionStorageRemove = (key) =>
  sessionStorage.removeItem(key);

export const sessionStorageClear = async () => sessionStorage.clear();

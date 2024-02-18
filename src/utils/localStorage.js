export const setItemInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getItemInLocalStorage = (key) => {
  const value = localStorage.getItem(key)

  return value ? JSON.parse(value) : null
}

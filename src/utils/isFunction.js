export const isBoolean = (value) => {
  return typeof value === 'boolean'
}

export const isObject = (value) => {
  return typeof value === 'object' && value !== null
}

export const isString = (value) => {
  return typeof value === 'string'
}

export const isArray = (value) => {
  return Array.isArray(value)
}

export const isSpecialKey = (key, keys) => {
  if (keys.includes(key)) {
    return false
  }

  return true
}

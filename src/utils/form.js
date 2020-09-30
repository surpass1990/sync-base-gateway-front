export function removeBlank(obj, included) {
  let keys = included;
  if (!keys) {
    keys = Object.keys(obj);
  }
  for (const key of keys) {
    if (isString(obj[key]) && obj[key].trim().length === 0) {
      obj[key] = undefined;
    }
  }
  return obj;
}

function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]';
}

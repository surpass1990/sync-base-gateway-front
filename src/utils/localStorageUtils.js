/**
 * 读取本地缓存的数据
 * @param key 键
 * @returns {string} 存储结果
 */
export function getData(key) {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return "";
}

/**
 * 保存数据导本地缓存
 * @param key 键
 * @param value 值
 */
export function saveData(key, value) {
  if (typeof value === 'object') {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  return localStorage.setItem(key, value);
}

export function getDynamicOptions(param) {
  const arr = param.split(":");
  const type = arr[0];
  if (type === "systems") {
    const data = getData(type);
    return data ? data.map(({systemCode : c, systemName : d}) => ({code: c, desc: d})) : [];
  }
  if (type === "products") {
    const data = getData(type);
    return data ? data.map(({productCode : c, productName : d}) => ({code: c, desc: d})) : [];
  }
  if (type === "dictEnums") {
    const data = getData(type);
    if (data) {
      return data[arr[1]];
    }
    return [];
  }
  if (type === "enums") {
    const data = getData(type);
    if (data) {
      return data[arr[1]];
    }
    return [];
  }
  return [];
}


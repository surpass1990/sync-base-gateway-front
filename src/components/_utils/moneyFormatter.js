

/**
 * 格式化金额
 * @param num 要格式化的数字
 * @param bit 保留几位小数
 * @returns {string}
 */
export function formatMoney(num, bit) {
  bit = bit > 0 && bit <= 20 ? bit : 2;
  num = parseFloat((num + "").replace(/[^\d\.-]/g, "")).toFixed(bit) + "";
  var l = num.split(".")[0].split("").reverse(),
    r = num.split(".")[1];
  let t = "";
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
}

/**
 * 多数据相加
 * @returns {number}
 */
export function add () {
  let result = 0;
  for (let i = 0; i < arguments.length; i ++) {
    if (typeof arguments[i] === "number") {
      result += arguments[i];
    }
  }
  return result;
}

/**
 * 百分号格式化
 * @param number
 * @param bit
 */
export function percent (number, bit) {
  bit = (bit === undefined ? 2 : bit);
  return Math.round(number * (Math.pow(10, bit + 2)))/Math.pow(10, bit) + "%";
}

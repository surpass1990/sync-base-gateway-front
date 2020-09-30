import request from '../utils/request';
import getRequestUrl from '../utils/commonUtils';


/**
 * 分页查询数据
 * @param params 请求参数
 * @param url 请求地址
 * @returns {Promise<void>} 数据结果
 */
export async function pages(params) {
  return request(getRequestUrl(params), {
    method: 'POST',
    body:{...params},
  });
}

/**
 * 添加数据
 * @param params 参数信息
 * @param url 请求地址
 * @returns {Promise<void>} 响应结果
 */
export async function add(params) {
  return request(getRequestUrl(params), {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 更新数据信息
 * @param params  更新数据
 * @param url 请求地址
 * @returns {Promise<void>} 响应结果
 */
export async function update(params) {
  return request(getRequestUrl(params), {
    method: 'POST',
    body: { ...params },
  });
}





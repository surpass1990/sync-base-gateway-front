import request from '../../utils/request';

/**
 * 分页查询系统配置
 */
export async function list(params) {
  return request('/admin/config/wdcList', {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 添加系统配置
 */
export async function add(params) {
  return request('/admin/config/add', {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 修改系统配置
 */
export async function update(params) {
  return request('/admin/config/update', {
    method: 'POST',
    body: { ...params },
  });
}

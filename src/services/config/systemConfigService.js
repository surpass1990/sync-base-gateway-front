import request from '../../utils/request';

/**
 * 分页查询系统配置
 */
export async function list(params) {
  return request('/admin/user/userList', {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 添加系统配置
 */
export async function add(params) {
  return request('/admin/config/system/add', {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 修改系统配置
 */
export async function update(params) {
  return request('/admin/config/system/update', {
    method: 'POST',
    body: { ...params },
  });
}

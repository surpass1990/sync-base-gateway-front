import request from '../../utils/request';

/**
 * 分页查询WDC数据源配置
 */
export async function list(params) {
  return request('/admin/config/wdcList', {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 添加WDC数据源配置
 */
export async function add(params) {
  return request('/admin/config/add', {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 修改WDC数据源配置
 */
export async function update(params) {
  return request('/admin/config/update', {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 删除WDC数据源配置
 */
export async function del(params) {
  return request('/admin/config/del', {
    method: 'POST',
    body: { ...params },
  });
}


import request from '../../utils/request';

/**
 * 分页查询同步记录信息
 */
export async function list(params) {
  return request('/admin/sync/syncList', {
    method: 'POST',
    body: { ...params },
  });
}


/**
 * 查询同步详情
 * @param params 同步标识
 * @returns {Promise<void>}
 */
export async function findSyncDetail(params) {
  return request('/admin/sync/syncDetailList', {
    method: 'POST',
    body: { ...params },
  });
}


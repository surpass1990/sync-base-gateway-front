import request from '../../utils/request';

/**
 * 分页个人信息关系
 */
export async function list(params) {
  return request('/admin/userManage/user/userList', {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 查询用户详情
 * @param params 用户参数
 * @returns {Promise<void>}
 */
export async function findUserDetail(params) {
  return request('/admin/userManage/user/findUserDetail', {
    method: 'POST',
    body: { ...params },
  });
}


/**
 * 同步用户信息
 * @param params 用户参数
 * @returns {Promise<void>}
 */
export async function syncUserInfo(params) {
  return request('/admin/userManage/user/syncUserInfo', {
    method: 'POST',
    body: { ...params },
  });
}

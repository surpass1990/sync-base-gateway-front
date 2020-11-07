import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  // return request('/api/currentUser');
  return request('/admin/currentUser');
}


export async function logout() {
  return request('/admin/logout');
}

export async function chgPwd(params) {
    return request('/admin/user/chgPwd', {
    method: 'POST',
    body: params,
  });
}
import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '首页',
    icon: 'home',
    path: 'home',
  },
  
  {
    name: '用户管理',
    path: '/config/user',
    icon: 'setting',
    authority: ['admin', '/config/user'],
  },
  {
    name: '数据源管理',
    path: '/config/dbConfig',
    icon: 'setting',
    authority: ['admin', '/config/dbConfig'],
  },
  // {
  //   name: '',
  //   path: '/user/login',
  //   authority: ['admin', '/user/login'],
  // },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let {path} = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);

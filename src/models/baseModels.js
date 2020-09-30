import {message} from "antd";
import { pages} from '../services/baseService';

export function* pagesForEffects({payload}, {call, put}) {
  const params = {...payload, requestUrl:''};
  const {success, message: msg, data, pagination} = yield call(pages, params);
  if (success) {
    yield put({
      type: 'pages',
      payload: { data, pagination },
    });
  } else {
    message.error(msg);
  }
}

export function* findAllForEffects({payload}, {call, put}, { callback }) {
  const params = {...payload, requestUrl:''};
  const response = yield call(pages, params);
  yield put({
    type: 'findAll',
    payload: response || [],
  });
  if (typeof callback === 'function') {
    callback();
  }
}

 /**
 * 存储分页查询结果
 * @param state
 * @param payload
 * @returns {{table: *}}
 */
export function pagesForReducers(state, {payload}) {
  return {...state, table: payload};
}

export function findAllForReducers(state, {payload}) {
  return {...state, currDatas: payload};
}



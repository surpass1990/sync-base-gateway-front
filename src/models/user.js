import { message } from 'antd';
import { query as queryUsers, queryCurrent, logout, chgPwd } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent({ callback }, { call, put }) {
      const response = yield call(queryCurrent);
      if (callback) callback(response);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *logout({ callback }, { call, put }) {
      const response = yield call(logout);
      yield put({
        type: 'reset',
        payload: response,
      });
    },

  
    *chgPwd({ payload, callback }, { call, put }) {
      const response = yield call(chgPwd, payload);
      if (String(response.code) === '200') {
        message.success("操作成功");
        if (callback) callback();
      }else {
        message.error(response.message);
      }
    },
    
  },

  reducers: {

    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },

    reset(state, action) {
      return {};
    },

    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },

    openChgPwd(state, {payload}) {
      return {
        ...state,
        chgPwdStatus: payload,
      };
    },

  },
};

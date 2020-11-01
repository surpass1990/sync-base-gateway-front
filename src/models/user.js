import { query as queryUsers, queryCurrent, logout } from '../services/user';

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
  },
};

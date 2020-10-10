/* eslint-disable import/first,linebreak-style */
import { list, add, update } from '../../services/config/userConfigService';
import { message } from 'antd';

/**
 * 系统配置
 */
export default {
  namespace: 'userConfig',

  state: {
    table: {
      data: [],
      pagination: {},
    },
    addModal: {
      visible: false,
    },
    updateModal: {
      visible: false,
      oldRecord: {},
    },
    systems: [],
  },

  effects: {
    * list({ payload }, { call, put }) {
      const { success, message: msg, data, pagination } = yield call(list, payload);
      if (success) {
        yield put({
          type: 'save',
          payload: { data, pagination },
        });
      } else {
        message.error(msg);
      }
    },

    * add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (response.code === 0 || response.code === 200) {
        message.success(response.message);
        if (callback) callback();
      } else {
        message.error(response.message);
      }
    },

    * update({ payload, callback }, { call }) {
      const response = yield call(update, payload);
      if (response.code === 0 || response.code === 200) {
        message.success(response.message);
        if (callback) callback();
      } else {
        message.error(response.message);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, table: payload };
    },

    saveAll(state, { payload }) {
      return { ...state, systems: payload };
    },

    displayAddModal(state, { payload }) {
      return { ...state, addModal: { visible: payload } };
    },

    displayUpdateModal(state, { payload }) {
      const newState = { ...state };
      newState.updateModal.visible = payload;
      return newState;
    },

    bindOldRecord(state, { payload }) {
      const newState = { ...state };
      newState.updateModal.oldRecord = payload;
      return newState;
    },
  },
};

import { message } from 'antd';
import {baseState} from '../../utils/commonUtils';
import {findSyncDetail, doSync, list} from '../../services/userManage/syncService';

/**
 * 同步用户信息
 */
export default {
  namespace: 'syncRecord',

  state: baseState("syncRecord", "同步用户信息"),


  effects:{
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

    /**
     * 发起同步操作
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    * doSync({ payload }, { call }) {
      const { message: msg } = yield call(doSync, payload);
      message.info(msg);
    },

    * findSyncDetail({ payload }, { call, put }) {
      const { success, message: msg, data, pagination } = yield call(findSyncDetail, payload);
      if (success) {
        yield put({
          type: 'saveDetail',
          payload: { data, pagination },
        });
      } else {
        message.error(msg);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, table: payload };
    },

    displayViewModal(state, { payload }) {
      const newState = { ...state };
      newState.viewModal.visible = payload;
      return newState;
    },

    bindOldRecord(state, { payload }) {
      const newState = { ...state };
      newState.updateModal.oldRecord = payload;
      newState.viewModal.oldRecord = payload;
      return newState;
    },

    saveDetail(state, { payload }) {
      return { ...state, viewModal: payload };
    },
  },
}


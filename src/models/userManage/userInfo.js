import {message} from 'antd';
import {baseState} from '../../utils/commonUtils';
import {list, syncUserInfo, findUserDetail} from '../../services/userManage/userInfoService';

/**
 * 用户信息
 */
export default {
  namespace: 'userInfo',

  state: baseState("userInfo", "用户信息"),

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

    * findUserDetail({ payload, callback }, { call, put }) {
      const { success, message: msg, data } = yield call(findUserDetail, payload);
      if (success) {
        yield put({
          type: 'saveUserDetail',
          payload: { data },
        });
        if (callback) callback();
      } else {
        message.error(msg);
      }
    },

    * syncUserInfo({ payload, callback }, { call }) {
      try {
        const { success, message: msg } = yield call(syncUserInfo, payload);
        if (success) {
          if (callback) callback();
        }
        message.info(msg);
      }catch (e) {
        message.info("无同步权限,请联系管理员");
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

    saveUserDetail(state, { payload }) {
      const newState = { ...state };
      newState.userDetail=payload.data;
      return newState;
    },
  },
}


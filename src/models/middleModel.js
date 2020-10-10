/**
 * 全局中间配置
 */
export default {
  namespace: 'middleModel',

  state: {
  },

  effects: {
    
  },

  reducers: {

    display(state, { payload, isUpdate }) {
      const newState = { ...state };
      newState.visible = payload;
      newState.isUpdate = isUpdate;
      return newState;
    },

    bindOldRecord(state, { payload }) {
      const newState = { ...state };
      newState.preUpdate = payload;
      return newState;
    },
  },
};

export default {
  namespace: 'global',

  state: {
    collapsed: false,

    enums: {
      systemTypes: [],
      statuses: [],
      flowStatuses: [],
      applys:[],
      userTypes:[],
    },
    auth: {
      productRolesMap: {},
      roleMap: [],
    },
    systems: [],
    products: [],
    busis:[],
    groups:[],
  },

  effects: {

  },

  reducers: {

  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

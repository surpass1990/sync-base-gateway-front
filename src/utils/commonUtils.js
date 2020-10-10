import {Button, Checkbox, Popconfirm, Radio, Row, Select} from "antd";
import React from "react";
import moment from "moment";
import {initOptions, initOptionsByCodeKey} from "./Enums";
import {moduleDataHandler, moduleHandler, recursiveModulesList} from "./elementParserUtil";

/**
 * uuid
 * @returns {string}
 */
export function uuid() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
/**
 * 定义默认的state对象
 * @returns {{updateModal: {visible: boolean, oldRecord: {}}, systems: Array, addModal: {visible: boolean}, table: {pagination: {}, data: Array}}}
 */
export function baseState(prefix, title) {
  return {
    baseUrl:{
      add: `${prefix}/add`,
      update: `${prefix}/update`,
      list:`${prefix}/list`,
      findAll: `${prefix}/findAll`,
      displayAdd: `${prefix}/displayAddModal`,
      displayUpdate: `${prefix}/displayUpdateModal`,
      displayView: `${prefix}/displayViewModal`,
      bindOldRecord: `${prefix}/bindOldRecord`,
      forbid: `${prefix}/forbid`,
    },
    commons:{
      viewTitle: title,
      emitName: `${prefix}SearchFormSubmit`,
      addTitle: `添加${title}配置`,
      updateTitle:`更新${title}配置`,
    },
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
    viewModal: {
      visible: false,
      oldRecord: {},
    },
    /**
     * 系统列表
     */
    systems: [],
    /**
     * 产品列表
     */
    products: [],
    /**
     * 业务线列表
     */
    busis:[],
    /**
     * 当前业务数据集合
     */
    currDatas:[],
    formItemLayout : {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
    },
  }
}

/**
 * 从params中获取请求的地址
 * @param params
 * @returns {string}
 */
export function getRequestUrl(params) {
  let url = '';
  if(params.has("requestUrl")){
    url = params.requestUrl;
    // 删除临时参数
    params.deleteProperty("requestUrl");
  }
  return url;
}

/**
 * 解析参数，将params中system、product的键值对转为params属性值
 * @param params
 * @returns {*}
 */
export function parseSP(params) {
  return parseBusi(parseProduct(parseSystem(params)));
}

/**
 * 解析参数，将params中system、busi的键值对转为params属性值
 * @param params
 * @returns {*}
 */
export function parseSB(params) {
  return parseBusi(parseSystem(params));
}

/**
 * 解析参数，将params中system的键值对转为params属性值
 * @param params 含有system键值对的参数
 * @returns {*}
 */
export function parseSystem(params) {
  if(params.system){
    // params.systemCode = params.system.key;
    // params.systemName = params.system.label;
    // 删除临时参数
    // delete params.system
    Object.assign(params, {systemCode: params.system.key, systemName: params.system.label});
    const {system,...result} = params;
    return result;
  }
  return params;
}

export function initSystemValue(data) {
  if (data.systemCode) {
    return {
      key: data.systemCode,
      label: data.systemName,
    };
  }
  return undefined;
  // return {
  //   key: data.systemCode ? data.systemCode : "",
  //   label:data.systemName ? data.systemName : "",
  // };
}

/**
 * 解析参数，将params中产品的键值对转为params属性值
 * @param params 含有system键值对的参数
 * @returns {*}
 */
export function parseProduct(params) {
  if(params.product){
    // params.productCode = params.product.key;
    // params.productName = params.product.label;
    // 删除临时参数
    // delete params.product;
    Object.assign(params, {productCode: params.product.key, productName: params.product.label});
    const {product,...result} = params;
    return result;
  }
  return params;
}

/**
 * 初始化产产品默认值
 * @param data
 * @returns {{label: *, key: *}}
 */
export function  initProductValue(data) {
  if (data && data.productCode) {
    return {
      key: data.productCode,
      label:data.productName,
    };
  }
  return undefined;
  // return {
  //   key: data.productCode ? data.productCode : "",
  //   label:data.productName ? data.productName : "",
  // };
}

/**
 * 解析参数，将params中busi的键值对转为params属性值
 * @param params 含有system键值对的参数
 * @returns {*}
 */
export function parseBusi(params) {
  if(params.busi){
    // params.busiCode = params.busi.key;
    // params.busiName = params.busi.label;
    // 删除临时参数
    // delete params.busi;
    Object.assign(params, {busiCode: params.busi.key, busiName: params.busi.label});
    const {busi,...result} = params;
    return result;
  }
  return params;
}

/**
 * 舒适化业务线
 */
export function initBusiValue(data) {
  return {
    key: data.busiCode,
    label:data.busiName,
  };
}

/**
 * 将enum转为map并获取key对应的desc值
 * @param enums 枚举对象
 * @param key 键
 * @returns {string|any} 值
 */
export function renderEnums(enums, key) {
  if (key === null || key === 'null') {
    return '';
  }
  const val = String(key);
  if (enums) {
    const map = new Map(enums.map(({ code, desc }) => [String(code), desc]));
    const value = map.get(val);
    if (value) {
      return value;
    }
    return `${key}(未定义)`;
  }
  return `${key}(未定义)`;
}

/**
 * 从enums中获取codekey对应的列表，并从列表中获得key对应的值
 * @param enums 枚举集合
 * @param codeKey 业务类性
 * @param key key
 * @returns {string|any}
 */
export function renderEnumsByType(enums, codeKey, key) {
  if (key === null || key === 'null') {
    return '';
  }
  const val = String(key);

  if (enums && codeKey in enums) {
    const codes = enums[codeKey];
    if (codes) {
      const map = new Map(codes.map(({ code, desc }) => [String(code), desc]));
      const value = map.get(val);
      if (value) {
        return value;
      }
      return `${key}(未定义)`;
    }
  }
  return `${key}(未定义)`;
}

/**
 * 获取系统名称
 * @param list 系统集合
 * @param key 系统编码
 * @returns {string|*} 系统名称
 */
export function renderSystem(list, key) {
  if (key === null || key === 'null') {
    return '';
  }
  if (list) {
    const arr = list.filter(item => item.systemCode === key);
    if (arr && arr[0]) {
      return arr[0].systemName;
    }
    return `${key}(未定义)`;
  }
  return `${key}(未定义)`;
}

/**
 * 获取产品名称
 * @param list 产品集合
 * @param key 产品编码
 * @returns {string|*}  产品名称
 */
export function renderProduct(list, key) {
  if (key === null || key === 'null') {
    return '';
  }
  if (list) {
    const arr = list.filter(item => item.productCode === key);
    if (arr && arr[0]) {
      return arr[0].productName;
    }
    return `${key}(未定义)`;
  }
  return `${key}(未定义)`;
}

/**
 * 获取业务名称
 * @param list 业务集合
 * @param key 业务编码
 * @returns {string|*}  业务名称
 */
export function renderBusis(list, key) {
  if (key === null || key === 'null') {
    return '';
  }
  if (list) {
    // console.info("list is:", list);
    const arr = list.filter(item => item.busiCode === key);
    if (arr && arr[0]) {
      return arr[0].busiName;
    }
    return `${key}(未定义)`;
  }
  return `${key}(未定义)`;
}

/**
 * 将系统信息转为Option
 */
export function initSystemOptions(systems) {
  const { Option } = Select;
  return systems.map(({ systemCode: code, systemName: desc }) => <Option key={code} value={code}>{desc}</Option>);
}

/**
 * 讲产品信息转为Option
 */
export function initProductOptions(products, withKey=false) {
  const { Option } = Select;
  if (withKey) {
    return products.map(({ productCode: code, productName: desc }) => <Option key={code} value={code}>{code}-{desc}</Option>);
  }
  return products.map(({ productCode: code, productName: desc }) => <Option key={code} value={code}>{desc}</Option>);
}

/**
 * 获取url最后的uri
 */
export function getLastUri() {
  const url = window.location.href;
  const arr = url.split("/");
  return arr[arr.length - 1];
}

/**
 * 对象深拷贝
 * @param param
 * @returns {{}}
 */
export function deepCopy(param){
  if (param) {
    return JSON.parse(JSON.stringify(param));
  }
  return {};
}

/**
 * 初始化含有过滤功能的下拉Select组件
 */
export function initFilterSelect(data, onChange) {
  return (
    <Select
      mode="multiple"
      placeholder="请选择"
      showArrow
      onChange={onChange}
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      {initOptions(data)}
    </Select>
  );
}

/**
 * 初始化含有过滤功能的下拉Select组件
 */
export function initSingleFilterSelect(data, onChange,flag = false) {
  return (
    <Select
      placeholder="请选择"
      showArrow
      onChange={onChange}
      showSearch
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      disabled={flag}
    >
      {initOptions(data)}
    </Select>
  );
}


/**
 * 初始化含有过滤功能的下拉Select组件
 */
export function initMultipleSelect(data, onChange, flag = false, width) {
  return (
    <Select mode="multiple" placeholder="多选" disabled={flag} onChange={onChange} style={{width}}>
      {initOptions(data)}
    </Select>
  );
}

/**
 * 初始化查询条件的下拉菜单，支持过滤关键字
 */
export function initSearchFilterSelect(data, withKey=false) {
  return (
    <Select
      placeholder="全部"
      showArrow
      showSearch
      allowClear
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      {initOptions(data, withKey)}
    </Select>
  );
}

export function initCommonSelect(data, withKey=false) {
  return (
    <Select
      placeholder="全部"
      allowClear
    >
      {initOptions(data, withKey)}
    </Select>
  );
}

/**
 * 初始化查询条件的下拉菜单，支持过滤关键字
 */
export function initSelect(data, codeKey, flag = false, chg) {
  return (
    <Select placeholder="全部" allowClear disabled={flag} onChange={chg} maxTagCount={6}>
      {initOptionsByCodeKey(data, codeKey)}
    </Select>
  );
}


/**
 * 初始化单选按钮组，
 */
export function initRadioGroup(data, codeKey,flag = false, chg) {
  return (
      <Radio.Group  style={{width:'100%'}} disabled={flag} onChange={chg}>
        {initRadiosByCodeKey(data, codeKey)}
      </Radio.Group>
  );
}

export function initRadiosByCodeKey(data, codeKey){
  const empty = <Radio value="0" >未知</Radio>;
  if (codeKey && data && codeKey in data) {
    const cv = data[codeKey];
    return cv.map(({code : c, desc : d}) => <Radio key={c} value={c}>{d}</Radio>);
  }
  return empty;
}



/**
 * 初始化多选按钮组，
 */
export function initCheckboxGroup(data, codeKey,flag = false, chg) {
  return (
      <Checkbox.Group  style={{width:'100%'}} disabled={flag} onChange={chg}>
          <Row>
            {initCheckboxsByCodeKey(data, codeKey)}
          </Row>
      </Checkbox.Group>
  );
}

export function initCheckboxsByCodeKey(data, codeKey){
  const empty = <Checkbox value="0" >未知</Checkbox>;
  if (codeKey && data && codeKey in data) {
    const cv = data[codeKey];
    return cv.map(({code : c, desc : d}) => <Checkbox key={c} value={c}>{d}</Checkbox>);
  }
  return empty;
}

/**
 * 重置模板缓存
 */
export function resetExistData(dispatch) {
  dispatch({
    type: "appGroupConfig/resetCache",
  });
}

/**
 * 清空缓存
 * @param payload
 * @param newState
 * @returns {*}
 */
export function clearExistData(payload, newState) {
  if (!payload) {
    Object.assign(newState, {templatesList: [], viewTemplates: [], updateData: {}, initData: {}});
  }
  return newState;
}

/**
 * 根据模板code集合查询模板详细信息集合
 * @param dispatch
 * @param tCodes 模板标识集合
 */
export function findTemplateByCodes(dispatch, tCodes){
  dispatch({
    type: 'global/findTemplateByCodes',
    payload: {templateCodes: tCodes},
  });
}

/**
 * 预更新公共逻辑
 * @param dispatch
 * @param record 更新记录
 * @param findTemplateAndDataType 获取模板和数据的url
 * @param state 局部缓存
 */
export function pubHandleUpdateClick(dispatch, record, findTemplateAndDataType, state) {
  dispatch({
    type: findTemplateAndDataType,
    payload: record,
    callback: (data) =>{
      dispatch({
        type: state.baseUrl.bindOldRecord,
        payload: record,
        templateAndData: data,
      });
      dispatch({
        type: state.baseUrl.displayUpdate,
        payload: true,
      });
    },
  });
}

/**
 * 更新绑定模板和参数
 * @param state
 * @param payload
 * @param templateAndData
 */
export function pubBindOldRecord(state, { payload, templateAndData }) {
  const newState = { ...state };
  const appConfigList = templateAndData.appConfigs;
  const appTemplateList = templateAndData.appTemplates;
  const templatesList = [];
  const dataList = [];
  appConfigList.forEach(acl => {
    const resData = Object.assign(acl, JSON.parse(acl.content));
    const arr = [];
    // 通过递归业务数据找出所有集合类型的模块元素(类型是module并且btnsPro === 1)
    recursiveModulesList(arr, resData, undefined);
    const updateTemplate = appTemplateList.filter(atl => atl.templateCode === acl.templateCode).pop();
    // 如果模板组删了模板，就不要对模板进行渲染了
    if (updateTemplate) {
      dataList.splice(0, 0, resData);
      // 通过数据渲染模板
      templatesList.splice(0, 0, moduleDataHandler(updateTemplate, arr));
    }
  });
  // 新增模板没有数据对应，需要显示默认的模板与值信息
  appTemplateList.forEach(item => {
    const arr = appConfigList.filter(c => c.templateCode === item.templateCode);
    if (!arr || arr.length === 0) {
      templatesList.push(deepCopy(item));
    }
  });
  newState.templatesList = templatesList;
  newState.dataList = dataList;
  newState.updateData = payload;
  return newState;
}

/**
 * 公共添加、删除模块
 * @param state
 * @param payload
 */
export function pubModuleHandler(state, { payload }) {
  const newState = { ...state };
  if(newState.updateModal.visible){
    const templates = [];
    // 复制、删除模块及其子元素
    newState.templatesList.forEach(item => {
      // 先找到触发动态模块的模板，对元素所属的模板进行渲染，其他元素原样不变
      let flag = false;
      item.contentList.forEach((val) => {
        if(val.uuid === payload.element.uuid){
          flag = true;
        }
      });
      if (flag) {
        templates.push(moduleHandler(item, payload.opera, payload.element));
      }else{
        templates.push(item);
      }
    });
    newState.templatesList = templates;
  }else{
    const templates = [];
    // 复制、删除模块及其子元素
    newState.appTemplate.templates.forEach(item => {
      templates.push(moduleHandler(item, payload.opera, payload.element));
    });
    newState.appTemplate.templates = templates;
  }
  return newState;
};

/**
 * 数组['a':1,'b':2] 转为对象替代Object.fromEntries函数
 * @param arr
 */
export function arrToObject(arr) {
  const obj = {};
  if (arr && arr.length > 0) {
    arr.forEach(item => {
      const key = item[0];
      const val = item[1];
      obj[key] = val;
    });
  }
  return obj;
}

/**
 * 格式化时间
 */
export function formatDate(date, format='YYYY-MM-DD') {
  if (date && !date.startsWith('0000-00-00')) {
    return moment(date).format(format);
  }
  return '-';
}

/**
 * 通过key获取data中的desc信息
 * @param data
 * @param key
 * @returns {string}
 */
export function getDescFromEnums(data, key) {
  if (data) {
    const kv = data.filter(item => item.code === key).pop();
    if (kv) {
      return kv.desc;
    }
  }
  return "";
}

/**
 * 如果val没有值那么赋予默认值
 * @param val 原值
 * @param defVal 默认值
 * @returns {*}
 */
export function getDefaultVal(val, defVal) {
  if (val !== null && val !== undefined && String(val).length > 0) {
    return val;
  }
  return defVal;
}

/**
 * 获得含有弹出窗的按钮
 * @param title 提示信息
 * @param func 确定事件
 * @param btnMsg 按钮描述
 * @returns {*}
 */
export function getConfirmBtn(title, func, btnMsg) {
  return (
    <Popconfirm
      title={title}
      onConfirm={func}
      okText="是"
      cancelText="否"
    >
      <Button type="primary" ghost size="small" icon="edit">{btnMsg}</Button>
    </Popconfirm>
  );
}


export function doClose(props, flag, updateFlag=false){
  const { dispatch } = props;
    dispatch({
      type: "middleModel/display",
      payload: flag,
      isUpdate: updateFlag,
    });
}

export function bindOldRecord(props, record){
  const { dispatch } = props;
  dispatch({
    type: "middleModel/bindOldRecord",
    payload: record,
  });
}


export function doPreUpdate(props, record){
  doClose(props, true, true);
  bindOldRecord(props, record);
}
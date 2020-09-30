import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import moment from "moment";
import {
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  TimePicker,
  Button,
  Upload,
  Icon,
  Row,
  Col,
  Card,
  message,
} from "antd";
import emitter from "./events";
import {arrToObject, deepCopy, uuid} from "./commonUtils";
import {getDynamicOptions} from "./localStorageUtils";

/**
 * 创建下拉、单选、复选框的options
 */
function createOptions(ele) {
  // 解析动态模板
  if (ele.dataPro) {
    const list = getDynamicOptions(ele.dataPro);
    if (list) {
      return list.map((opt) => {
        return fitOptions(ele, String(opt.code), opt.desc);
      });
    }
  }
  // 解析静态模板
  if (ele.optionsPro) {
    return ele.optionsPro.split(",").map((opt) => {
      const kv = opt.split(":");
      return fitOptions(ele, String(kv[0]), kv[1]);
    });
  }
}

function fitOptions(ele, k, d) {
  const { Option } = Select;
  if (ele.typePro === "radio") {
    const radioKey =  `RADIO_KEY_${k}`;
    return (<Radio key={radioKey} value={k}>{d}</Radio>);
  }else if (ele.typePro === "checkbox") {
    return ({label:d, value:k});
  }
  return (<Option key={k} value={k}>{d}</Option>);
}

/**
 * 计算元素行数
 * @param elements
 * @returns {number}
 */
export function calcRowNum(elements) {
  if (elements) {
    const arr = [...new Set(elements.map(({rowPro: rp}) => rp))];
    if(arr && arr.length > 0){
      const maxRowNum = arr.reduce((a, b) => a > b ? a : b);
      return maxRowNum + 100;
    }
  }
  return 1;
}

/**
 * 对list中元素按行列值进行排序
 * @param list
 * @returns {Array}
 */
function sortRowCol(list) {
  const result = [];
  const rowSort = [];
  // 按rowPro分组排序
  const eleArr = [...new Set(list.map(({rowPro: rp}) => rp))].sort((a, b) => a-b);
  eleArr.forEach((val) =>{
    rowSort.push(list.filter(item => item.rowPro === val));
  });
  // 再按colPro进行排序
  rowSort.forEach( arr => {
    const colsSort = [... new Set(arr)].sort((a, b) => a.colPro-b.colPro);
    result.push(colsSort);
  });
  return result;
}

/**
 *
 * @param elementList 组件元素
 * @param getFieldDecorator 表单装饰器
 * @param appFlag true:添加应用时生成表单，false: 添加模板时预览使用
 * @param record 需要展示的数据
 * @param templateCode 模板的编码
 * @returns {*[]}
 */
export function doElementParse(elementList, getFieldDecorator, appFlag, record, templateCode='template') {
  const noDependsList = elementList.filter(item => !item.dependsModulePro);
  const hasDependsList = elementList.filter(item => item.dependsModulePro);
  return doElementParseByRow(noDependsList, hasDependsList, getFieldDecorator, appFlag, record, templateCode);
}

/**
 * 按行解析每行数据
 * @param elementList 没有依赖的元素
 * @param hasDependsList 有依赖的元素
 * @param getFieldDecorator 数据表单对象
 * @param appFlag true:添加应用时生成表单，false: 添加模板时预览使用
 * @param record 数据表单对象，表单的初始化数据
 * @param templateCode 模板的编码
 * @returns {*[]}
 */
export function doElementParseByRow(elementList, hasDependsList, getFieldDecorator, appFlag, record, templateCode) {
  // 根据行列进行排序
  const list = sortRowCol(elementList);
  return list.map(eles =>{
    let colSum = 0;
    let leftColSum = 0;
    eles.forEach(e => {colSum += (e.colSumPro ? e.colSumPro : 1)});
    const colArr = [];
    let rowNum = 1;
    eles.forEach((ele, index) =>{
      if (ele.typePro) {
        // 计算在一行中的位置
        rowNum = ele.rowPro;
        let span = Math.floor((24 / colSum) * (ele.colSumPro ? ele.colSumPro : 1));
        if (index === eles.length - 1) {
          span = 24 - leftColSum;
        }
        if (ele.typePro === "module") {
          // const divKey = `FORM_CARD_DIV_${ele.realNamePro}`;
          const divKey = `FORM_CARD_DIV_${ele.uuid}`;
          const colKey = `COL_CARD_${ele.uuid}`;
          colArr.push(
            <Col key={colKey} span={24}>
              <div key={divKey}>
                {getSingleFormItem(ele, hasDependsList, getFieldDecorator, appFlag, record, templateCode)}
              </div>
            </Col>
          );
        }else{
          const nameProTmp = (appFlag && ele.dependsModulePro) ? ele.realNamePro : ele.namePro;
          const colKey = `COL_${ele.uuid}`;
          const divKey = `FORM_DIV_${ele.realNamePro}`;
          const formItemKey = `FORM_ITEM_${ele.realNamePro}`;
          const evalParam = `record.${nameProTmp}`;
          const moduleNameProTmp = `${templateCode}.${nameProTmp}`;
          // const initVal = record && record.appCode ? eval(evalParam) : ele.defaultValuePro;
          const initVal = getMultiLevelDefaultValue(ele, evalParam, record, ele.defaultValuePro);

          colArr.push(
            <Col key={colKey} md={span} sm={30}>
              <div key={divKey} onDoubleClick={() => {emitter.emit("operaElementConfirm", ele, true)}}>
                <FormItem label={ele.labelPro} key={formItemKey}>
                  {getFieldDecorator(moduleNameProTmp, {
                    initialValue: initVal,
                    rules:[{
                      required: ele.requiredPro === 1,
                      message: ele.messagePro,
                    }],
                  })(getSingleFormItem(ele, hasDependsList, getFieldDecorator, appFlag, record, templateCode))}
                </FormItem>
              </div>
            </Col>
          );
        }
        leftColSum += span;
      }
    });
    const rowDivKey = `ROW_DIV_${eles.length}_${rowNum}`;
    return (
      <div key={rowDivKey}>
        <Row>
          {colArr}
        </Row>
      </div>
    );
  });
}

/**
 * 获取多级属性对应的值
 * @param ele 多级属性， eg: a.b[0].c
 * @param param 参数
 * @param record 属性值对象
 * @param dv 属性值的默认值
 * @returns {*}
 */
function getMultiLevelDefaultValue(ele, param, record, dv) {
  let res = dv;
  if (record && record.appCode) {
    const arr = param.split(".");
    let root = arr[0];
    for (let i = 1; i < arr.length; i += 1) {
      const pro = arr[i];
      // 如果是集合先判断对象是否有值，例如要获取a.b[0]，先要判断a.b是否存在
      if (pro.indexOf("[") > 0) {
        const p = `${root}.${pro.split("[")[0]}`;
        res = eval(p);
        if (res === undefined) {
          return parseForDate(ele, dv);
        }
      }
      root = `${root}.${pro}`;
      res = eval(root);
      if (res === undefined) {
        return parseForDate(ele, dv);
      }
    }
  }
  return parseForDate(ele, res);
}

/**
 * 如果是时间类型，那么回显时必须转成DatePicker -> moment对象或是RangePicker -> moment[]
 * @param ele
 * @param res
 */
function parseForDate(ele, res) {
  if (res && ele.typePro === "date") {
    if (ele.timeFormatType === 1) {
      let arr = [];
      if (Array.isArray(res)) {
        arr = res.map(val => moment(val));
      }
      return arr;
    }
    return moment(res);
  }
  // 如果元素是checkbox类型，那么默认值必须是数组
  if (res && ele.typePro === "checkbox") {
    if (!Array.isArray(res)) {
      return res.toString().split(",");
    }
    return res;
  }
  // 当是下拉菜单时处理labelInValue属性值
  if (ele.typePro === "select") {
    if (ele.labelInValuePro && ele.labelInValuePro === 1) {
      if (res && typeof res === "object" ) {
        return res;
      }else{
        return {key:'', label:''};
      }
    }
  }
  return res ? res.toString() : res;
}


/**
 * 解析单个元素
 */
export function getSingleFormItem(ele, childrenList, getFieldDecorator, appFlag, record, templateCode) {
  let eventName = "moduleHandler";
  if (record && record.eventNameSuffix) {
    eventName = `moduleHandler_${record.eventNameSuffix}`;
  }
  const {Group: RadioGroup} = Radio;
  const {Group: CheckboxGroup} = Checkbox;
  const enableEditorPro = ele.enableEditorPro === 0;
  const {RangePicker} = DatePicker;
  const eleKey = `ELE_${ele.uuid}_${ele.dependsModulePro}`;
  if (ele.typePro === "input") {
    // 解析输入框
    return (<Input key={eleKey} disabled={enableEditorPro} placeholder={ele.placeholderPro} />);
  } else if (ele.typePro === "text") {
    // 解析text
    return (<TextArea  key={eleKey} disabled={enableEditorPro} placeholder={ele.placeholderPro} autosize={{minRows: 2, maxRows: 6}} />);
  } else if (ele.typePro === "select") {
    // 解析select
    if (ele.labelInValuePro && ele.labelInValuePro === 1) {
      const op = createOptions(ele);
      return (<Select key={eleKey} disabled={enableEditorPro} placeholder={ele.placeholderPro} labelInValue >{op}</Select>);
    }
    return (<Select  key={eleKey} disabled={enableEditorPro} placeholder={ele.placeholderPro} >{createOptions(ele)}</Select>);
  } else if (ele.typePro === "radio") {
    // 解析radio
    return (<RadioGroup  key={eleKey} disabled={enableEditorPro}>{createOptions(ele)}</RadioGroup>);
  } else if (ele.typePro === "checkbox") {
    // 解析checkbox
    return (<CheckboxGroup  key={eleKey} disabled={enableEditorPro} options={createOptions(ele)} />);
  } else if (ele.typePro === "date") {
    let dataEle;
    // 解析date
    if (ele.timeFormatType === 1) {
      // 时间段格式
      dataEle = (<RangePicker  key={eleKey} disabled={enableEditorPro} format={ele.timeFormatPro} showTime />);
    } else {
      dataEle = ele.timeFormatPro === "HH:mm:ss" ? (<TimePicker disabled={enableEditorPro} format={ele.timeFormatPro} />) : (
        <DatePicker disabled={enableEditorPro} showTime format={ele.timeFormatPro} />);
    }
    return (dataEle);
  } else if (ele.typePro === "file") {
    // 解析file
    const fileKey = `FILE_DIV_${ele.uuid}`;
    return (
      <div key={fileKey}>
        <Upload>
          <Button><Icon type="upload" />模块开发中,傻眼了吧!</Button>
        </Upload>
      </div>
    );
  } else if (ele.typePro === "module") {
    const children = doElementParseByRow(childrenList.filter(item => item.dependsModulePro === ele.uuid), childrenList, getFieldDecorator, appFlag, record, templateCode);
    const labelProName = ele.labelPro ? ele.labelPro : "";
    let titleName = `${ele.modulePro}-${labelProName}`;
    if (appFlag) {
      titleName = labelProName;
    }
    // 解析模块组件
    const btnsKey = `BTNS_DIV_${ele.uuid}`;
    const btnsParentKey = `BTNS_PARENT_DIV_${ele.uuid}`;
    const colKey = `COL_PARENT_KEY_${ele.uuid}`;
    const cardKey = `CARD_PARENT_KEY_${ele.uuid}`;
    const cardBtnKey = `CARD_BTN_KEY_${ele.uuid}`;
    const rowKey = `ROW_KEY_${ele.uuid}`;

    const withButtons = ele.btnsPro === 1 ? (
      <div key={btnsKey}>
        <Col key={colKey} span={23}><Card key={cardKey} extra={getCardExtra(appFlag, ele)} title={titleName}>{children}</Card></Col>
        <Col key={cardBtnKey} span={1}>
          <Button icon="plus" onClick={() => {emitter.emit(eventName, ele, "add")}} />
          <Button icon="delete" onClick={() => {emitter.emit(eventName, ele, "del")}} />
        </Col>
      </div>
    ) : (<div key={btnsKey}><Col key={colKey}><Card key={cardKey} extra={getCardExtra(appFlag, ele)} title={titleName}>{children}</Card></Col></div>);
    return (
      <div key={btnsParentKey}>
        <Row key={rowKey}>
          {withButtons}
        </Row>
      </div>
    );
  }
  const notFoundKey = `NOT_FOUND_SINGLE_DIV_${ele.uuid}`;
  return (<div key={notFoundKey} />);
}

function getCardExtra(appFlag, ele) {
  if (!appFlag) {
    return (<a onDoubleClick={() => {emitter.emit("operaElementConfirm", ele, true)}}>More</a>);
  }
  return undefined;
}

/**
 * 将表单解析为请求的参数
 * @param param
 * @returns {{cp: *, bp: *}}
 */
export function getReqParam(param) {
  const paramArr = Object.entries(param);
  const baseParam = arrToObject(paramArr.filter( arr => arr[0] === "id" ||
    arr[0] === "appCode" ||
    arr[0] === "msg" ||
    arr[0] === "productCode" ||
    arr[0] === "productName" ||
    arr[0] === "systemCode" ||
    arr[0] === "systemName" ||
    arr[0] === "templateCode" ||
    arr[0] === "templateName"
  ));
  const contentParam = arrToObject(paramArr.filter( arr => arr[0] !== "id" &&
    arr[0] !== "appCode" &&
    arr[0] !== "msg" &&
    arr[0] !== "productCode" &&
    arr[0] !== "productName" &&
    arr[0] !== "systemCode" &&
    arr[0] !== "systemName" &&
    arr[0] !== "templateCode" &&
    arr[0] !== "templateName"
  ));
  // return {bp: baseParam, cp: contentParam};
  let content = JSON.stringify(contentParam);
  content = content.replace(/:null/g, ":\"\"").replace(/,null/g, "").replace(/null,/g, "");
  return {bp: baseParam, cp: content};
}

/**
 * 将参数对应的模板类型的模块封装成content内容
 */
export function getReqTemplateParam(param, templates) {
  const res = [];
  const pros = Object.entries(param);
  res.push(...pros.filter(item => templates.filter(k => k === item[0]).length <= 0));
  // res.push(["content", JSON.stringify(Object.fromEntries(pros.filter(item => templates.filter(k => k === item[0]).length > 0)))]);
  // return Object.fromEntries(res);
  let content = JSON.stringify(arrToObject(pros.filter(item => templates.filter(k => k === item[0]).length > 0)));
  content = content.replace(/:null/g, ":\"\"").replace(/,null/g, "").replace(/null,/g, "");
  res.push(["content", content]);
  return arrToObject(res);
}

/**
 * 复制、删除模块
 * @param attParam 当前使用的模板
 * @param operaParam 添加|删除
 * @param elementParam 当前模块元素信息
 * @returns {*}
 */
export function moduleHandler(attParam, operaParam, elementParam) {
  const att = attParam;
  const opera = operaParam;
  // 当前模块元素信息
  const element = deepCopy(elementParam);
  const moduleChildren = [];
  let currModuleChildren = [];
  if (opera === "add") {
    // 查找元素位置
    // let index=0;
    // att.contentList.forEach((val, i) => {
    //   if(val.uuid === elementParam.uuid){
    //     index = i;
    //   }
    // });

    currModuleChildren = att.contentList.filter(item => item.dependsModulePro === element.uuid);
    element.uuid = uuid();
    Object.assign(element, {"isNewEle": 1});
    // 获取模块的行号
    const rowProArr = [...new Set(att.contentList.filter(item => item.modulePro && item.modulePro === element.modulePro).map(({rowPro: rp}) => rp))].sort((a, b) => a-b);
    // 新模块行号+1
    element.rowPro = rowProArr.pop() + 1;
    // 通过哪个添加模块就在哪个元素下面添加新的模块
    // element.rowPro = elementParam.rowPro + 1;
    att.contentList.filter(item => item.modulePro && item.modulePro === element.modulePro).forEach(item => {
      if (item.rowPro >= element.rowPro) {
        Object.assign(item, {rowPro: item.rowPro + 1});
        // 如果是当前操作过程中新增加的元素
        if (item.isNewEle === 1) {
          // 替换子节点索引值
          att.contentList.filter(c => c.dependsModulePro === item.uuid).forEach(t => {
            // 替换数组索引
            const reg = `/${item.modulePro}\\[[\\d]+\\]+/`;
            const realNameProVal = t.realNamePro.replace(eval(reg), `${item.modulePro}[${item.rowPro}]`);
            Object.assign(t, {realNamePro: realNameProVal});
          });
        }
      }
    });
    currModuleChildren.forEach((o) => {
      // 重置依赖关系、uuid、属性名称
      const tmp = deepCopy(o);
      tmp.dependsModulePro = element.uuid;
      tmp.uuid = uuid();
      if (element.btnsPro) {
        // 替换数组索引
        const reg = `/${element.modulePro}\\[[\\d]+\\]+/`;
        tmp.realNamePro = tmp.realNamePro.replace(eval(reg), `${element.modulePro}[${element.rowPro}]`);
      }
      moduleChildren.push(tmp);
      moduleChildren.slice();
    });
    att.contentList.push(element);
    // att.contentList.splice(index+1, 0, element);
    att.contentList.push(...moduleChildren);
  }else{
    const l = att.contentList.filter(item => item.modulePro === element.modulePro).length;
    if (l === 1) {
      message.error("已经是最后一个模块，不允许删除");
    }else{
      att.contentList = att.contentList.filter(item => item.uuid !== element.uuid);
      att.contentList = att.contentList.filter(item => item.dependsModulePro !== element.uuid);
    }
  }
  return att;
}

/**
 * 递归查询业务数据中的所有modulePro
 */
export function recursiveModulesList(arr, data, dependsModulePro) {
  Object.keys(data).forEach(item => {
    const obj = data[item];
    if(Array.isArray(obj)){
      obj.forEach((e, i) => {
        // 过滤掉checkbox属性元素
        if (typeof e !== 'object' && !Array.isArray(e)) {
          return;
        }
        const m = {uuidPro: uuid(), modulePro: item, children:[], dmp: dependsModulePro, index: i};
        arr.push(m);
        recursiveModulesList(arr, e, m.uuidPro);
      });
    }
  });
}

/**
 * 业务数据对应的模块封装
 * @param attParam 原始模板
 * @param modules 模板中的module元素，且module是集合而非单独子对象
 * @returns {*}
 */
export function moduleDataHandler(attParam, modules) {
  const att = attParam;
  const baseContentList = deepCopy(att.contentList);
  // 清空所有集合模块及子节点
  const dstContentList = deepCopy(att.contentList.filter(item => !(item.typePro === "module" && item.btnsPro === 1)).filter(item => !item.dependsModulePro));
  modules.forEach((a) =>{
    const element = deepCopy(baseContentList.filter(b => b.modulePro === a.modulePro).pop());
    const moduleChildren = [];
    const currModuleChildren = deepCopy(baseContentList.filter(item => item.dependsModulePro === element.uuid));
    element.uuid = a.uuidPro;
    element.dependsModulePro = a.dependsModulePro;
    // 获取模块的行号
    // const rowProArr = [...new Set(baseContentList.filter(item => item.modulePro).map(({rowPro: rp}) => rp))].sort((m, n) => m >= n ? 1: 0);
    // 新模块行号+1
    // element.rowPro = rowProArr.pop() + a.index;
    Object.assign(element, {rowPro: element.rowPro + a.index});
    currModuleChildren.forEach((o) => {
      // 重置依赖关系、uuid、属性名称
      const tmp = deepCopy(o);
      tmp.dependsModulePro = element.uuid;
      tmp.uuid = uuid();
      if (element.btnsPro) {
        // 替换数组索引
        const reg = `/${element.modulePro}\\[[\\d]+\\]+/`;
        tmp.realNamePro = tmp.realNamePro.replace(eval(reg), `${element.modulePro}[${a.index}]`);
      }
      moduleChildren.push(tmp);
    });
    dstContentList.push(element);
    dstContentList.push(...moduleChildren);
  });

  // 没有数据的模板还要回添回去，用于解决当配置数据后又更新了模板，并新增加了元素，如果不回填回去，那更新旧数据时将
  // 不显示新增加的模板元素
  baseContentList.forEach(item => {
    if(item.typePro === "module" && dstContentList.filter(d => d.modulePro === item.modulePro).length === 0){
      dstContentList.push(item);
    }else if(dstContentList.filter(d => d.namePro === item.namePro).length === 0){
      dstContentList.push(item);
    }
  });
  att.contentList = dstContentList;
  return att;
}




import {Select} from "antd";
import React from "react";
import {uuid} from "./commonUtils";

/**
 * 初始化Option
 * @param data 数据集合
 * @param withKey 描述中是否包含key
 * @returns {*}
 */
export function initOptions(data, withKey=false){
  const empty = <Select.Option key="" value="" />;
  if (data) {
    if (withKey) {
      return data.map(({code : c, desc : d}) => {
        const desc = `${c}-${d}`;
        return <Select.Option key={c} value={c}>{desc}</Select.Option>
      })
    }
    return data.map(({code : c, desc : d}) => <Select.Option key={c} value={c}>{d}</Select.Option>);
  }
  return empty;
}

/**
 * 初始化option
 * @param data 数据集合
 * @param codeKey 集合中的列表的key
 * @returns {*}
 */
export function initOptionsByCodeKey(data, codeKey){
  const empty = <Select.Option key="" value="" />;
  if (codeKey && data && codeKey in data) {
    const cv = data[codeKey];
    return cv.map(({code : c, desc : d}) => <Select.Option key={c} value={c}>{d}</Select.Option>);
  }
  return empty;
}

export function initDom() {
  return {
    uuid: uuid(),
    typePro: "input",
    labelPro: undefined,
    namePro: undefined,
    realNamePro: undefined,
    timeFormatPro: "YYYY/MM/DD HH:mm:ss",
    timeFormatType: 0,
    dataPro: undefined,
    optionsPro: undefined,
    requiredPro: 0,
    messagePro:'',
    hiddenPro: 0,
    enableEditorPro: 1,
    placeholderPro: undefined,
    rowPro: 1,
    colPro: 1,
    colSumPro: 1,
    defaultValuePro: undefined,
    modulePro: '',
    dependsModulePro: '',
    btnsPro: 0,
    itemColumnPro:'',
    labelInValuePro: 0,
  };
}
export function types(){
  return [
    {code: "input", desc: "输入框"},
    {code: "text", desc: "多行输入框"},
    {code: "select", desc: "下拉菜单"},
    {code: "radio", desc: "单选按钮"},
    {code: "checkbox", desc: "复选框"},
    {code: "date", desc: "时间"},
    {code: "file", desc: "文件"},
    {code: "module", desc: "模块"},
    ];
}

export function itemsColumns() {
  return [
    {code: "", desc: "无"},
    {code: "item_one", desc: "条件列1"},
    {code: "item_two", desc: "条件列2"},
    {code: "item_three", desc: "条件列3"},
    {code: "item_four", desc: "条件列4"},
    {code: "item_five", desc: "条件列5"},
  ];
}

export function dateFormatts(){
  return [
    {code: "YYYY/MM/DD HH:mm:ss", desc: "YYYY/MM/DD HH:mm:ss"},
    {code: "YYYY/MM/DD", desc: "YYYY/MM/DD"},
    {code: "HH:mm:ss", desc: "HH:mm:ss"},
  ];
}

/**
 * 客户产品 开通状态
 * @returns {{code: string, desc: string}[]}
 */
export function openStauses(){
  return [
    {code: "10", desc: "开通"},
  ];
}

/**
 * 加载依赖链
 */
export function getDependsChain(dependsModulePro, elements) {
  const dps = elements.filter(item => item.uuid === dependsModulePro).pop();
  let prefix = {p:"", pt:""};
  if (dps.dependsModulePro) {
    prefix = getDependsChain(dps.dependsModulePro, elements);
  }
  let suffix = `${dps.modulePro}`;
  if (dps.btnsPro === 1) {
    suffix = `${dps.modulePro}[0]`;
  }
  return {p:`${prefix.p}${suffix}.`, pt:`${prefix.pt}${suffix}.`};
}






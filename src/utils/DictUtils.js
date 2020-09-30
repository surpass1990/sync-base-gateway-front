import React from "react";
import {Select} from "antd";

const commonData = {};

export const addToDictData = (data) => {
  Object.assign(commonData, data);
};

/**
 * 初始化Option
 * @param data 数据集合
 * @returns {*}
 */
export function initOptions(codeKey){
  const {Option} = Select;
  const empty = <Option key="" value="" />;
  if (codeKey && commonData.hasOwnProperty(codeKey)) {
    const cv = commonData[codeKey];
    const options = cv.map(({code : c, desc : d}) => <Option key={c} value={c}>{d}</Option>);
    return options;
  }
  return empty;
}

export const initSelect = (codeKey) => {
    return (
      <Select placeholder="全部" allowClear>
        {initOptions(codeKey)}
      </Select>
    );
};

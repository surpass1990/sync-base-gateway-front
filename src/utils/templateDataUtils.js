import {Card, Tabs} from "antd";
import React from "react";
import {doElementParse} from "./elementParserUtil";
/**
 * 以瀑布流或是tabs方式动态解析模板
 * @param templatesListSrc 模板结合
 * @param dataList 数据集合
 * @param getFieldDecorator 表单对象
 * @param param 附件参数
 * @param tabsFlag 是否支持tabs
 * @returns {*}
 */
export function renderTemplateAndData(templatesListSrc, dataList, getFieldDecorator, param={}, tabsFlag=true) {
  // 对templatesList进行排序
  const templatesList = templatesListSrc.sort((a, b) => a.templateCode.localeCompare(b.templateCode));
  const { TabPane } = Tabs;
  const {eventNameSuffixValue} = param;

  const formDetailList = [];
  templatesList.forEach(item => {
    let record = {};
    if (dataList) {
      const r = dataList.filter(d => d.templateCode === item.templateCode).pop();
      if (r) {
        record = r;
      }
    }
    Object.assign(record, {eventNameSuffix : eventNameSuffixValue});
    if (tabsFlag) {
      formDetailList.push(
        <TabPane tab={item.templateName} key={item.templateName}>
          {doElementParse(item.contentList, getFieldDecorator, true, record, item.templateCode)}
        </TabPane>
      );
    }else{
      formDetailList.push(
        <Card size="small" title={item.templateName}>
          <div key="myFormDetail">
            {doElementParse(item.contentList, getFieldDecorator, true, record, item.templateCode)}
          </div>
        </Card>
      );
    }
  });
  return tabsFlag ? (<Tabs>{formDetailList}</Tabs>) : (<div key="myFormDetail">{formDetailList}</div>);
}



import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import FormItem from 'antd/es/form/FormItem';
import emitter from "../../../utils/events";
import { addExtread, baseState, doClose } from '../../../utils/commonUtils';

@connect(({ middleModel: { preUpdate, visible, isUpdate, extread } }) => ({ preUpdate, visible, isUpdate, extread }))
@Form.create()
export default class AddOrUpdateModal extends PureComponent {

  state = {
    ...baseState("dbConfig", "WDC配置"),
    initData: {
      type: 1,
      timeStep: 60,
      model: -1,
      pageSize: 1000000,
      refreshDays: 5,
    },
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  addBtn = () => {
    const { form: { validateFieldsAndScroll, resetFields }, dispatch } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: values.cid ? this.state.baseUrl.update : this.state.baseUrl.add,
          payload: values,
          callback: () => {
            doClose(this.props, false, false);
            resetFields();
            emitter.emit(this.state.commons.emitName);
          },
        });
      }
    });
  };

  chgType = (val) => {
    addExtread(this.props, {type: val});
  }

  

  render() {
    // 处理时间少了8小时问题
    moment.fn.toISOString = function () {
      return this.format('YYYY-MM-DD HH:mm:ss');
    }

    const { form: { getFieldDecorator }, visible, isUpdate, preUpdate, extread } = this.props;
    const { Option } = Select;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
    };

    let record = Object.assign({}, this.state.initData);
    
    if(preUpdate) {
      record = Object.assign(record, preUpdate);
    }

    let t = "1";
    if(preUpdate && preUpdate.type){
      t = preUpdate.type;
    }
    if(extread && extread.type){
      t = extread.type;
    }

    console.log(record);

    return (
      <Modal
        title={isUpdate ? this.state.commons.updateTitle : this.state.commons.addTitle}
        visible={visible}
        onOk={this.addBtn}
        onCancel={() => doClose(this.props, false)}
        width="60%"
      >
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="配置标识">
            {
              getFieldDecorator('cid', {
                initialValue: record.cid,
              })(<Input placeholder="配置标识生成" disabled />)}
          </FormItem>

          <FormItem {...formItemLayout} label="数据类型">
            {getFieldDecorator('type', {
              initialValue: String(record.type),
            })(
              <Select placeholder="请选择数据源类型" onChange={this.chgType}>
                <Option value="1">实时数据(测点标识)</Option>
                <Option value="2">实时数据(测点名称)</Option>
                <Option value="3">历史数据(测点名称)</Option>
                <Option value="4">宽表数据</Option>
                <Option value="5">增量数据</Option>
                <Option value="6">增量数据(tableau)</Option>
                {/* <Option value="7">增量数据(js)</Option> */}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="测点标识" hidden={String(t) !== "1"}>
            {
              getFieldDecorator('tagIds', {
                initialValue: record.tagIds,
              })(<Input placeholder="请输入测点标识, 格式例如:0-10,2, 仅【实时数据(测点标识)】时才有效" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="测点名称" >
            {
              getFieldDecorator('tagName', {
                initialValue: record.tagName,
              })(<Input placeholder="请输入测点名称, 多个中间用英文,隔开" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="时间间隔">
            {
              getFieldDecorator('timeStep', {
                initialValue: record.timeStep,
                rules: [{ required: true, message: '时间间隔' }],
              })(<Input placeholder="请输入时间间隔" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="周期时间">
            {
              getFieldDecorator('gapTime', {
                initialValue: record.gapTime,
              })(<Input placeholder="请输入周期时间, 以D或H或M结尾, 不区分大小写" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="开始时间">
            {
              getFieldDecorator('beginTime', {
                initialValue: record.beginTime ? moment(record.beginTime) : null,
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间"
                  style={{ minWidth: '100%' }}
                />
              )
            }
          </FormItem>

          <FormItem {...formItemLayout} label="结束时间"  hidden={String(t) === "5" || String(t) === "6" || String(t) == "7"}>
            {
              getFieldDecorator('endTime', {
                initialValue: record.endTime ? moment(record.endTime) : null,
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="结束时间"
                  style={{ minWidth: '100%' }}
                />
              )
            }
          </FormItem>

          <FormItem {...formItemLayout} label="结果模式">
            {getFieldDecorator('model', {
              initialValue: String(record.model),
            })(
              <Select placeholder="请选择结果模式" >
                <Option value="-1">无</Option>
                <Option value="0">特征值方式</Option>
                <Option value="1">抽样方式</Option>
                <Option value="2">最大值</Option>
                <Option value="3">最小值</Option>
                <Option value="4">平均值</Option>
              </Select>
            )}
          </FormItem>
          {/* <FormItem {...formItemLayout} label="数据条数">
            {
              getFieldDecorator('pageSize', {
                initialValue: record.pageSize,
              })(<Input placeholder="数据条数" />)}
          </FormItem> */}
          <FormItem {...formItemLayout} label="刷新天数" hidden={String(t) !== "6" && String(t) !== "7"}>
            {
              getFieldDecorator('refreshDays', {
                initialValue: record.refreshDays,
              })(<Input placeholder="刷新天数" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="描述信息">
            {
              getFieldDecorator('msg', {
                initialValue: record.msg,
              })(<Input placeholder="描述信息" />)}
          </FormItem>

        </Form>
      </Modal>
    );
  }
}

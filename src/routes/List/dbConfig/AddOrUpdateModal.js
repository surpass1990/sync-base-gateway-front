import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import emitter from "../../../utils/events";
import { baseState, doClose } from '../../../utils/commonUtils';

@connect(({ middleModel: { preUpdate, visible, isUpdate } }) => ({ preUpdate, visible, isUpdate }))
@Form.create()
export default class AddOrUpdateModal extends PureComponent {

  state = {
    ...baseState("dbConfig", "WDC配置"),
    initData: {
      type: 1,
      step: 60,
      model: -1,
    },

    startValue: null,
    endValue: null,
    endOpen: false,
  };


  

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  addBtn = () => {
    const { form: { validateFieldsAndScroll }, dispatch } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: this.state.baseUrl.add,
          payload: values,
          callback: () => {
            doClose(this.props, false, false);
            emitter.emit(this.state.commons.emitName);
          },
        });
      }
    });
  };

  

  render() {
    const { form: { getFieldDecorator }, visible, isUpdate, preUpdate } = this.props;
    const { Option } = Select;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
    };

    let record = Object.assign({}, this.state.initData);
    
    if(preUpdate) {
      record = Object.assign(record, preUpdate);
    }


    return (
      <Modal
        title={isUpdate ? this.state.commons.updateTitle : this.state.commons.addTitle}
        visible={visible}
        onOk={this.addBtn}
        onCancel={() => doClose(this.props, false)}
        width="60%"
      >
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="WDC标识">
            {
              getFieldDecorator('cid', {
                initialValue: record.cid,
                rules: [{ required: true, message: 'WDC标识不能为空' }],
              })(<Input placeholder="请输入WDC标识" disabled={isUpdate} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="数据类型">
            {getFieldDecorator('type', {
              initialValue: String(record.type),
            })(
              <Select placeholder="请选择数据源类型" >
                <Option value="1">实时数据(测点标识)</Option>
                <Option value="2">实时数据(测点名称)</Option>
                <Option value="3">历史数据(测点名称)</Option>
                <Option value="4">宽表数据</Option>
                <Option value="5">增量数据</Option>
                <Option value="6">增量数据(tableau)</Option>
                <Option value="7">增量数据(js)</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="测点标识">
            {
              getFieldDecorator('tagIds', {
                initialValue: record.tagIds,
              })(<Input placeholder="请输入测点标识, 格式例如:0-10,2" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="测点名称">
            {
              getFieldDecorator('tagName', {
                initialValue: record.tagName,
              })(<Input placeholder="请输入测点名称, 多个中间用英文,隔开" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="时间间隔">
            {
              getFieldDecorator('step', {
                initialValue: record.step,
                rules: [{ required: true, message: '时间间隔' }],
              })(<Input placeholder="请输入时间间隔" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="周期时间">
            {
              getFieldDecorator('gapTime', {
                initialValue: record.gapTime,
                rules: [{ required: true, message: '周期时间' }],
              })(<Input placeholder="请输入周期时间, 以D或H或M结尾, 不区分大小写" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="时间范围">
            {
              getFieldDecorator('startTime', {
                initialValue: record.startTime,
              })(
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  value={this.state.startValue}
                  placeholder="Start"
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                  style={{ minWidth: '100%' }}
                />
              )
            }
          </FormItem>

          <FormItem {...formItemLayout} label="时间范围">
            {
              getFieldDecorator('endTime', {
                initialValue: record.endTime,
              })(
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  value={this.state.endValue}
                  placeholder="End"
                  onChange={this.onEndChange}
                  open={this.state.endOpen}
                  onOpenChange={this.handleEndOpenChange}
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

        </Form>
      </Modal>
    );
  }
}

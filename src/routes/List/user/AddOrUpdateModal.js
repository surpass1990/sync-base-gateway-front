import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Form, Input, Modal, Select} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import emitter from "../../../utils/events";
import { baseState, doClose } from '../../../utils/commonUtils';

@connect(({ middleModel: { preUpdate, visible, isUpdate } }) => ({ preUpdate, visible, isUpdate }))
@Form.create()
export default class AddOrUpdateModal extends PureComponent {

  state = {
    ...baseState("userConfig", "用户"),
    initData: {
      admin: 0,
    },
  };

  addBtn = () => {
    const { form: { validateFieldsAndScroll }, dispatch } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: this.state.baseUrl.add,
          payload: values,
          callback: () => {
            doClose(this.props, false);
            emitter.emit(this.state.commons.emitName);
          },
        });
      }
    });
  };


  updateBtn = () => {
    const { form: { validateFieldsAndScroll }, dispatch } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: this.state.baseUrl.add,
          payload: values,
          callback: () => {
            doClose(this.props, false);
            emitter.emit(this.state.commons.emitName);
          },
        });
      }
    });
  };


  render() {
    const { form: { getFieldDecorator }, visible, preUpdate, isUpdate} = this.props;
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
        onOk={isUpdate ? this.updateBtn : this.addBtn}
        onCancel={() => doClose(this.props, false)}
      >
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="用户标识">
            {
              getFieldDecorator('userName', {
                initialValue: record.userName,
                rules: [{ required: true, message: '用户标识不能为空' }],
              })(<Input placeholder="请输入用户标识" disabled={isUpdate} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              initialValue: record.email,
            })(<Input placeholder="请输入邮箱" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="联系方式">
            {getFieldDecorator('tel', {
              initialValue: record.tel,
            })(<Input placeholder="请输入联系方式" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员">
            {getFieldDecorator('admin', {
              initialValue: record.admin,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select placeholder="请选择" >
                <Option value={String(0)}>否</Option>
                <Option value={String(1)}>是</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

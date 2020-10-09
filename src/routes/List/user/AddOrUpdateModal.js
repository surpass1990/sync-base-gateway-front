import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Form, Input, Modal, Select} from 'antd';
import FormItem from 'antd/es/form/FormItem';

@connect()
export default class AddOrUpdateModal extends PureComponent {

  render() {
    const { form: { getFieldDecorator, getFieldValue }, title, visible, update, onOk, onCancel } = this.props;
    const { Option } = Select;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
    };
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="用户标识">
            {update ? getFieldValue('userName') :
              getFieldDecorator('userName', {
                rules: [{ required: true, message: '用户标识不能为空' }],
              })(<Input placeholder="请输入用户标识" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="邮箱">
            {getFieldDecorator('email')(<Input placeholder="请输入邮箱" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="联系方式">
            {getFieldDecorator('tel')(<Input placeholder="请输入联系方式" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员">
            {getFieldDecorator('admin', {
              initialValue: 0,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select placeholder="请选择" >
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

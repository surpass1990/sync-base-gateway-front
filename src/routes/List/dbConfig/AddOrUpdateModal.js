import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

@connect()
export default class AddOrUpdateModal extends PureComponent {

  render() {
    const { form: { getFieldDecorator, getFieldValue }, title, visible, update, onOk, onCancel, systemTypes } = this.props;
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
          {getFieldDecorator('id')(<Input type="hidden" />)}
          {getFieldDecorator('systemCode')(<Input type="hidden" />)}

          <FormItem {...formItemLayout} label="系统编码">
            {update ? getFieldValue('systemCode') :
              getFieldDecorator('systemCode', {
                rules: [{ required: true, message: '系统编码不能为空' }],
              })(<Input placeholder="请输入" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="系统名称">
            {getFieldDecorator('systemName', {
              rules: [{ required: true, message: '系统名称不能为空' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="系统类型">
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '系统类型不能为空' }],
            })(
              <Select placeholder="请选择" >
                <Option value={-1}>无</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="系统描述">
            {getFieldDecorator('msg')(<TextArea placeholder="请输入" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

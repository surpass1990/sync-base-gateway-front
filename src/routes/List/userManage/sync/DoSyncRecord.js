import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Upload} from 'antd';
import moment from 'moment';
import FormItem from "antd/es/form/FormItem";
import {baseState} from '../../../../utils/commonUtils';

@connect(({ global: { enums, enums: {userTypes}, dictEnums } }) => ({enums, userTypes, dictEnums }))
@Form.create()
export default class DoSyncRecord extends PureComponent {

  state = baseState("syncRecord", "同步用户信息");

  handleClick = () => {
    const { form: { validateFieldsAndScroll,getFieldValue }, dispatch } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const syncStartTimeTmp = getFieldValue("syncStartTime");
        if (syncStartTimeTmp) {
          Object.assign(values, {syncStartTime: syncStartTimeTmp.format("YYYY-MM-DD HH:mm:ss")});
        }
        const syncEndTimeTmp = getFieldValue("syncEndTime");
        if (syncEndTimeTmp) {
          Object.assign(values, {syncEndTime: syncEndTimeTmp.format("YYYY-MM-DD HH:mm:ss")});
        }
        dispatch({
          type: "syncRecord/doSync",
          payload: values,
        });
      }
    });
  };

  handleReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
  };

  render() {
    const { form: { getFieldDecorator,getFieldValue } } = this.props;
    const {Option} = Select;

    const props = {
      name: 'file',
      action: '/admin/sync/doSyncFile',
      headers: {
        authorization: 'authorization-text',
      },
      data:{productCode: getFieldValue("productCode"), type:"0", userType: getFieldValue("userType")},
      onChange(info) {
        if (info.file.status === 'done') {
          message.success(`${info.file.response.message}`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name}上传失败`);
        }
      },
    };
    return (
      <Card>
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="用户类型">
                {getFieldDecorator('userType', {
                  initialValue: "2",
                })(
                  <Select>
                    <Option value="1">用户</Option>
                    <Option value="2">客户</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="同步标识">
                {getFieldDecorator('productCode', {
                  rules: [{required: true, message: '同步标识'}],
                })(<Input placeholder="可以是产品编码" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="用户编码">
                {getFieldDecorator('userCode')(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="创建时间">
                {getFieldDecorator('syncStartTime')(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)}
                ～
                {getFieldDecorator('syncEndTime')(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)}
              </FormItem>
            </Col>
          </Row>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" onClick={this.handleClick} icon="play-circle" size="small">开始</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset} icon="redo" size="small">重置</Button>&nbsp;
              <Upload {...props}><Button icon="upload" type="primary" size="small">文件同步</Button></Upload>
            </span>
          </div>
        </Form>
      </Card>
    );
  }
}

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button, Col, Form, Input, Row} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import {baseState, initSelect} from '../../../../utils/commonUtils';
import emitter from "../../../../utils/events";

@connect(({ global: { enums, enums: {userTypes}, dictEnums } }) => ({enums, userTypes, dictEnums }))
@Form.create()
export default class SearchForm extends PureComponent {

  state = baseState("syncRecord", "同步用户信息");

  componentDidMount() {
    emitter.on(this.state.commons.emitName, (pagination) => {
      this._handleSubmit(pagination);
    });
    this._handleSubmit();
  }

  componentWillUnmount() {
    emitter.removeAllListeners();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this._handleSubmit();
  };

  _handleSubmit = ({ current, pageSize } = {}) => {
    const { form: { validateFields }, dispatch } = this.props;
    validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: this.state.baseUrl.list,
          payload: {
            pageCond: { current, pageSize},
            ...fieldsValue,
          },
        });
      }
    });
  };

  handleReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this._handleSubmit();
  };

  render() {
    const { form: { getFieldDecorator }, dictEnums } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="用户ID">
              {getFieldDecorator('userId')(<Input />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="用户编码">
              {getFieldDecorator('userCode')(<Input />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="操作用户">
              {getFieldDecorator('operateUser')(<Input />)}
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit" icon="search" size="small">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset} size="small">重置</Button>
          </span>
        </div>
      </Form>
    );
  }
}

import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button, Col, Form, Input, Row} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import emitter from "../../../utils/events";
import {baseState} from "../../../utils/commonUtils";

@connect(({ userConfig: { systems } }) => ({ systems }))
@Form.create()
export default class SearchForm extends PureComponent {

  state = baseState("userConfig", "用户") || {};

  componentDidMount() {
    const { dispatch } = this.props;

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
    const { form: { getFieldDecorator }, systems, size} = this.props;
    const systemOptions = systems.map(({systemCode: b, systemName: n}) => ({code:b, desc:n}));
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户标识">
              {getFieldDecorator('userName')(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit" icon="search" size={size ? `${size}` : 'default'}>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset} size={size ? `${size}` : 'default'}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }
}

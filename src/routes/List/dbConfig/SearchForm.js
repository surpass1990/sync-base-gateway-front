import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button, Col, Form, Input, Row, Select} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import emitter from "../../../utils/events";
import {baseState} from "../../../utils/commonUtils";

@connect()
@Form.create()
export default class SearchForm extends PureComponent {

  state = baseState("dbConfig", "WDC配置") || {};

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
    const { form: { getFieldDecorator }, size} = this.props;
    const { Option } = Select;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="配置标识">
              {getFieldDecorator('cid')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="测点名称">
              {getFieldDecorator('tagName')(<Input />)}
            </FormItem>
          </Col>   
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type', )(
                <Select placeholder="请选择数据源类型" >
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
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="创建人">
              {getFieldDecorator('createUser')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="操作人">
              {getFieldDecorator('updateUser')(<Input />)}
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

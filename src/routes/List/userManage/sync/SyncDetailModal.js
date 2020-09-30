import React, {PureComponent} from 'react';
import {connect} from 'dva';
import FormItem from "antd/es/form/FormItem";
import {Button, Col, Form, Input, Modal, Row, Table} from 'antd';
import {baseState, initSelect, renderEnumsByType} from "../../../../utils/commonUtils";
import emitter from "../../../../utils/events";

@connect(({global: {enums, dictEnums, systems, products}, syncRecord: { viewModal:{visible, oldRecord}, userDetail}}) => ({enums, dictEnums, visible, oldRecord, userDetail, systems, products}))
@Form.create()
export default class SyncDetailModal extends PureComponent {

  state = baseState("syncRecord", "用户信息");

  componentDidMount() {
    emitter.on("syncRecord/syncRecordDetail", (pagination) => {
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
    const { form: { validateFields }, dispatch, oldRecord } = this.props;
    validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: "syncRecord/findSyncDetail",
          payload: {
            pageCond: { current, pageSize},
            ...fieldsValue,
          },
        });
      }
    });
  };
  render() {
    const { data, pagination, loading, form: {getFieldDecorator}, dictEnums, visible } = this.props;
    const columns = [
      {
        title: '用户ID',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '用户编码',
        dataIndex: 'userCode',
        key: 'userCode',
      },
      {
        title: '同步状态',
        dataIndex: 'status',
        key: 'status',
        render: val => <span>{renderEnumsByType(dictEnums, "200120", val)}</span>,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      ...pagination,
    };

    // 渲染信息
    return (
      <Modal
        title={this.state.commons.viewTitle}
        visible={visible}
        onCancel={this.handleCancel}
        width="1200px"
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <FormItem label="用户编码">
                {getFieldDecorator('userCode')(<Input />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="同步状态">
                {getFieldDecorator('status')(initSelect(dictEnums,"200120"))}
              </FormItem>
            </Col>
          </Row>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit" icon="search" size="small">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset} icon="redo" size="small">重置</Button>
            </span>
          </div>
        </Form>
        <div >
          <Table
            loading={loading}
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={{...paginationProps, showTotal: (total) => { return `共${total}条记录`; }}}
            onChange={this.handleChange}
            size="small"
          />
        </div>
      </Modal>
    );
  }
};

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button } from 'antd';
import emitter from "../../../../utils/events";

import UpdateSystemConfigForm from './UpdateData';
import {baseState} from "../../../../utils/commonUtils";

@connect(({ global: {enums : { systemTypes }}, systemConfig: { table: { data, pagination } }, loading: { models: { systemConfig } } }) => ({ data, pagination, loading: systemConfig, systemTypes }))
export default class DataTable extends PureComponent {

  state = baseState("systemConfig", "系统") || {};

  handleChange = (pagination) => {
    emitter.emit(this.state.commons.emitName, pagination);
  };

  handleClick = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: this.state.baseUrl.displayUpdate,
      payload: true,
    });
    dispatch({
      type: this.state.baseUrl.bindOldRecord,
      payload: record,
    });
  };

  render() {
    const { data, pagination, loading, systemTypes } = this.props;
    const systemTypesMap = new Map(systemTypes.map(({ code, desc }) => [code, desc]));
    const columns = [
      {
        title: '用户标识',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '联系方式',
        dataIndex: 'tel',
        key: 'tel',
      },
      {
        title: '管理员',
        dataIndex: 'admin',
        key: 'admin',
        render: val => val === '1' ? '是' : '否',
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
          <div>
            <Button type="primary" ghost size="small" icon="edit" onClick={() => this.handleClick(record)}>编辑</Button>
          </div>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      ...pagination,
    };

    return (
      <div >
        <Table
          loading={loading}
          rowKey="id"
          dataSource={data}
          columns={columns}
          pagination={false}
          onChange={this.handleChange}
          size="small"
        />
        <UpdateSystemConfigForm />
      </div>
    );
  }
}

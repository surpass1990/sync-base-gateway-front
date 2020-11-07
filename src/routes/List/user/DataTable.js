import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button } from 'antd';
import emitter from "../../../utils/events";
import {baseState, bindOldRecord, doClose} from "../../../utils/commonUtils";

@connect(({ userConfig: { table: { data } } }) => ({ data }))
export default class DataTable extends PureComponent {

  state = baseState("userConfig", "用户") || {};

  handleChange = (pagination) => {
    emitter.emit(this.state.commons.emitName, pagination);
  };

  handleClick = (record) => {
    doClose(this.props, true, true);
    bindOldRecord(this.props, record);
  };

  render() {
    const { data, loading } = this.props;
    const columns = [
      {
        title: '登录ID',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '管理员',
        dataIndex: 'admin',
        key: 'admin',
        render: val => val === '0' ? '否' : '是',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: val => val === '0' ? '禁用' : '启用',
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
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : "-"}</span>,
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

    return (
      <div >
        <Table
          loading={loading}
          rowKey="userName"
          dataSource={data}
          columns={columns}
          pagination={false}
          onChange={this.handleChange}
          size="small"
        />
      </div>
    );
  }
}

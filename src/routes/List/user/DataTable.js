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

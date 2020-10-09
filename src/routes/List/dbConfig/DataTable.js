import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Button } from 'antd';
import emitter from "../../../utils/events";

import UpdateSystemConfigForm from './UpdateData';
import {baseState} from "../../../utils/commonUtils";

@connect(({ dbConfig: { table: { data, pagination } } }) => ({ data, pagination }))
export default class DataTable extends PureComponent {

  state = baseState("dbConfig", "WDC配置") || {};

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
    const { data, loading } = this.props;
    const columns = [
      {
        title: '标识',
        dataIndex: 'cid',
        key: 'cid',
      },
      {
        title: '测点',
        dataIndex: 'tagId',
        key: 'tagId',
      },
      {
        title: '测点集合',
        dataIndex: 'tagIds',
        key: 'tagIds',
      },
      {
        title: '测点名称',
        dataIndex: 'tagName',
        key: 'tagName',
        render: val => val === '1' ? '是' : '否',
      },
      {
        title: '开始时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
        render: val => val === '1' ? '是' : '否',
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: val => val === '1' ? '是' : '否',
      },
      {
        title: '时间间隔',
        dataIndex: 'gapTime',
        key: 'gapTime',
      },
      {
        title: '步长',
        dataIndex: 'step',
        key: 'step',
      },
      {
        title: '模式',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '拥有者',
        dataIndex: 'userName',
        key: 'userName',
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

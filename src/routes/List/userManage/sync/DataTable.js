import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Table} from 'antd';
import emitter from '../../../../utils/events';
import {baseState, formatDate, renderEnumsByType} from '../../../../utils/commonUtils';
import SyncDetailModal from "./SyncDetailModal";


@connect(({ global: { enums, dictEnums }, syncRecord: { table: { data, pagination } }, loading: { models: { syncRecord } } }) =>
  ({ enums, dictEnums, data, pagination, loading: syncRecord }))
export default class DataTable extends PureComponent {

  state = baseState("syncRecord", "同步用户信息");

  handleChange = (pagination) => {
    emitter.emit(this.state.commons.emitName, pagination);
  };

  handleClick = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: this.state.baseUrl.displayView,
      payload: true,
    });
    dispatch({
      type: this.state.baseUrl.bindOldRecord,
      payload: record,
    });
  };

  render() {
    const { data, pagination, loading, dictEnums } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'syncNo',
        key: 'syncNo',
      },
      {
        title: '产品编码',
        dataIndex: 'productCode',
        key: 'productCode',
      },
      {
        title: '用户编码',
        dataIndex: 'userCode',
        key: 'userCode',
      },
      {
        title: '同步类型',
        dataIndex: 'type',
        key: 'type',
        render: val => <span>{renderEnumsByType(dictEnums, "200110", val)}</span>,
      },
      {
        title: '同步开始时间',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: val => <span>{ formatDate(val, 'YYYY-MM-DD HH:mm:ss') }</span>,
      },
      {
        title: '同步结束时间',
        dataIndex: 'modifiedDate',
        key: 'modifiedDate',
        render: val => <span>{ formatDate(val, 'YYYY-MM-DD HH:mm:ss') }</span>,
      },
      {
        title: '同步状态',
        dataIndex: 'status',
        key: 'status',
        render: val => <span>{renderEnumsByType(dictEnums, "200120", val)}</span>,
      },
      {
        title: '同步总条数',
        dataIndex: 'total',
        key: 'total',
      },
      {
        title: '同步完成条数',
        dataIndex: 'finishTotal',
        key: 'finishTotal',
      },
      {
        title: '条件开始时间',
        dataIndex: 'syncStartTime',
        key: 'syncStartTime',
        render: val => <span>{formatDate(val, 'YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '条件结束时间',
        dataIndex: 'syncEndTime',
        key: 'syncEndTime',
        render: val => <span>{formatDate(val, 'YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作人',
        dataIndex: 'operateUser',
        key: 'operateUser',
      },
      // {
      //   title: '操作',
      //   dataIndex: 'action',
      //   key: 'action',
      //   render: (_, record) => <Button type="primary" ghost size="small" icon="edit" onClick={() => this.handleClick(record)}>详细记录</Button>,
      // },
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
          columns={columns}
          dataSource={data}
          pagination={{...paginationProps, showTotal: (total) => { return `共${total}条记录`; }}}
          onChange={this.handleChange}
          size="small"
        />
        <SyncDetailModal />
      </div>
    );
  }
}

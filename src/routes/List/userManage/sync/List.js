import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Divider} from 'antd';
import DataTable from './DataTable';
import SearchForm from './SearchForm';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import {baseState} from '../../../../utils/commonUtils';

import styles from '../../TableList.less';
import DoSyncRecord from "./DoSyncRecord";

@connect()
export default class List extends PureComponent {

  state = baseState("syncRecord", "同步用户信息");

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: this.state.baseUrl.displayAdd,
      payload: true,
    });
  };

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchForm />
            </div>
            <DataTable />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import DataTable from './DataTable';
import SearchForm from './SearchForm';
import AddData from './AddData';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {baseState} from "../../../utils/commonUtils";
import styles from '../TableList.less';



@connect()
export default class List extends PureComponent {

  state = baseState("userConfig", "用户") || {};

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: this.state.baseUrl.displayAdd,
      payload: true,
    })
  };

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchForm size="small" />
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleClick} size="small">添加</Button>
            </div>
            <DataTable />
          </div>
        </Card>
        <AddData />
      </PageHeaderLayout>
    );
  }
}

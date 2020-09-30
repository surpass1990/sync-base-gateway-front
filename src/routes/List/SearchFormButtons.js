import React, {PureComponent} from "react";
import {Button} from "antd";


export default class BaseButtions extends PureComponent{

  render() {
    return (
      <div style={{ overflow: 'hidden' }}>
        <span style={{ float: 'right', marginBottom: 24 }}>
          <Button type="primary" htmlType="submit" icon="search" size="small">查询</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleReset} size="small">重置</Button>
        </span>
      </div>
    );
  }
}

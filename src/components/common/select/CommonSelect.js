import React, { PureComponent } from 'react';
import { Select } from 'antd';

/**
 * 通用下拉列表
 */
export default class CommonSelect extends PureComponent{
  state = {
    items:[]
  };

  /**
   * 组件挂载完成事件
   */
  componentDidMount = () =>{
    this.load();
  };

  /**
   * 加载还款方式
   */
  load = function () {
    const {dispatch, url} = this.props;
    dispatch({
      type:'ledger/load',
      payload: url,
      callback: (object) => {
        this.setState({
          items: object,
        });
      }
    });
  };

  /**
   * change事件
   */
  handleChange = (e) =>{
    const {onChange} = this.props;
    onChange(e);
  };


  render(){
    const items = this.state.items;
    const itemMap = [];
    for (let i in items) {
      let option = <Select.Option key={i} value={i}>{items[i]}</Select.Option>;
      itemMap.push(option);
    }
    return (
      <Select placeholder="请选择" onSelect={this.handleChange}>
        {itemMap}
      </Select>
    );
  }
}

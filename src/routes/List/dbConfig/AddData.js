import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import AddOrUpdateModal from "./AddOrUpdateModal";
import emitter from "../../../utils/events";
import {baseState} from "../../../utils/commonUtils";

@connect(({ dbConfig: { addModal: { visible } } }) => ({ visible }))
@Form.create()
export default class AddData extends PureComponent {

  state = baseState("dbConfig", "WDC配置") || {};

  handleOk = () => {
    const { form: { validateFieldsAndScroll }, dispatch } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: this.state.baseUrl.add,
          payload: values,
          callback: () => {
            this._closeAddModal();
            emitter.emit(this.state.commons.emitName);
          },
        });
      }
    });
  };

  handleCancel = () => {
    this._closeAddModal();
  };

  _closeAddModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: this.state.baseUrl.displayAdd,
      payload: false,
    });
  };

  render() {
    const { form, visible } = this.props;
    return <AddOrUpdateModal title={this.state.commons.addTitle} visible={visible} form={form} onOk={this.handleOk} onCancel={this.handleCancel} />;
  }
}

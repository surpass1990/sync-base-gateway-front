import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import AddOrUpdateModal from "./AddOrUpdateModal";
import emitter from "../../../../utils/events";
import {baseState} from "../../../../utils/commonUtils";

class UpdateData extends PureComponent {

  state = baseState("systemConfig", "系统") || {};

  handleOk = () => {
    const { form: { validateFieldsAndScroll }, dispatch } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: this.state.baseUrl.update,
          payload: values,
          callback: () => {
            this._closeUpdateModal();
            emitter.emit(this.state.commons.emitName);
            dispatch({type: 'global/fetchSystems'});
          },
        });
      }
    });
  };

  handleCancel = () => {
    this._closeUpdateModal();
  };

  _closeUpdateModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: this.state.baseUrl.displayUpdate,
      payload: false,
    });
  };

  render() {
    const { form, visible } = this.props;
    return <AddOrUpdateModal title={this.state.commons.updateTitle} visible={visible} form={form} onOk={this.handleOk} onCancel={this.handleCancel} update />;
  }
}

export default connect(({ systemConfig: { updateModal: { visible, oldRecord } } }) => ({ visible, oldRecord }))(
  Form.create({
    mapPropsToFields(props) {
      const { oldRecord } = props;
      return {
        id: Form.createFormField({
          value: oldRecord.id,
        }),
        systemCode: Form.createFormField({
          value: oldRecord.systemCode,
        }),
        systemName: Form.createFormField({
          value: oldRecord.systemName,
        }),
        type: Form.createFormField({
          value: oldRecord.type,
        }),
        msg: Form.createFormField({
          value: oldRecord.msg,
        }),
      };
    },
  })(UpdateData)
);

import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon,Modal } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading, user }) => ({
  login,
  submitting: loading.effects['login/login'],user
}))
export default class ChgPwd extends Component {
  state = {
   
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'user/chgPwd',
        payload: {
          ...values,
          type,
        },
        callback: () => {
          this.closeModel();
        },
      });
    }
  };

  closeModel = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/openChgPwd',
      payload: false,
    });
  }

  render() {
    const { login, submitting, user } = this.props;
    const { type } = this.state;
    const { chgPwdStatus } = user;
    return (
      <>
        <Modal
          title="更新密码"
          visible={chgPwdStatus}
          onCancel={this.closeModel}
          footer={
            []
          }
        >
          <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
            <Password 
            name="oldPassword" 
            placeholder="请输入旧密码" 
            rules={
              [
                {
                  required: true,
                  message: "请输入旧密码",
                },
              ]}/>
         
         <Password 
            name="password" 
            placeholder="请输入新密码" 
            rules={
              [
                {
                  required: true,
                  message: "请输入新密码",
                },
              ]}/>
          <Submit loading={submitting}>更新</Submit>
        
        </Login>
      </div>
        </Modal>
      </>
    );
  }
}

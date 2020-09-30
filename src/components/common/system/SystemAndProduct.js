import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';

/**
 * 属性               类型                                                 默认值      说明
 * layout             enum["inline", "vertical"]                          "inline"    inline: 排列到一行，vertical: 排列到一列
 * init               boolean | function                                  true        初始时是否为下拉菜单赋值，并调用init
 * onSystemChange     function(bizSystem: string)                         -           系统菜单变化时回调函数
 * onProductChange    function(productCode: string, bizSystem: string)    -           产品菜单变化时回调函数
 * form               Form                                                -           必填，将组件加入到该属性代表的表单中
 */
@connect(({ global: { systems, product } }) => ({ systems, product }))
export default class extends PureComponent {
  state = {
    sysProducts: [],
  };

  componentDidMount() {
    const { systems, product, dispatch, init } = this.props;
    if (systems.length === 0) {
      dispatch({ type: 'global/fetchSystems' });
    }
    if (product.length === 0) {
      dispatch({ type: 'global/fetchProducts' });
    }
    const _init = init === undefined ? true : init;
    if (_init) {
      this._init();
    }
  }

  _initSystem = () => {
    const { form: { setFieldsValue }, systems } = this.props;
    if (systems.length > 0) {
      setFieldsValue({ bizSystem: systems[0].bizSystem });
      return systems[0].bizSystem;
    }
  };

  _saveSysProducts = (bizSystem) => {
    const { product } = this.props;
    const sysProducts = product ? product.filter(({ bizSystem: b }) => b === bizSystem) : '';
    this.setState({ ...this.state, sysProducts });
    return sysProducts;
  };

  _init = () => {
    const bizSystem = this._initSystem();
    this._saveSysProducts(bizSystem);
    const { onSystemChange, init } = this.props;
    if (bizSystem && onSystemChange) {
      onSystemChange(bizSystem);
    }
    if (typeof init === 'function') {
      init();
    }
  };

  handleSystemChange = (val) => {
    const { form: { resetFields }, onSystemChange } = this.props;
    this._saveSysProducts(val);
    resetFields(['productCode']);
    if (onSystemChange) {
      onSystemChange(val);
    }
  };

  handleProductChange = (val) => {
    const { form: { getFieldValue }, onProductChange } = this.props;
    if (onProductChange) {
      onProductChange(val, getFieldValue('bizSystem'));
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { layout, systems, size, ignoreProductCode } = this.props;
    const { sysProducts } = this.state;
    const _layout = layout || 'inline';
    const { Option } = Select;
    const systemOptions = (systems && systems.map) ? systems.map(({ bizSystem: b, systemName: n }) => <Option key={b} value={b}>{n}</Option>) : '';
    const productOptions = sysProducts ? sysProducts.map(({ productCode: c, productName: n }) => <Option key={c} value={c}>{n}（{c}）</Option>) : '';
    if (_layout === 'inline') {
      return (
        <span>
          <Col md={8} sm={24}>
            <FormItem label="系统名称">
              {getFieldDecorator('bizSystem', {
                rules: [{ required: true, message: "系统名称不能为空" }],
              })(<Select placeholder="请选择系统" onChange={this.handleSystemChange} style={{width: '100%'}} size={size ? `${size}` : 'default'}>{systemOptions}</Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('productCode', {
                rules: [{ required: !ignoreProductCode, message: "产品名称不能为空" }],
              })(
                <Select showSearch placeholder={!ignoreProductCode ? '请选择产品' : '全部产品'} onChange={this.handleProductChange} allowClear={ignoreProductCode} style={{width: '100%'}} size={size ? `${size}` : 'default'}>{productOptions}</Select>
              )}
            </FormItem>
          </Col>
        </span>
      );
    } else if (_layout === 'vertical') {
      const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 10 },
      };
      return (
        <div>
          <FormItem {...formItemLayout} label="系统名称">
            {getFieldDecorator('bizSystem', {
              rules: [{ required: true, message: "系统名称不能为空" }],
            })(<Select placeholder="请选择" onChange={this.handleSystemChange} size={size ? `${size}` : 'default'}>{systemOptions}</Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="产品名称 (产品编码)">
            {getFieldDecorator('productCode', {
              rules: [{ required: true, message: "产品名称 (产品编码）不能为空" }],
            })(<Select showSearch placeholder="请选择" onChange={this.handleProductChange} size={size ? `${size}` : 'default'}>{productOptions}</Select>)}
          </FormItem>
        </div>
      );
    } else {
      return <div>&nbsp;</div>;
    }
  }
}

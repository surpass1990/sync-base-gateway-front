import React, {PureComponent} from 'react';
import {Col, Form, Select} from 'antd';
import {connect} from 'dva';

const FormItem = Form.Item;

@connect(state => ({global: state.global}))
export default class SystemAndProduct extends PureComponent {

  componentWillMount() {
    const {dispatch, global: {systems, product}} = this.props;
    if (product === undefined || product.length == 0) {
      dispatch({type: 'global/fetchProducts'});
    }
    if (systems === undefined || systems.length == 0) {
      dispatch({type: 'global/fetchSystems'});
    }
    this.handleSystemChange = this.handleSystemChange.bind(this);
  }

  /**
   * 页面渲染完成之后调用
   */
  componentDidMount() {
    const {systems} = this.props.global;
    if (systems === undefined || systems.length == 0) {
      return
    }
    let {systemCode} = systems[0];
    const {form} = this.props;
    form.setFieldsValue({
      bizSystem: systemCode,
    });
    this.handleSystemChange(systemCode);
  }

  state = {
    products: [],
  }

  handleSystemChange = (value) => {
    const {product} = this.props.global;
    var productDatas = product.reduce(function (item, next) {
      next.bizSystem == value && item.push(next);
      return item
    }, []);
    this.setState({
      products: productDatas,
    });
    const {form} = this.props;
    form.setFieldsValue({
      productCode: productDatas[0].productCode,
    });
  }

  onProductChange = (value) => {
    //判断是否有产品编码变化后的回调函数，如果有就执行
    const {productChangeCallBack} = this.props;
    if (productChangeCallBack != undefined && productChangeCallBack != null) {
      productChangeCallBack(value);
    }
  }

  render() {
    const {form: {getFieldDecorator}, layoutMode} = this.props;
    const {Option} = Select;

    const {systems} = this.props.global;
    const systemOptions =
      systems.map(({bizSystem: b, systemName: n}) => {
        return <Option key={b} value={b}>{n}</Option>
      });

    const productData = this.state.products.map(({productCode: productCode, productName: productName}) => {
      return {"productCode": productCode, "productName": productName}
    });
    const productOptions = productData.map(product => <Option
      key={product.productCode}>{product.productName + ' (' + product.productCode + ')'}</Option>);
    let body;
    if (layoutMode != undefined && layoutMode === 'Vertical') {
      const formItemLayout = {
        labelCol: {
          xs: {span: 24},
          sm: {span: 7},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 12},
          md: {span: 10},
        },
      };
      body = (<div>
        <FormItem {...formItemLayout} label="业务类型">
          {getFieldDecorator('bizSystem', {
            initialValue: null,
          })(
            <Select onChange={this.handleSystemChange}>
              {systemOptions}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="产品名称">
          {getFieldDecorator('productCode')(
            <Select onChange={this.onProductChange}>
              {productOptions}
            </Select>
          )}
        </FormItem>
      </div>);
    } else {
      body = (<span>
        <Col md={8} sm={24} style={{paddingLeft: '24px', paddingRight: '24px'}}>
          <FormItem label="业务类型">
            {getFieldDecorator('bizSystem', {
              initialValue: null,
            })(
              <Select onChange={this.handleSystemChange}>
                {systemOptions}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24} style={{paddingLeft: '24px', paddingRight: '24px'}}>
          <FormItem label="产品名称 (产品编码)">
            {getFieldDecorator('productCode')(
              <Select onChange={this.onProductChange}>
                {productOptions}
              </Select>
            )}
          </FormItem>
        </Col>
      </span>);
    }

    return body;
  }

}

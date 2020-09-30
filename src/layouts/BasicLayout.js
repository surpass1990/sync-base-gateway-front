import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Icon, Layout} from 'antd';
import DocumentTitle from 'react-document-title';
import {connect} from 'dva';
import {Redirect, Route, routerRedux, Switch} from 'dva/router';
import {ContainerQuery} from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import {enquireScreen, unenquireScreen} from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import {getRoutes} from '../utils/utils';
import Authorized, {reloadAuthorized} from '../utils/Authorized';
import {getMenuData} from '../common/menu';
import logo from '../assets/logo-joy.png';
import {setAuthority} from '../utils/authority';

const {Content, Header, Footer} = Layout;
const {AuthorizedRoute, check} = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
  };

  getChildContext() {
    const {location, routerData} = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetchCurrent',
      callback: (response) => {
        if (response && response.currentAuthority) {
          setAuthority(response.currentAuthority);
          reloadAuthorized();
        }
      },
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  getPageTitle() {
    const {routerData, location} = this.props;
    const {pathname} = location;
    let title = '京营平台';
    let currRouterData = null;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - 京营平台`;
    }
    return title;
  }

  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const {routerData} = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };



  getLayoutStyle = () => {
    const { collapsed } = this.props;
    if (!this.state.isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '220px',
      };
    }
    return null;
  };

  handleMenuClick = ({key}) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      const {currentUser} = this.props;
      if (currentUser.currentEnv === 'product' || currentUser.currentEnv === 'prd') {
        window.location.href = `http://ssa.jd.com/sso/logout?ReturnUrl=${window.location.host}`;
      } else {
        window.location.href = `http://test.ssa.jd.com/sso/logout?ReturnUrl=${window.location.host}`;
      }
    }
  };

  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const {
      currentUser,
      collapsed,
      routerData,
      match,
      location,
    } = this.props;
    const bashRedirect = this.getBashRedirect();
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header style={{padding: 0}}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
            />
          </Header>
          <Content style={{margin: '24px 24px 0', height: '100%'}}>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoutes(match.path, routerData).map(item => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              ))}
              <Redirect exact from="/" to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
          <Footer style={{padding: 0}}>
            <GlobalFooter
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> 2020 企业金融研发组
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({user, global}) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
}))(BasicLayout);

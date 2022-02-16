import React, {useEffect, useState} from 'react'
import * as singleSpa from 'single-spa'
import { Layout, Menu, Breadcrumb } from 'antd'
import './App.less'
import loadScript from './utils/index'
import routes from './router/index'
import ownRoutes from './router/ownRouter.js'
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'
import {RightOutlined} from '@ant-design/icons'

const { Header, Content, Sider, Footer } = Layout

// 统一加载子应用的资源
const loadAppSource = (url, globalVar) => {
  // 支持加载远程子应用
  return async () => {
    console.log('loading')
    // 子应用有路由才会打chunk包
    await loadScript(url + '/js/chunk-vendors.js')
    await loadScript(url + '/js/app.js')
    // 这里将加载后的子应用中的生命周期钩子暴露出来
    console.log(window.a)
    return window[globalVar]
  }
}

function App() {
  useEffect(() => {
    singleSpa.registerApplication({
      // name
      name: 'app1',
      // 加载子应用的资源
      app: loadAppSource('http://localhost:8001', 'app1'),
      // 当路由满足条件时（返回true），激活（挂载）子应用
      activeWhen: location => location.pathname.startsWith('/app1'),
      // react子应用，要告知子应用的挂载容器
      customProps: {
        domElement: document.getElementById('chiledContent'),
        name: 'app1'
      }
    })
  }, [])
  
  const [bread, setBread] = useState([])
  useEffect(() => {
    const breadPath = window.location.pathname
    const newbread = breadPath.slice(1).split('/')
    setBread(newbread)
  },[])
  const getMenuPath = () => {
    const breadPath = window.location.pathname
    const newbread = breadPath.slice(1).split('/')
    setBread(newbread)
  }

  return (
    <Router>
      <Layout className='layout'>
        <Header className='header'>
          <div className="loge"></div>
          <h3 style={{color: '#1da57a'}}>hello world, the best language is javascript !</h3>
        </Header>
        <Layout>
          <Sider width={200} className='sider-background'>
            <Menu
              mode="inline"
              style={{ height: '100%', borderRight: 0 }}
              onClick= {getMenuPath}
            >
              {
                routes.concat(ownRoutes).map((item, index) => {
                  return (<Menu.Item key={index} className='menu-item' ><Link to={ item.path }>{ item.name }<RightOutlined className='icon-left'/></Link></Menu.Item>)
                })
              }
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {bread.map((item, index) => {
                return (<Breadcrumb.Item key={index}>{ item === '' ? '/':item }</Breadcrumb.Item>)
              })}
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <div id="chiledContent">
                <Routes>
                  {routes.concat(ownRoutes).map((item, index) => {
                    return (
                      <Route path={item.path} key={index} element={ item.component }/>
                    )
                  })}
                </Routes>
              </div>
            </Content>
            <Footer className='footer'>
              <div className="footer-div">
                <span className='same'>nihao</span>
                @anjuke.com && @58tongcheng.com
              </div>
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
}

singleSpa.start()
export default App;

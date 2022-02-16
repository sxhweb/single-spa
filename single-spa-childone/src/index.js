import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SingleSpaReact from 'single-spa-react';
import SingleSpaLeakedGlobals from 'single-spa-leaked-globals'

// 使用插件保存子应用的全局变量，防止污染
window.a = 'singlespaChildone'
const leakedGlobalsLifeCycles = SingleSpaLeakedGlobals({
  globalVariableNames: ['a']
})

const rootComponent = () => {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
const reactChildLifeCycles = SingleSpaReact({
  React,
  ReactDOM,
  rootComponent,
  errorBoundary(err, info, props) {
    return (
      <div>error</div>
    )
  }
})

// declare let window:any
// 子应用独立部署运行
if (!window.singleSpaNavigate) {
  ReactDOM.render(rootComponent(), document.getElementById('root'))
}

export const bootstrap = async (props) => {
  console.log(props)
  return [
    leakedGlobalsLifeCycles.bootstrap,
    reactChildLifeCycles.bootstrap(props)
  ]
};
export const mount = async (props) => {
  console.log(props)
  return [
    leakedGlobalsLifeCycles.mount,
    reactChildLifeCycles.mount(props)
  ]
};
export const unmount = async (props) => {
  return [
    leakedGlobalsLifeCycles.unmount,
    reactChildLifeCycles.unmount(props)
  ]
};

reportWebVitals();

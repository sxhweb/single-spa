const loadScript= async (url) => {
  return new Promise((resolve,reject)=>{
      let script = document.createElement('script');
      script.src = url;
      // 加载成功执行成功回调
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    })
}
  
export default loadScript
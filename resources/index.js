import Vue from 'vue/dist/vue.esm';

// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
});

// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  window.postMessage('nativeLog', Vue.toString());
});

// call the wevbiew from the plugin
window.setRandomNumber = (randomNumber) => {
  document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
};

let app = new Vue({
  el: '#app',
  data: {
    enabled: true, // 用户主动控制开关启用编辑器
    disabled: true, // 是否选中单个layer开关启用编辑器
    message: 'Hello Vue!'
  }
});

window.changeState = (enabled) => {
  app.enabled = enabled;
};

window.changeSelection = (item) => {
  if(item) {
    app.enabled = true;
  }
  else {}
};

export default {
  domReady() {
    window.postMessage('nativeLog', {
      key: 'domReady',
    });
  },
  updateLayer(v) {
    window.postMessage('nativeLog', {
      key: 'updateLayer',
      value: v,
    });
  }
};


export enum ConnectStatus {
  Disconnected = "disconnected",
  Connected = "connected",
  Connecting = "connecting",
}

export const connectStatusStorage = storage.defineItem<ConnectStatus>("local:connectStatus")

connectStatusStorage.watch(value => {
  switch (value) {
    case ConnectStatus.Connected:
      browser.action.setBadgeBackgroundColor({ color: '#008800' }); // 深绿色背景
      browser.action.setBadgeText({ text: '✓' }); // 勾号
      browser.action.setBadgeTextColor({ color: '#ffffff' });
      break
    case ConnectStatus.Disconnected:
      browser.action.setBadgeBackgroundColor({ color: '#FF0000' }); // 红色背景
      browser.action.setBadgeText({ text: '✗' }); // 叉号
      browser.action.setBadgeTextColor({ color: '#ffffff' });
      break
    case ConnectStatus.Connecting:
      browser.action.setBadgeBackgroundColor({ color: '#FF8C00' }); // 深橙色背景
      browser.action.setBadgeText({ text: '...' }); // 省略号
      break
  }
})
# 06/21 Sat.

## 會議記錄

* 他們目前有的技術
    * webRTC web通訊 目前有視訊會議
    * 簡報同步 4K畫面 用多台螢幕同時show
    * 透過socket 請每個機器播不同片段的影片( socket 他們有做過)
    * 視訊會議: node.js, streaming點對點

* 我們需要的技術
    * 目前不需要處理影像, 只處理音訊
    * 用reveal.js簡報同步
    * 一對多( 主講者對聽眾)

* 他們的技術與我們需要的技術之差異
    * 他們做的是p2p, 我們要做的是一對多
    * 類似網路廣播電台模式也OK：
    * 臨時create一個房間,把大家加進來

* 將webRTC移轉到我們系統上的可能狀況
    * 可能不太合用, 因為webRTC是p2p, 未必能用一對多( 這部分可以再survey看看)
    * webRTC可能也可以針對音訊處理
    * 黃經理要問一下其他同事關於webRTC
    * 也許可以約時間去他們公司討論 介紹他們目前的技術
    * 在簡報中播影片: 可能講師的影片已經播完了     結果其他人同步還沒播完
[reference for webRTC][1]


* 建議
    * 只同步簡報很可惜, 同步投影片中的影片吧
    * 目前可以只考慮在區域網路中的同步機制, 不考慮internet同步, 所以應該不難

* 未來開發模式討論
    * GitHub=> 創專案, 讓經理有存取權限, markdown
    * 依循TSOC規範之checkpoint與黃經理討論
markdown reference:
[markdown1][2]
[markdown2][3]
[markdown3][4]
IceCast <-- Streaming MP3 (MPEG 1 Layer 3 Audio): Using an IceCast 1 streaming server (detailed in this tutorial) with xmms or WinAmp client

## todo list

1. 架node.js的server ( 架在 245.107)
2. 完成基本簡報同步換頁功能(reveal.js & WebSocket)
3. survey webRTC


  [1]: http://www.webrtc.org/reference/architecture
  [2]: https://github.com/acl-translation/acl-chinese/tree/master/zhTW
  [3]: https://github.com/othree/markdown-syntax-zhtw/blob/master/syntax.md
  [4]: http://www.yolinux.com/TUTORIALS/LinuxTutorialAudioStreaming.html

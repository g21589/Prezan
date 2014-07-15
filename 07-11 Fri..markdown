# 07/11 Fri. 

## 面談會議

---

 - 導師公司部門技術分享 
    1. 已有的現成套件[togetherjs][1]
        a. 多人滑鼠同步
        b. 多人音訊串流同步－採用WebRTC
        c. 聲音串流同步技術
    2. WebRTC
        a. 演講者端與Server端結合，演講者端與每一個聽眾端建立連線
        b. 演講者端需要encode多條連線，效能有限，約在3~9人的PC上可行
        c. Server端介接：需要搞WebRTC底層，有難度，依目前時程規劃不太可行
    3. IceCast網路電台伺服器
        a. 由演講者端送音頻到Server端，經由IceCast處理成串流後，送到聽眾端用audio tag直接撥放
        b. 可行、架的起來就OK
        c. Flash 一般常用
    4. EtherPad－即時共同編輯的編輯器( 不過本專案沒有共同編輯之打算)

 - 導師建議
    1. 介面要更潮、缺美工


  [1]: https://togetherjs.com/
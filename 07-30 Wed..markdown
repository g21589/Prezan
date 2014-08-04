# 07/30 Wed.

## 會議記錄

---

- 目前串流壓縮音訊的部分有兩種做法
    1. WebSocket版
        - 演講者端傳送原始聲音資料(PCM 16bit signed integer 單聲道)到伺服器端(約800Kbps = 100KB/s)
        - 伺服器用LAME對音訊轉碼成MP3 (bitRate: 32, SampleRate: 44100, 單聲道)
        - 用Socket.io廣撥給所有聽眾 (約32Kbps = 4KB/s)
        - 聽眾端用HTML5 Web Audio 
        - API的decodeAudioData()解碼並撥放
        - 優劣:
            - 優: 聲音延遲較短 約2~3秒
            - 缺: 
                - 傳送的兩個聲音片段間會有中斷發生
                - 只支援Chrome(在Firefox中的decodeAudioData()似乎認不出MP3格式)

        - 可能的改進方式:
            - 嘗試Ogg Vorbis格式
            - 使用JS版的MP3 decoder ( JSMad -> 難用!?)
 
  2. HTTP版
        - 演講者端傳送原始聲音資料( PCM 16bit signed integer 單聲道)到伺服器端( 約800Kbps = 100KB/s)
        - 伺服器用LAME對音訊轉碼成MP3 ( bitRate: 32, SampleRate: 44100, 單聲道)
        - 聽眾端使用HTML5 Audio Tag 向 Node.js         所架設的MP3串流伺服器發請求，伺服器回應MP3串流標頭與音樂資料 ( 約32Kbps = 4KB/s)
        - 優劣:
            - 優:
                - 聲音非常平順( 應該是緩衝的關係)
                - 瀏覽器支持HTML5 Audio MP3格式就可撥放 ( Chrome, Firefox, IE, ...)
            - 缺：聲音延遲較長 約5~10秒

- 建議
    1. 讓video delay配合聲音的延遲
    2. detect 聲音延遲的時間多久, 讓投影片轉換也跟著延遲
    3. 如果是方法1, 延遲2~3秒, 可以tune一個時間長度, 讓影音同步, 而聲音品質方面可以考慮自己寫buffer
    4. 如果是方法2, 用更智慧的方法detect聲音與畫面延遲差多少
總之一定要有buffer才能避免斷音
    5. 黃經理建議: 傾向於使用方法2, 瀏覽器支援各方面較好, 但detect延遲時間必須動態的處理, 動態的計算延遲時間, 再將畫面延遲

- 分工
    - 冠斌: 音訊同步、介面美化
    - 吉德: 塗鴉
    - 昱琦: 投票

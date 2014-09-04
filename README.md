Prezan
======
[![MIT License][license-image]][license-url]

HTML5 即時簡報聽眾系統

現在的生活中，無處不見投影片的身影，只要牽扯到學習、討論，有投影片的輔助，就能幫助我們對事情的描述更加清楚，但是礙於現今的投影片簡報模式，我們常遇到坐得太遠就看不清楚投影片上的字、台下的人即便人手一台智慧型手機或平板電腦，卻很難即時做筆記、害羞的聽眾想問問題卻不敢發問，帶回家的疑問比筆記還多...。
為了解決這些情形，我們希望透過HTML5網頁技術製作即時簡報系統，透過同步機制，讓聽眾能用自己的行動裝置輕鬆聽講。而演講者透過即時Prezan即時報系統，能與聽眾互動更密切，並且能隨時掌握聽眾反應，讓整場簡報更精采。

Version
----

1.0.0

Install on Ubuntu 14.04 Server
----

```sh
sudo apt-get install lamp-server^

sudo apt-get install gcc g++ make libasound-dev

sudo apt-get install python-software-properties
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update

sudo apt-get install nodejs

git clone https://github.com/g21589/Prezan.git Prezan
cd Prezan/server

sudo npm install socket.io lame winston
```

License
----

MIT

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

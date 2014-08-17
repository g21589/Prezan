Prezan
======
[![MIT License][license-image]][license-url]

HTML5 即時簡報聽眾系統

透過 HTML5 技術，建造一個演講時給予聽眾和講者互動的即時系統。使聽眾可以透過簡報和會眾進行交流，此外，聽眾亦可使用系統取得講者簡報、做筆記或者針對簡報提出問題。

Version
----

0.3.5

Install on Ubuntu 14.04 Server
----

```sh
sudo apt-get install lamp-server^

sudo apt-get install gcc g++ libasound-dev

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

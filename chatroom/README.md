# chatroom

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## vue線上即時聊天室

## 介紹
  1、前端 : vue.js
  2、後端 : node.js、socket.in、mongoDB

## 前端開發順序
  1、主頁面前端建置 : 
    a、頭部html、css布局
    b、中間內容html、css布局
    c、public/js/datas 建立好友假訊息json，並放置Header.vue中間內容處
    d、public/js/timefun 建立時間系統
      => 24小時制 : 當天之內，統一顯示 hh:mm 如:06:16
                    大於今天且在昨天內，統一顯示 昨天 hh:mm 如:昨天06:16
                    大於昨天，統一顯示 YY/MM/DD 如:2021/06/16
  2、登入、註冊頁面建置
    a、登入頁面 html、css布局
    b、註冊頁面 html、css布局
    c、登入、註冊路由建置
    d、登入、註冊按鈕條件判斷
  3、搜尋頁面建置
    a、搜尋頁面 html、css布局
    b、搜尋頁面路由建置
    c、搜尋頁面 搜尋框條件判斷 導入 public/js/datas
      => 利用search()來查詢關鍵字，並渲染到頁面中
  4、聊天室窗建置
    a、聊天對話區域建置
    b、從 datas獲取資料，並渲染到頁面
    c、引用timefun 將時間格式做調整
    d、創建Submit子組件，並新增發送事件
  5、登出頁面建置
    a、建立flag判斷登入/登出

## 後端連接 

  # 使用axios
  1、註冊頁面連結 
    a、axios發送post請求，並將data數據傳送到資料庫
    b、判斷狀態(status) : 400 = 電子郵件被註冊 、 200 = 成功，跳轉到login

  2、登入頁面連結
    a、axios發送post請求，將data數據與資料庫資料做比對
    b、判斷比對是否成功(status) : 400 = 匹配失敗 、 500 = 資料庫錯誤 、 200 = 匹配成功
    c、比對成功，將後端傳來的數據存放到localstorage
    d、生成token，將其傳到資料庫

  3、主頁面連結
    a、獲取localstorage數據，將其傳到data
    b、token驗證，發送post請求，將data中token與資料庫token做比對
    c、比對成功，渲染出好友列表
    d、透過點選特定好友，將其數據存入localstorage，並發送到指定聊天室

  4、聊天室連結
    a、驗證token，發送post請求，將data中token與資料庫token做比對
    b、接收好友數據，將名字、圖片渲染到頁面
    c、透過post請求，抓取資料庫中的聊天訊息
    d、透過post請求，讀取輸入框中的文字，並將其傳入資料庫中
    e、渲染前端畫面，不需重整
    
  5、登出連結
    a、變更flag，logout => login
    b、透過post請求，清除資料庫中的token
    c、移除localStorage中的資料 

      

    

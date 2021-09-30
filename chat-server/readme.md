## 後端創建

# 文件

  1、路由 router - index.js
  2、資料庫 config - db.js
  3、MVC 
      dao - dbserver => 資料庫CRUD
      model - dbmodel.js => 創建語法
      server - 導入CRUD並將其賦予參數 req.body(利用body-parser)
  4、伺服器入口 - app.js

# 插件
  
  1、express => node.js應用框架，擁有中間件、路由等快速建立網站
  2、nodemon => 可以監視nodejs中的所有變更，並自動重啟服務
  3、mysql => 關聯性資料庫，用來存放、操作資料
  4、body-parser => 請求體解析中間件，可以解析JSON、Raw、文本等等
  5、cors => 解決後端跨域問題
  6、uuid => 生成隨機亂碼


# 創建步驟

  1、安裝express => npm install express --save
  2、配置文件夾
  3、配置入口app.js，並安裝插件
  4、安裝mysql => npm install mysql 
  5、在db.js中配置mysql
  6、於dao中建立dbserver.js 方便操作資料庫
      a、導入db.js
      b、利用connect()建立連線
  7、創建API接口
      a、於dbserver.js中操作CRUD並導出
      b、在server文件夾中建立對應js文件，並引用dbserver.js
      c、於router文件夾中的index.js中建立路由，並發起http請求
      d、於前端中使用



# 資料表創建

用戶表(靜態表) => id、name、email、password、created_at、img      
           
好友表(動態表) => id、user_id、friend_id、friend_name、friend_img
                 
訊息表(動態表) => id、user_id、user_name、msg、sendto、time

token(動態表) => token、user_id、created_at
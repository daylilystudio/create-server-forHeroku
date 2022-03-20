## API Server製作

### Heroku 部署流程

1. 安裝 Heroku CLI
```
npm install -g heroku
```

2. 確認是否安裝成功
```
heroku -v
```

3. 登入 Heroku
```
heroku login
```

4. 在專案新增 Heroku 雲端主機
```
heroku create
```

5. 推上專案
```
git push heroku master
```

6. 打開專案網址
```
heroku open
```

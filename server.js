const http = require('http');

// 使用uuid
const { v4: uuidv4 } = require('uuid');

// 錯誤處理
const errHandle = require('./errorHandle');

// data
const todos = [];

// 監聽server回應
const requestListener = (req, res)=>{

    // 表頭資訊
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }

    // 接收body資料
    let body ="";
    req.on('data', chunk=>{
        body+=chunk;
    })

    // 設置各狀態回傳資訊
    if(req.url=="/todos" && req.method == "GET"){
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status": "成功",
            "data": todos,
        }));
        res.end();
    }else if(req.url=="/todos" && req.method == "POST"){
        req.on('end',()=>{
            try {
                const title = JSON.parse(body).title
                if(title !== undefined){
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    }
                    todos.push(todo)
                    res.writeHead(200,headers);
                    res.write(JSON.stringify({
                        "status": "成功",
                        "data": todos,
                    }));
                    res.end();
                }else{
                    errHandle(res)
                }
            } catch (error) {
                errHandle(res)
            }
        })
    }else if(req.url=="/todos" && req.method == "DELETE"){
        todos.length = 0;
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status": "刪除成功",
            "data": todos,
        }));
        res.end();
    }else if(req.url.startsWith("/todos/") && req.method == "DELETE"){
        const id = req.url.split('/').pop();
        const index = todos.findIndex(element => element.id == id)
        if(index !== -1){
            todos.splice(index,1)
            res.writeHead(200,headers);
            res.write(JSON.stringify({
                "status": "刪除成功",
                "data": todos,
            }));
            res.end();
        }else{
            errHandle(res)
        }
    }else if(req.url.startsWith("/todos/") && req.method == "PATCH"){
        req.on('end',()=>{
            try{
                const todo = JSON.parse(body).title;
                const id = req.url.split('/').pop();
                const index = todos.findIndex(element => element.id==id);
                if(todo !== undefined && index !== -1){
                    todos[index].title = todo;
                    res.writeHead(404,headers);
                    res.write(JSON.stringify({
                        "status": "編輯成功",
                        "data": todos,
                    }));
                    res.end();
                }else{
                    errHandle(err)
                }
            }catch{
                errHandle(err)
            }
        })
    }else if(req.method == "OPTIONS"){
        res.writeHead(200,headers);
        res.end();
    }else{
        res.writeHead(404,headers);
        res.write(JSON.stringify({
            "status": "錯誤",
            "message": "無此網址路由",
        }));
        res.end();
    }
}

// 建立server,埠號3005
const server = http.createServer(requestListener);
server.listen(3005)
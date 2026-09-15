import http from "http";

const server=http.createServer((req,res)=>{
    if(req.url==="/"){
        res.writeHead(200,{"Content-Type":"text/html"});
        res.end("<h1>Welcome to Home Page</h1>");
    }else if(req.url==="/about"){
        res.writeHead(200,{"Content-Type":"text/html"});
        res.end("<h1>Welcome to About Page</h1>");
    }else if(req.url==="/contact"){
        res.writeHead(200,{"Content-Type":"text/html"});
        res.end("<h1>Welcome to Contact Page</h1>");
    }else{
        res.writeHead(404,{"Content-Type":"text/html"});
        res.end("<h1>404 Page Not Found</h1>");
    }
});

server.listen(3000,()=>{
    console.log("Server is running on http://localhost:3000");
});
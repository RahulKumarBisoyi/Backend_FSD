import express from 'express';
const app=express();
app.use(express.json());
let users=[
    {id:1,name:"Rahul Kumar",email:"rahul@gmail.com"},
    {id:2,name:"Atul Kumar",email:"atul@gmail.com"}
];

//Get:get request to fetch all users
app.get('/users',(req,res)=>{
    res.json(users);
})

//Post:post  request to crate a new user
app.post('/users',(req,res)=>{
    const user={
        id:users.length+1,
        name:req.body.name,
        email:req.body.email
};
users.push(user);
res.json(user); 
});




app.put("/users/:id",(req,res)=>{
    let user=users.find(u=>u.id==req.params.id);
    user.name=req.body.name;
    user.email=req.body.email;
    res.json(user);
});

app.delete('/users/:id',(req,res)=>{
    users=users.filter(u=>u.id!=req.params.id);
    res.send("user deleted successfully");
});

app.listen(8000,()=>{
    console.log("server is running on port: https://localhost:8000 ")
});


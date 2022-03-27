const express=require('express')
const cors=require('cors')
const http=require('http')
const socket=require('socket.io')

const app=express()
app.use(cors())     // used for intercommunication between urls
app.get('/',(req,res)=>{

    res.send('Welcome')
})

const users=[]

const server=http.createServer(app)

server.listen(6789,()=>{
    console.log("I am Listening at 6789")
})

const io=socket(server)

io.on('connection',(socket)=>{
    // console.log('new connection')
    socket.on('Joined',(user)=>{
      console.log('user',user.name)
      users[socket.id]=user.name
      console.log(`${user} has joined`)
      socket.broadcast.emit('UserJoined',{user:"Admin",message:`${users[socket.id]} has Joined`})
      socket.emit('Welcome',{user:"Admin",message:"Welcome to Chat App"})
    })

    socket.on('message',({text,id})=>{
        io.emit("SendMessage",({user:users[id],text,id}))
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('Leave',{user:"Admin",message:`${users[socket.id]} has left`})
        console.log(`User left`)
    })

})
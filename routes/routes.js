const express = require('express')
const app = express()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authenticateToken = require('./middleware')
app.use(express.json())
// post : create user and return token
// post : login and return token 

// get : all posts 
// get : post by id

// only if token 
// post : create post 
// put : update post
// delete : delete post 

//gets all posts
app.get(`/posts` , async(req,res)=>{
try{
    const posts = await prisma.post.findMany()
    res.status(200).json(posts)
} catch (error) {
    console.error(error)
    res.status(500).json({message: 'Error fetching posts'})
}
})

//gets post by id 
app.get(`/posts/:id` , async (req,res)=>{
    try{
        const id = req.params.id
        const postId = parseInt(id)

        const post = await prisma.post.findUnique({
            where : {
                id: postId
            }
        })
        res.status(200).json(post)
    } catch (error) {
        console.error(error)
        res.status(500).json({message : 'error fetching user'})
    }
})



app.post('/posts' , authenticateToken , async (req,res)=>{
    try{
        const {title, content , userId} = req.body
        if(!title || !content || !userId) {
            return res.status(400).json({message : "please fill in all required fields"})
        }
        
        const newPost = await prisma.post.create({
            data : {
                title ,
                content ,
                userId ,
            }
            })
            return res.status(200).json({newPost})
    } catch(error){
        console.error(error)
        res.status(500).json({message : "Error creating post"})
    }
})
    


app.put('/posts/:id' , authenticateToken ,  async(req,res)=>{
    try{
        const id = req.params.id
        const postId = parseInt(id,10)
        const {title , content , userId} = req.body

        if(!title  || !content  || !userId){
            return res.status(400).json({message : "Please fill in all fields" })
        }

       
        const newPost = await prisma.post.update({
            where : {
                id : postId
        },
            data : {
                title,
                content,
                userId 
            }

            })
            res.status(200).json(newPost)
        } catch(error) {
         console.error(error)
         res.status(500).json({message: 'Error updating post'}) 
        }
})

app.delete('/posts/:id' , authenticateToken , async(req,res)=>{
    try{
        const id = req.params.id
        const postId = parseInt(id)

       const deletedPost = await prisma.post.delete({
        where : {
            id : postId
       }
    })
    res.status(200).json({deletedPost})
    
} catch {
    res.status(500).json({message : "failed to delete post"})
}
})

module.exports = app 
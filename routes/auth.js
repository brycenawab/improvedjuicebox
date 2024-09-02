const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
app.use(express.json())


// create user , return JWT

app.post(`/users` , async(req,res)=>{
    try{
        const {username,password} = req.body

        if(!username || !password){
            return res.status(400).json({message: 'Please provide a username and password' })
        }

        const hashedPassword = await bcrypt.hash(password , 10)

        

        const user = await prisma.user.create({
            data : {
                username ,
                password : hashedPassword
            }
            })

            const accessToken = jwt.sign({username}, process.env.SECRET_KEY)


            res.status(201).json({message : "user created successfully" , accessToken })

               
    } catch (error){
        console.error(error)
        res.status(500).json({message: 'Error creating user'})
    }

})

//login , return JWT 
app.post('/login' , async(req,res)=>{
    try{

        

        const {username,password} = req.body
        if(!username  || !password){
            return res.status(400).json({message : "Please provide a username and password"})
        }

        const user = await prisma.user.findUnique({
            where : {
                username : username
            }
        })
        if(user && await bcrypt.compare(password, user.password)) {

            const accessToken = jwt.sign(
                {userId : user.id , username : user.username},
                process.env.SECRET_KEY
            )
            res.status(200).json({message : "User logged in successfully" , accessToken})
            } else {
                res.status(401).json({message : 'Invalid username or password'})
        }
  } catch(error) {
    console.error(error)
    res.status(500).json({message: 'Error logging in user'})
  }

})

module.exports = app
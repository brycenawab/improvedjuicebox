const express = require('express')
const app = express()
app.use(express.json())
require("dotenv").config()

app.use("/api" , require(`./routes/routes`))
app.use('/auth' , require('./routes/auth'))


app.listen(3000 , ()=>{
    console.log("server is running on port 3000")
})
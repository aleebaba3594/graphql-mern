const express= require('express')
const colors = require('colors')
const cors= require('cors')
const env=require('dotenv').config()
const { graphqlHTTP } = require('express-graphql'); 
const schema1 = require('./schema/schema1')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000
const app = express()

//connection to db
connectDB()
app.use(cors())
app.use( '/graphql',  graphqlHTTP({
      schema: schema1,
      graphiql: process.env.NODE_ENV==='development',
    }),
  );

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})

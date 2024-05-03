//import the module for connection
const connectToMongo = require('./db');
const cors = require('cors');
connectToMongo()

//express 
const express = require('express')
const app = express()
const port = 5000
app.use(cors());
app.use(express.json())

//available routes. app.use is for middlewar work
app.use('/api/auth' , require('./routes/auth'));
app.use('/api/notes' , require('./routes/notes'));


//general
app.get('/', (req, res) => {
  res.send('Hello Ahsan')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
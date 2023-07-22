const app = require('./app')
require('dotenv').config();
console.log(process.env.PORT)
const port = process.env.PORT

app.listen(port,()=>{
    console.log('Server is up on port ',port)
})
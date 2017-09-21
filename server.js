const express = require('express')
const app = express()
const pug = require('pug')

app.use(express.static('public'))

app.set('view engine', 'pug')

app.get('/', (request, response) => {
  response.render('index')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

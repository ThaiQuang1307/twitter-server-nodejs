import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
const app = express()
const port = 3000

databaseService.connect()

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use(express.json())

app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})

import amqp from 'amqplib'
import LogWatcher from './model/logWatchers.js'
import { notification } from './notification/sendWhatsapp.js'
import connect from './database/index.js'
import dotenv from 'dotenv'
dotenv.config()

const connected = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URI)

  const channel = await connection.createChannel()
  const queue = process.env.RABBITMQ_QUEUE

  channel.assertQueue(queue, { durable: true })

  channel.consume(queue, messages => {
    const data = messages.content.toString()
    const responseJson = JSON.parse(data)

    const { issuesId, issuesName, watcherName, watcherPhoneNumber, message, timestamp: date } = responseJson

    console.log(responseJson)
    // channel.ack(messages)

    try {
      const logWatcher = new LogWatcher({
        issuesId,
        issuesName,
        watcherName,
        watcherPhoneNumber,
        message,
        date
      })

      logWatcher.save()

      console.log('Data telah masuk kedalam database')

      notification(watcherPhoneNumber, 'Redmine', message)
    } catch (error) {
      console.log(error.message)
    }
  }, { noAck: false })
}

connected()
connect()

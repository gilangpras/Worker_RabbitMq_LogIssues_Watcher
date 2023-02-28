import mongoose from 'mongoose'
const { Schema } = mongoose

const LogWatchers = new Schema({
  issuesId: {
    type: String
  },
  issuesName: {
    type: String
  },
  watcherName: {
    type: String
  },
  watcherPhoneNumber: {
    type: String
  },
  message: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('logs-watchers', LogWatchers)

import mongoose from 'mongoose'

const logbookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  permission: {
    type: String,
    required: true,
    enum: ['Father', 'Mother', 'Sibling', 'Guardian']
  },
  outTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  inTime: {
    type: Date,
    default: null
  },
  reason: {
    type: String,
    trim: true,
    default: '',
    required:true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Index for better query performance
logbookSchema.index({ userId: 1, outTime: -1 })
logbookSchema.index({ inTime: 1 })

// Virtual to check if user is currently out
logbookSchema.virtual('isOut').get(function() {
  return this.inTime === null
})

// Method to check in
logbookSchema.methods.checkIn = function() {
  this.inTime = new Date()
  return this.save()
}

const LogBook = mongoose.model('LogBook', logbookSchema)

export default LogBook
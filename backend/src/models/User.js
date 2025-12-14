const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  username: {
    type: String,
    required: [true, 'Please add a username'],
    minlength: [3, 'Username must be at least 3 characters'],
    trim: true
  },
  profile: {
    firstName: {
      type: String,
      required: [true, 'Please add first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please add last name'],
      trim: true
    },
    riskPreference: {
      type: String,
      enum: ['Low', 'Med', 'High'],
      default: 'Med'
    },
    experienceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert'],
      default: 'Beginner'
    }
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

// Encrypt password before saving if modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method for login
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
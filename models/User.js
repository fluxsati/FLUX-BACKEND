const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['member', 'admin'], 
    default: 'member' 
  },
  avatar: { 
    type: String, 
    default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" 
  },
  isOnline: { type: Boolean, default: false }
}, { timestamps: true });

// --- PASSWORD ENCRYPTION MIDDLEWARE ---
/** * IMPORTANT: In modern Mongoose, if this function is 'async', 
 * you do NOT include 'next' in the arguments. 
 * Mongoose automatically proceeds when the promise resolves.
 */

userSchema.pre('save', async function() {
  // 1. If password is NOT modified (e.g., only updating isOnline status), 
  // just return to continue the save process.
  if (!this.isModified('password')) {
    return; 
  }

  try {
    // 2. Generate Salt and Hash for new or changed passwords
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // In async hooks, simply finishing the function is the same as calling next()
  } catch (error) {
    // 3. Throw the error so the Express error handler can catch it
    throw error;
  }
});

// --- MATCH PASSWORD METHOD ---
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
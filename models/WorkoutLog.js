const mongoose = require('mongoose');
const LoggedExercise = require('./LoggedExercise');

const workoutLogSchema = new mongoose.Schema({
	exercise: [LoggedExercise.schema]
}, { _id: false });
	
const WorkoutLog = mongoose.model('workoutlog', workoutLogSchema);

module.exports = WorkoutLog;
const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const LoggedExercise = require('../../models/LoggedExercise');

before(function(done) {
	mongoose.connect('mongodb://localhost:27017/traintraxTest',
		{ useNewUrlParser: true }
	);

	mongoose.connection.once('open', 
		() => {
			console.log('Connected!')
			done();
		}
	).on('error', (error) => {
	    console.warn('Error: ',error);
	    done();
	});
})

after(function(done) {
	console.log('All done! Closing mongoose connection');
	mongoose.disconnect()
	.then(() => {
		console.log('Connection closed.');
		done();
	});
});

describe('Exercise', function() {
	afterEach(function(done) {
	    mongoose.connection.collections.loggedexercises.drop(() => {
	        done();
    	});
	});

	describe('#create', function() {
		it('should require a name', function(done) {
			let exercise = {
				'sets': 0,
				'weight': 0,
				'reps': 0
			}
			LoggedExercise.create(exercise, function(err) {
				expect(err).to.not.be.null;
				expect(err.name).to.equal('ValidationError');
				return done();
			});
		});

		it('should require a weight', function(done) {
			let exercise = {
				'name': 'Squats',
				'sets': 0,
				'reps': 0
			}
			LoggedExercise.create(exercise, function(err) {
				expect(err).to.not.be.null;
				expect(err.name).to.equal('ValidationError');
				return done();
			});
		});

		it('should require sets', function(done) {
			let exercise = {
				'name': 'Squats',
				'weight': 0,
				'reps': 0
			}
			LoggedExercise.create(exercise, function(err) {
				expect(err).to.not.be.null;
				expect(err.name).to.equal('ValidationError');
				return done();
			});
		});

		it('should require reps', function(done) {
			let exercise = {
				'name': 'Squats',
				'sets': 0,
				'weight': 0,
			}
			LoggedExercise.create(exercise, function(err) {
				expect(err).to.not.be.null;
				expect(err.name).to.equal('ValidationError');
				return done();
			});
		});	

		it('should create a LoggedExercise', function(done) {
			let exercise = {
				'name': 'Squats',
				'sets': 0,
				'weight': 0,
				'reps': 0
			}
			LoggedExercise.create(exercise, function(err, exercise) {
				expect(err).to.be.null;
				expect(exercise).to.exist;
				return done();
			});
		});
	});
});
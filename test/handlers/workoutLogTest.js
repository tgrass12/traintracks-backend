const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const {
	getWorkoutLog,
	addExerciseToLog,
} = require('../../handlers/workoutLog');

let req, res, next;

function init() {
	return {
		req: {
			body: {}
		},
		res: {
			statusReturned: 200,
			status: function(s) {
				this.statusReturned = s
				return this;
			},
			jsonReturned: {},
			json: function(j) {
				this.jsonReturned = j;
				return this;
			},
			err: ''
		},
		next: function(err) {
			this.err = err.message;
			this.statusReturned = 404;
		}				
	}
}

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

describe('workoutLogHandler', function() {
	before(async function() {
		let userId = await mongoose.connection.collections.users.insertOne(
			{ 'username': 'test' }
		).insertedId;
		await mongoose.connection.collections.journalentries.insertOne({
			'user': userId,
			'date': '2019-07-04',
			'workouts': {
				'exercise': [{
					'name': 'Bench Press',
					'weight': 205,
					'sets': 3,
					'reps': 8
				}]
			}
		});
	});

	beforeEach(async function() {
		let initVals = init();
		let user = await mongoose.connection.collections.users.findOne(
			{ 'username': 'test' }
		);
		req = initVals.req;
		req.user = user;
		res = initVals.res;
		next = initVals.next.bind(res);
	});

	after(async function() {
		await mongoose.connection.collections.users.deleteOne(
			{ 'username': 'test' }
		);	
		await mongoose.connection.collections.journalentries.drop();
		await mongoose.connection.collections.loggedexercises.drop();
	});

	describe('#addExerciseToLog()', function() {

		after(async function() {
			await mongoose.connection.collections.journalentries.deleteOne({
				'date': '2019-07-02'
			});
		});

		it('should add a new exercise', async function() {
			let exercise = {
				'exerciseName': 'Squat',
				'weight': 195,
				'sets': 1,
				'reps': 8
			};

			let params = {
				'date': '2019-07-02'
			}

			req.params = params;
			req.body = exercise;
			await addExerciseToLog(req, res, next);
			expect(res.statusReturned).to.equal(200);
			expect(res.jsonReturned.workouts).to.be.an('object');
		});
	});

	describe('#getWorkoutLog()', function() {
		it('should return 204 for empty log', async function() {

			let params = { 
				'username': 'test',
				'date': '2019-07-02'
			}

			req.params = params;

			await getWorkoutLog(req, res, next);
			expect(res.statusReturned).to.equal(204);
		});

		it('should return the entry if it exists', async function() {
			
			let params = {
				'username': 'test',
				'date': '2019-07-04'
			};

			req.params = params;

			await getWorkoutLog(req, res, next);
			expect(res.statusReturned).to.equal(200);
			expect(res.jsonReturned.workouts).to.be.an('object');
		});
	});
});

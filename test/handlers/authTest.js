const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const {registerUser} = require('../../handlers/auth');

let req, res;

function init() {
	return {
		req: {
			body: {}
		},
		res: {
			statusReturned: 0,
			status: function(s) {
				this.statusReturned = s
				return this;
			},
			jsonReturned: {},
			json: function(j) {
				this.jsonReturned = j;
				return this;
			},
			error: '',
			next: function(data) {
				this.error = data;
				return this;
			}
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

describe('authHandler', function() {

	before(function(done) {
	    mongoose.connection.collections.users.drop(() => {
	        done();
    	});
	});

	beforeEach(function() {
		let initVals = init();
		req = initVals.req;
		res = initVals.res;

	});

	afterEach(function(done) {
	    mongoose.connection.collections.users.drop(() => {
	        done();
		});
	});

	describe('#registerUser()', function() {

		it('should register a new user', async function() {
			req.body.username = 'test';
			await registerUser(req, res, res.next);
			console.log(res);
			expect(res.statusReturned).to.equal(200);
			expect(res.jsonReturned).to.be.an('object');
		});
	});
});
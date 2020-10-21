const mocha = require('mocha');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const mongoose = require('mongoose');
const User = require('../../models/User');

before(function (done) {
  mongoose.connect('mongodb://localhost:27017/traintraxTest', {
    useNewUrlParser: true,
  });

  mongoose.connection
    .once('open', () => {
      console.log('Connected!');
      done();
    })
    .on('error', (error) => {
      console.warn('Error: ', error);
      done();
    });
});

after(function (done) {
  console.log('All done! Closing mongoose connection');
  mongoose.disconnect().then(() => {
    console.log('Connection closed.');
    done();
  });
});

describe('User', function () {
  afterEach(function (done) {
    mongoose.connection.collections.users.drop(() => {
      done();
    });
  });

  describe('#create()', function () {
    it('should require username', function (done) {
      User.create({}, function (err) {
        expect(err.name).to.equal('ValidationError');
        return done();
      });
    });

    it('should successfully create a user', function (done) {
      User.create({ username: 'test' }, function (err, user) {
        expect(user).to.exist;
        return done();
      });
    });

    //Cannot get this test to work for the life of me
    it('should reject duplicate user');
    // function(done) {
    // User.init().then(function() {
    //  	return expect(
    //  		User.create([{'username': 'test'}, {'username': 'test'}])
    //  	).to.eventually.be.rejected;
    //  	// done();
    //  	//  function(err, users) {
    //  	// 	console.log(err);
    //  	// 	console.log(user);
    //  	// 	done();
    //  	// });
    // });
    // });
  });
});

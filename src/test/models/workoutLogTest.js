const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const WorkoutLog = require('../../models/WorkoutLog');

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

describe('WorkoutLog', function () {
  describe('#create', function () {
    it('should create an empty workout log', function () {
      let log = new WorkoutLog();
      expect(log).to.not.be.null;
      expect(log.exercise).to.be.an('array');
    });
  });
});

const chai = require('chai');
const should = chai.should();
const PromiseQueue = require('../src/PromiseQueue');
const request = require('request-promise-native');

let queue, running, finished;

function asyncSimple (data) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			resolve(data);
      running.push(queue.running);
      finished.push(data);
		}, Math.random() * 500);
	});
}

function asyncWeb (data) {
  return request('http://www.google.com')
    .then(function (htmlString) {
        running.push(queue.running);
        finished.push(data);
        //console.log(`async resolved ${data}, queue running: ${queue.running}`);
    })
    .catch(function (err) {
        console.log(`async err ${data}: ${err.message}`);
    });
}

describe('PromiseQueue', () => {
  beforeEach( () => {
		queue = new PromiseQueue(asyncWeb);
    running = [];
    finished = [];
  });

	it("should fullly process job burst", (done) => {
		const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
		Promise.all(
			data.map(item => queue.push(item))
		).then(() => {
      let runningSum = 0;
      running.forEach( run => runningSum += run);
      const avgRunning = Math.round(runningSum / running.length);
      // During an extended burst of jobs, queue should be fully utilized
      avgRunning.should.be.equal(queue.max);
      // All jobs should have been completed
      finished.length.should.be.equal(data.length);
      // Queue and jobs remaining should now be empty
      queue.running.should.be.equal(0);
      queue.jobsRemaining.should.be.equal(0);
      queue.size.should.be.equal(0);
      done();
    });
	});
});

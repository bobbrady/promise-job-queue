# Promise Job Queue
A simple concurrency limited job queue utilizing ES6 promises.

Many promise queues available lack a true job queue nature.  They will typically run batches of N jobs a time.  The downside of that approach is that one must wait for the entire N jobs to complete before a new job can be enqueued and start running.

This implementation has the benefit of being a true job queue design.  As each job in the queue completes, a new one will immediately be enqueued and start running.  This design also ensures that the full capacity of the queue will be running during a job burst.

## Features
* Limits the maximum number of concurrently running jobs
* A true job queue: when one job finishes, a new one will immediately begin running.
* Simple and extensible
* Test coverage

## Usage

* Import the PromiseJobQueue class
* Construct a new queue with a given job function and max concurrency
* Push jobs onto the queue
* Collect finished job data

```
const PromiseJobQueue = require('promise-job-queue');

// Track finished jobs
const finished = [];

// Your Job function with data input
function job(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
      finished.push(data);
     }, Math.random() * 500);
    });
}

// Construct your job queue, limit concurrent running jobs to a max of 2
const queue = new PromiseJobQueue(job, 2);

// Submit a job burst
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
Promise.all(
  data.map(item => queue.push(item))
).then(() => {
  console.log('finished jobs', finsihed);
});
```

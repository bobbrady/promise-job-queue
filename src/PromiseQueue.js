'use strict';

class PromiseQueue {
  constructor(fn, max) {
    this._jobs = [];
    this._queue = [];
    this._fn = fn;
    this._max = max ? max : 3;
    this._progress = false;
  }

  push(data) {
    return new Promise((resolve, reject) => {
      this._jobs.push({ running: false, data, resolve, reject });
      if (!this._progress) {
        this._progress = true;
        this._run();
      }
    });
  }

  _run() {
    if (this._queue.length < this._max) {
      this._queue.push(...this._jobs.splice(0, this._max - this._queue.length));
    }

    this._queue.forEach( job => {
      if (!job.running) {
        job.running = true;
        this._fn(job.data)
          .then( result => job.resolve(result))
          .then( () => this._next(job))
          .catch(err => job.reject(err));
      }
    });
  }

  _next(job) {
    const jobIdx = this._queue.indexOf(job);
    this._queue.splice(jobIdx, 1);
    if (this._jobs.length > 0 || this._queue.length > 0) {
      this._run();
    } else {
      this._progress = false;
    }
  }

  get size() {
    return this._queue.length;
  }

  get running() {
    let cnt = 0;
    this._queue.forEach( job => job.running ? cnt++ : null);
    return cnt;
  }

  get max() {
    return this._max;
  }

  get jobsRemaining() {
    return this._jobs.length;
  }
}

module.exports = PromiseQueue;

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
      this._jobs.push({ data, resolve, reject });
      if (!this._progress) {
        this._progress = true;
        this._run();
      }
    });
  }

  _run() {
    console.log('starting jobs length: ', this._jobs.length);
    if (this._queue.length < this._max) {
      this._queue.push(...this._jobs.splice(0, this._max - this._queue.length));
    }
    console.log("queue length:", this._queue.length);
    console.log("job length after queued:", this._jobs.length);

      const job = this._queue.shift();
      this._fn(job.data)
        .then( result => job.resolve(result))
        .then( () => this._next())
        .catch(err => job.reject(err));

  }

  _next() {
    if (this._jobs.length > 0 || this._queue.length > 0) {
      this._run();
    } else {
      this._progress = false;
    }
  }
}

module.exports = PromiseQueue;

function async(data) {
  return new Promise((resolve, reject) => {
    setTimeout( () => {
      console.log("resolving", data);
      resolve(data);
    }, Math.random() * 2000);
  });
}

const queue = new PromiseQueue(async);
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map( item => queue.push(item));

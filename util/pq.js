// Eytzinger
const parentOf = i => i >> 1;
const leftOf = i => i << 1;
const rightOf = i => (i << 1) + 1;

/**
 * @template T
 * @typedef {(a: T, b: T) => number} Comparator
 */

/** @template T */
export class PriorityQueue {
  /** @param {Comparator<T>} comparator */
  constructor(comparator = (a, b) => a.toString().localeCompare(b)) {
    /** @private @type {T[]} */
    this.heap = [null];
    /** @private @type {Comparator<T>} */
    this.comparator = comparator;
  }

  /** @returns {number} */
  size() {
    return this.heap.length - 1;
  }
  /**
   * @param {T} v
   * @returns {number}
   */
  push(v) {
    this.heap.push(v);
    this.siftUp();
    return this.size();
  }
  /** @returns {T?} */
  peek() {
    return this.heap[1];
  }
  /** @returns {T?} */
  pop() {
    const bottom = this.size();
    if (bottom === 0) return;

    const poppedValue = this.peek();
    if (bottom > 1) {
      this.swap(1, bottom);
    }
    this.heap.pop();
    this.siftDown();
    return poppedValue;
  }
  /**
   * @private
   * @param {number} i
   * @returns {boolean}
   */
  isValid(i) {
    return i > 0 && i <= this.size();
  }
  /**
   * @private
   * @param {number} i
   * @param {number} j
   * @returns {boolean}
   */
  shouldSwap(i, j) {
    const a = this.heap[i];
    const b = this.heap[j];
    return this.comparator(a, b) < 0;
  }
  /**
   * @private
   * @param {number} i
   * @param {number} j
   */
  swap(i, j) {
    const t = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = t;
  }
  /** @private */
  siftUp() {
    let n = this.size();
    let p = parentOf(n);
    while (this.isValid(p) && this.shouldSwap(n, p)) {
      this.swap(n, p);
      n = p;
      p = parentOf(n);
    }
  }
  /** @private */
  siftDown() {
    let n = 1;
    let l = leftOf(n);
    let r = rightOf(n);
    let m = -1;
    while (true) {
      if (this.isValid(l)) {
        if (this.isValid(r)) m = this.shouldSwap(l, r) ? l : r;
        else m = l;
      } else if (this.isValid(r)) m = r;
      if (m < 0 || !this.shouldSwap(m, n)) break;
      this.swap(n, m);
      n = m;
      l = leftOf(n);
      r = rightOf(n);
      m = -1;
    }
  }
}
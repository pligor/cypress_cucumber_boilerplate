const now = () => new Date().getTime();

/**
 * Is value from promise evaluated to be the same for the last xx times ? Given that this is checked by a yy interval for no longer than zz msecs
 * @param {*} getter a function that will get the item
 * @param {*} minlen how many concurrent calls the promise wrapper needs to be stable
 * @param {*} interval how frequently the value of the promise will be checked
 */
export default class StabilityChecker {
  constructor(getter = ($el) => $el.text(), interval_msec = 100, minlen = 10) {
    this.getter = getter;
    this.interval_msec = interval_msec;
    this.minlen = minlen;

    this.timeref = 0;
    this.prevs = [];

    this.used = false;
  }

  wait_to_stabilize() {
    if (this.used) {
      throw new Error(
        "StabilityChecker is already used. Please create a new instance"
      );
    } else {
      this.used = true;
    }

    return ($el) => {
      const tick = now();
      const is_it_about_time = tick >= this.timeref + this.interval_msec;
      if (is_it_about_time) {
        this.timeref = tick; //reset reference

        const current = this.getter($el);
        this.prevs.push(current);

        // console.log(prevs.length);

        if (this.prevs.length < this.minlen) {
          // console.log("prevs length is", this.prevs.length);
          throw new Error(
            `Timeout reached. We have gather ${this.prevs.length} items, we required minimum ${this.minlen} items and they were gathered with an interval of ${this.interval_msec} msecs`
          );
        } else {
          // console.log(this.prevs);
          const is_stable = this.prevs
            .slice(-this.minlen)
            .every((prev) => prev === current);
          expect(is_stable).to.be.true;
        }
      } else {
        throw new Error(
          `Timeout reached. We have gather ${this.prevs.length} items, we required minimum ${this.minlen} items and they were gathered with an interval of ${this.interval_msec} msecs`
        );
      }
    };
  }
}

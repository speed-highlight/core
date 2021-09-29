'strict mode';
/**
 * Just sample of jsdoc
 * @name triangle
 * @param {Number} [size]
 */

const size = 10;

// init state with first state
let state = [...Array(size), 1, ...Array(size)];

for (let y = 0; y <= size; y++) {
  console.log(state.map(star => (star ? '*' : ' ')).join(''));

  state = state.map((_, i, arr) => arr[i + 1] || arr[i - 1]);
}
import foo from './old/path/to/foo';
import goo from './old/goo';

export * from './old/path/to/foo';
export { default as foo } from './old/path/to/foo';
export { default as goo } from './old/goo';
export const num = 1;
export const filePath = './foo';

var requiredFoo = require('./old/path/to/foo');
require('./old/path/to/foo');
require('./old/path/to/foo')();

foo();
goo();

import {run} from 'jscodeshift/dist/Runner';
import DEFAULT_OPTIONS from './constants';

const transform = require.resolve(
  '../transformers/import-declaration-transform'
);

export default function importDeclarationCodemodRunner(
  roots,
  paths,
  userOptions
) {
  const options = {
    paths,
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };
  const result = run(transform, roots, options);
  return Promise.resolve(result);
}

import transform from 'refactoring-codemods/lib/transformers/import-declaration-transform';
import {run} from 'jscodeshift/dist/Runner';
import DEFAULT_OPTIONS from './constants';


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

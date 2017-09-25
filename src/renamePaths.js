import * as vscode from 'vscode';
import { extname } from 'path';
import { isDirectorySync, isFileSync } from 'fs-plus';
import {
  buildPathsToRename,
  renameFile,
} from './utils';
import importDeclarationCodemodRunner from './transforms/importDeclarationCodemodRunner';
import importRelativeCodemodRunner from './transforms/importRelativeCodemodRunner';

function renameAndTransform(previousPath, nextPath, projectRoot, paths, userOptions) { 
  console.log('renaming and transformin')
  if (isFileSync(nextPath)) {
    vscode.window.showErrorMessage(`${nextPath} already exists!`)
    return;
  }
  if (renameFile(previousPath, nextPath)) {
    console.log('rename worked')
    if (
      isDirectorySync(nextPath) ||
      (extname(previousPath) === '.js' && extname(nextPath) === '.js')
    ) {
      const filesThatMoved = paths.map(path => path.nextFilePath);
      console.log('files that moved',filesThatMoved)
      if (filesThatMoved.length > 0) {
        return importRelativeCodemodRunner(
          filesThatMoved,
          paths,
          userOptions
        )
      }

      return importDeclarationCodemodRunner(
        [projectRoot],
        paths,
        userOptions
      )
    }
  } else {
    console.log('whooops:')
  }
}

// function syncChangesWithGit(projectRoot) {
//   const repo = getRepo(projectRoot);
//   if (repo !== null) {
//     repo.refreshIndex();
//     repo.refreshStatus();
//     atom.workspace.getTextEditors().forEach(editor =>
//       repo.getPathStatus(editor.getPath()),
//     );
//   }
// }

export default function renamePaths(previousPath, nextPath) {
  const [projectRoot] = vscode.workspace.workspaceFolders
  // const userOptions = getUserOptions(projectRoot);
  const paths = buildPathsToRename(previousPath, nextPath);

  return renameAndTransform(previousPath, nextPath, projectRoot, paths);
  // syncChangesWithGit(projectRoot);
}
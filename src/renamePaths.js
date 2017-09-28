import * as vscode from "vscode";
import { extname } from "path";
import { isDirectorySync, isFileSync } from "fs-plus";
import { buildPathsToRename, renameFile } from "./utils";
import importDeclarationCodemodRunner from "./transforms/importDeclarationCodemodRunner";
import importRelativeCodemodRunner from "./transforms/importRelativeCodemodRunner";

function renameAndTransform(
  previousPath,
  nextPath,
  projectRoot,
  paths,
  userOptions
) {
  return Promise.resolve().then(() => {
    if (isFileSync(nextPath)) {
      vscode.window.showErrorMessage(`${nextPath} already exists!`);
      return;
    }
    if (renameFile(previousPath, nextPath)) {
      if (
        isDirectorySync(nextPath) ||
        (extname(previousPath) === ".js" && extname(nextPath) === ".js")
      ) {
        const filesThatMoved = paths.map(path => path.nextFilePath);
        return Promise.resolve()
          .then(() => {
            if (filesThatMoved.length > 0) {
              return importRelativeCodemodRunner(
                filesThatMoved,
                paths,
                userOptions
              );
            }
          })
          .then(() => {
            console.log("starting import declaration");
            console.log('projectRoot:',projectRoot)
            return importDeclarationCodemodRunner(
              [projectRoot],
              paths,
              userOptions
            ).then(() => {
              console.log("heyoo");
              return;
            });
          })
          .catch(e => {
            console.error("error running transforms:", e);
            vscode.window.showErrorMessage("Error running transforms");
          });
      } else {
        vscode.window.showErrorMessage("The file is not a .js file");
      }
    } else {
      vscode.window.showErrorMessage("Error renaming file");
    }
  })
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

export default function renamePaths(previousPath, nextPath, searchInPath) {
  // const [projectRoot] = vscode.workspace.workspaceFolders;
  vscode.workspace.getConfiguration()
  const userOptions = getUserOptions();
  const paths = buildPathsToRename(previousPath, nextPath);
  const res = renameAndTransform(
    previousPath,
    nextPath,
    searchInPath,
    // projectRoot.uri.path,
    paths,
    userOptions
  );
  return res;
  // syncChangesWithGit(projectRoot);
}
function getUserOptions() {
  return {
    // cpus: 8,
    extensions: "js",
    // ignoreConfig: [".gitignore"],
    ignorePattern: [...Object.keys(vscode.workspace.getConfiguration().files.exclude)],
    runInBand: "true"
  };
}







'use strict';

const fs = require('fs');
const path = require('path');

const currentDirectory = process.cwd();

fs.readdir(currentDirectory, function (err, folders) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  // filter folders that dont match naming conventions
  const regexReversedFolderName = RegExp(
    '((0[1-9]|[12]\\d|3[01])-(0[1-9]|1[0-2])-\\d{4})'
  );
  const foldersToReverse = folders.filter((folderName) =>
    regexReversedFolderName.test(folderName)
  );

  // reverse the name of the folder
  foldersToReverse.forEach(function (folderName) {
    const reversedName = folderName.split('-').reverse().join('-');
    const currentPath = path.join(currentDirectory, folderName);
    let futurePath = path.join(currentDirectory, reversedName);
    let futurePathWithIndex = futurePath;
    let hasToBeRenamed = true;
    let index = 1;

    do {
      if (fs.existsSync(futurePathWithIndex)) {
        futurePathWithIndex = futurePath + `(${index++})`;
      } else {
        hasToBeRenamed = false;
        futurePath = futurePathWithIndex;
      }
    } while (hasToBeRenamed);

    fs.rename(currentPath, futurePath, (error) => {
      if (error) {
        return console.log('Unable to rename directory: ' + error);
      }
      console.log(`folder "${currentPath}" renamed to "${futurePath}"`);
    });
  });
});

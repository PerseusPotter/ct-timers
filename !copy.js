const fs = require('fs/promises');
const path = require('path');

const fileReg = /^(?!!).+\.(js|json)$/;
const folderReg = /^(?!!)/;
const ignored = new Set(['node_modules', 'package.json', 'package-lock.json', 'pnpm-lock.yaml']);

async function copy(src, dst) {
  let madeDir = false;

  for (const file of await fs.readdir(src, { withFileTypes: true })) {
    if (ignored.has(file.name)) continue;

    const srcPath = path.join(src, file.name);
    const dstPath = path.join(dst, file.name);
    if (file.isDirectory()) {
      if (!folderReg.test(file.name)) continue;
      copy(srcPath, dstPath);
    } else {
      if (!fileReg.test(file.name)) continue;

      if (!madeDir) {
        await fs.mkdir(dst, { recursive: true });
        madeDir = true;
      }
      await fs.copyFile(srcPath, dstPath);
    }
  }
}

const appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share');
const moduleName = path.basename(__dirname);
const dst = path.join(appdata, String.raw`.minecraft\config\ChatTriggers\modules`, moduleName);
copy('.', dst);
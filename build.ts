import shell from 'shelljs';
import * as babel from '@babel/core';
import fs from 'fs/promises';

async function main() {
  shell.rm('-rf', 'dist');
  shell.mkdir('dist');
  shell.cp(['LICENSE.txt', 'package.json'], 'dist');
  const promises: Promise<void>[] = [];
  promises.push(new Promise((resolve, reject) => {
    const tscProc = shell.exec('yarn run tsc --project ./tsconfig.prod.json', {
      async: true,
    });
    tscProc.addListener('error', reject);
    tscProc.addListener('exit', resolve);
  }))
  shell.find(['src'])
    .filter((file) => file.match(/\.tsx?$/))
    .forEach((file) => {
      promises.push((async () => {
        const outFile = file.replace(/\.tsx?$/, '.js')
          .replace('src', 'dist');
        const result = await babel.transformFileAsync(file);
        if (!result?.code) {
          throw new Error(`Failed to compile ${file}.`);
        }
        const dir = outFile.split('/').slice(0, -1).join('/');
        shell.mkdir('-p', dir);
        await fs.writeFile(outFile, result.code);
      })())
    })

  await Promise.all(promises);
}

main();

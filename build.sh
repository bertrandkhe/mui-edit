#!/bin/bash


rm -rf ./dist/
mkdir ./dist
cp LICENSE.txt package.json ./dist
yarn run tsc --project ./tsconfig.prod.json

FILES=$(find ./src -type f -name "*.ts" -o -name "*.tsx")

for FILE in $FILES
do
  DIST_FILE_1="./dist/${FILE:6}"
  DIST_FILE_2="${DIST_FILE_1%.*}.js"
  yarn run babel $FILE --out-file $DIST_FILE_2
done

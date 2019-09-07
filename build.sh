#!/bin/bash
./node_modules/.bin/gulp build
mv dist mrl-amrl.ir
zip -r dist.zip mrl-amrl.ir
rm -rf mrl-amrl.ir
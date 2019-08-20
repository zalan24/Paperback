mkdir -p build

cat \
	src/main.js \
	> build/paper.js


cp build/paper.js build/paper.compact.js
# node shrinkit.js build/paper.js > build/paper.compact.js


 ./node_modules/uglify-es/bin/uglifyjs build/paper.compact.js \
 	--compress --screw-ie8 --mangle toplevel -c --beautify --mangle-props regex='/^_/;' \
 	-o build/paper.min.beauty.js

./node_modules/uglify-es/bin/uglifyjs build/paper.compact.js \
	--compress --screw-ie8 --mangle toplevel --mangle-props regex='/^_/;' \
	-o build/paper.min.js


rm -f build/paper.zip

sed -e '/GAME_SOURCE/{r build/paper.min.js' -e 'd}' src/html-template.html > build/index.html
powershell Compress-Archive build/index.html build/paper.zip
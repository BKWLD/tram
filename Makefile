# Name phony targets to avoid name conflicts
.PHONY: build

# Build minified file w/ license
build:
	@ node_modules/uglify-js/bin/uglifyjs transition.js -m -c --comments 'license' -o transition-min.js

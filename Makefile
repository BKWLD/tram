# Name phony targets to avoid name conflicts
.PHONY: build

# Build minified file w/ license
build:
	# TODO cat header, P and footer for global/AMD
	# @ ./node_modules/.bin/uglifyjs transition.js -m -c --comments 'license' -o transition-min.js
	
# Update support scripts for examples
update:
	cp ./node_modules/pjs/src/p.js support/

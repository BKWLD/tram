# Name phony targets to avoid name conflicts
.PHONY: build

# Build minified file w/ license
build:
	# TODO cat header, P and footer
	# @ ./node_modules/.bin/uglifyjs transition.js -m -c --comments 'license' -o transition-min.js

# Config
GRUNTJS = ./node_modules/.bin/grunt
DIST_DIR = ./dist

.PHONY: all
all: clean minify

# Build minified + combined files
.PHONY: minify
minify:
	$(GRUNTJS)

# Remove dist files
.PHONY: clean
clean:
	rm -rf $(DIST_DIR)/*
	
# Update support scripts for examples
.PHONY: update
update:
	cp ./node_modules/pjs/src/p.js support/

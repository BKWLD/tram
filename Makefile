# Config
GRUNT = ./node_modules/.bin/grunt

# Watch src files during dev
.PHONY: dev
dev:
	$(GRUNT)

# Build minified + combined files
.PHONY: build
build:
	$(GRUNT) build && git add dist/*

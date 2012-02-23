test:
	./node_modules/.bin/mocha --reporter list

build:
	./node_modules/.bin/uglifyjs manacle.js > manacle.min.js

.PHONY: test build
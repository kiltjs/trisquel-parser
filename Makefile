
git_branch := $(shell git rev-parse --abbrev-ref HEAD)

.PHONY: test release

ifndef NPM_VERSION
  export NPM_VERSION=patch
endif

install:
	npm install

eslint:
	npx eslint src
	npx eslint parser.js
	npx eslint tests

lint:
	npx eslint src

test: lint
	npx mocha --require @babel/register src/*.test.js
	# npx mocha tests/*-tests.js

build:
	rm -rf dist
	npx babel src --out-dir dist --ignore src/**/*.test.js
	# npx rollup src/con-text.js \
	# 	-c rollup.config.js \
	# 	--output.format umd \
	# 	--output.file dist/con-text.umd.js \
	# 	--output.exports named \
	# 	-n conText
	# npx uglifyjs dist/con-text.umd.js --compress --mangle -o dist/con-text.min.js

npm.publish:
	echo "building ${NPM_VERSION}"
	git pull --tags
	npm version ${NPM_VERSION}
	git push origin $(git_branch) && git push --tags
	npm publish --access public

github.release: export REPOSITORY=triskeljs/parser
github.release: export PKG_VERSION=$(shell node -e "console.log('v'+require('./package.json').version);")
github.release: export RELEASE_URL=$(shell curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${GITHUB_TOKEN}" \
	-d '{"tag_name": "${PKG_VERSION}", "target_commitish": "$(git_branch)", "name": "${PKG_VERSION}", "body": "", "draft": false, "prerelease": false}' \
	-w '%{url_effective}' "https://api.github.com/repos/${REPOSITORY}/releases" )
github.release:
	@echo ${RELEASE_URL}
	@echo "\nhttps://github.com/${REPOSITORY}/releases/tag/${PKG_VERSION}\n"

release: test npm.publish github.release

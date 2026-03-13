setup:
	@yarn install

dev:
	@yarn start

dev-android:
	@yarn android

dev-ios:
	@yarn ios

format:
	@yarn format

lint:
	@yarn lint

typecheck:
	@yarn typecheck

build:
	@yarn build

test:
	@yarn test

precommit:
	@$(MAKE) format
	@$(MAKE) lint
	@$(MAKE) typecheck
	@$(MAKE) build
	@$(MAKE) test

clean:
	@yarn clean

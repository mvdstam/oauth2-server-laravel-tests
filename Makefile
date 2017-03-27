deps:
	rm -rf vendor/ node_modules/ composer.lock
	composer install
	npm install

docker:
	docker build --tag oauth2-server-laravel .
	docker-compose stop
	docker-compose rm -f
	docker-compose up -d --force-recreate --remove-orphans

tests:
	jasmine-node spec/

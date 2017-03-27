deps:
	rm -rf vendor/ node_modules/ composer.lock
	composer install
	npm install

docker:
	docker build --tag oauth2-server-laravel .
	docker-compose stop
	docker-compose rm -f
	docker-compose up -d --force-recreate --remove-orphans

db:
	docker-compose exec app sh -c "php artisan vendor:publish"
	docker-compose exec app sh -c "php artisan migrate"

tests:
	jasmine-node spec/

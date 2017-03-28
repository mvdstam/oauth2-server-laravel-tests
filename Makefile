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
	docker-compose exec app sh -c "php artisan oauth2-server:create-client --id '660cdc84-7413-485f-859f-d689154bb920' --secret '13320e3b-a2d2-4451-88f3-769b3c8d845f' --name 'Test Client'"
	docker-compose exec app sh -c "php artisan oauth2-server:create-user --username 'testuser' --password 'testpass'"

tests:
	jasmine-node spec/oauth

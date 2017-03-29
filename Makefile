deps:
	rm -rf vendor/ node_modules/ composer.lock
	sudo chown -R 775 bootstrap/cache
	composer install

docker:
	docker build --tag oauth2-server-laravel .
	docker-compose stop
	docker-compose rm -f
	docker-compose up -d --force-recreate --remove-orphans app mysql

db:
	docker-compose exec app sh -c "php artisan vendor:publish ; (exit $?)"
	docker-compose exec app sh -c "php artisan migrate ; (exit $?)"
	docker-compose exec app sh -c "php artisan oauth2-server:create-client --id '660cdc84-7413-485f-859f-d689154bb920' --secret '13320e3b-a2d2-4451-88f3-769b3c8d845f' --name 'Test Client' ; (exit $?)"
	docker-compose exec app sh -c "php artisan oauth2-server:create-user --username 'testuser' --password 'testpass' ; (exit $?)"

tests:
	docker-compose run nodejs sh -c "cd /usr/src/app ; npm install ; npm install -g jasmine-node ; jasmine-node spec/oauth ; (exit $?)"

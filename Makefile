.PHONY: start restart down build reset-docker stop insp reset update-nodejs

# javascript
dev:
	npm run dev

dev-old:
	npm run dev:old

update-nodejs:
	npm update

swagger:
	node ./src/swagger.ts
	
# Docker
build:
	docker-compose up --build

start:
	docker-compose up -d

restart:
	docker-compose stop && docker-compose up -d

stop:
	docker-compose stop

down:
	docker-compose down

reset-docker:
	docker system prune -a --volumes

insp:
	docker inspect network

adminer:
	open http://localhost:9080

phpmyadmin:
	open http://127.0.0.1/phpmyadmin/index.php
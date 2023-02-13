.PHONY: start restart down build reset-docker stop insp reset update-nodejs

update-nodejs:
	npm update

reset-prisma:
	prisma reset

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
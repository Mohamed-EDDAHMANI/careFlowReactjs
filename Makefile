# Makefile for careFlowReactjs
# Usage: make <target>

REGISTRY ?= ghcr.io
OWNER    ?= $(shell git config user.name 2>/dev/null || echo unknown)
TAG      ?= latest
IMAGE    ?= $(REGISTRY)/$(OWNER)/careflow-app
COMPOSE  ?= docker compose

.PHONY: help build dev lint test docker-build docker-run docker-push compose-build-only compose-up compose-up-only compose-down dev-up dev-logs clean preview

help:
	@sed -n '1,120p' Makefile | sed -n '1,120p'

docker-build:
	docker build -t $(IMAGE):$(TAG) -f Dockerfile .

docker-run:
	docker run --rm -p 3000:80 --name careflow-prod $(IMAGE):$(TAG)

docker-push:
	@if [ "$(TAG)" = "" ]; then echo "Please set TAG (e.g. make docker-push TAG=latest)"; exit 1; fi
	docker push $(IMAGE):$(TAG)

logs:
	$(COMPOSE) logs -f

dev-logs:
	$(COMPOSE) logs -f dev

logs-tail:
	$(COMPOSE) logs --tail=100 dev

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up -d

up-build:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

dev-up:
	$(COMPOSE) up --build dev

clean:
	rm -rf dist

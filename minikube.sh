#!/bin/bash
minikube start
eval $(minikube docker-env)
docker build -t web .
kubectl create -f env-configmap.yaml,mongo-deployment.yaml,mongo-service.yaml,web-deployment.yaml,web-service.yaml
minikube service web
minikube dashboard

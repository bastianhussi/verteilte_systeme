#!/bin/bash

# NOTE: this skript doesn't work properly!
# This script is an attempt to run this app using kubernetes and minikube.
# All pods and deployments start flawlessly, but the web service cannot make use of the configmap.

minikube start

eval $(minikube docker-env)
# build Image inside of minikube
docker build -t web .

kubectl create -f env-configmap.yaml,mongo-deployment.yaml,mongo-service.yaml,web-deployment.yaml,web-service.yaml

# open app and dashboard in browser
minikube service web
minikube dashboard

## Prerequisites

The following tools will needed:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [AWS](https://console.aws.amazon.com/)  account
	- Have an S3 bucket with the necessary permissions and policies
	- Have an RDS instance with Postgres
- [DockerHub](https://hub.docker.com/)  account

It is necessary create the following folder and files:

 - /config/configmap: contains environment variables
 - /config/credentials: contains AWS credentials
 - /config/POSTGRES_PASSWORD: contains DB password
 - /config/POSTGRES_USERNAME: contains DB user

Sample for configmap file (replace the values with your environment values):

    UDAGRAM_BUCKET=YOUR_AWS_BUCKET_NAME
    UDAGRAM_PROFILE=YOUR_AWS_PROFILE_NAME
    UDAGRAM_REGION=YOUR_AWS_REGION
    POSTGRES_DB=YOUR_POSTGRES_DB_NAME
    POSTGRES_HOST=YOUR_DB_HOST_URL
    URL=http://localhost:8100

## 1. Run App with Docker and Docker Compose

Build the Docker images:

    docker-compose -f deployment/docker/docker-compose-build.yaml build --parallel

Run the containers:

    docker-compose -f deployment/docker/docker-compose.yaml up

Check the app at [http://localhost:8100](http://localhost:8100/)

Delete the containers:

    docker container kill $(docker ps -q)

## 2. Run App with Kubernetes

Create secret for DB variables:

    kubectl create secret generic env-secret --from-file=./config/POSTGRES_PASSWORD --from-file=./config/POSTGRES_USERNAME

Create secret for AWS credentials:

    kubectl create secret generic aws-secret --from-file=./config/credentials

Create configmap for environment variables:

    kubectl create configmap env-configmap --from-env-file=./config/configmap

Deploy Kubernetes app cluster:

    kubectl apply -f deployment/k8s/backend-feed-deployment.yaml
    kubectl apply -f deployment/k8s/backend-feed-service.yaml
    kubectl apply -f deployment/k8s/backend-user-deployment.yaml
    kubectl apply -f deployment/k8s/backend-user-service.yaml
    kubectl apply -f deployment/k8s/reverseproxy-deployment.yaml
    kubectl apply -f deployment/k8s/reverseproxy-service.yaml
    kubectl apply -f deployment/k8s/frontend-deployment.yaml
    kubectl apply -f deployment/k8s/frontend-service.yaml

Check cluster resources:

    kubectl get deployment
    kubectl get pod
    kubectl get svc

Open two terminals and run:

    kubectl port-forward service/frontend 8100:8100
    kubectl port-forward service/reverseproxy 8080:8080

Check the app at [http://localhost:8100](http://localhost:8100/)

## 3. Kubernetes: A/B Testing

Checkout the branch canary-deployment:

    git checkout canary-deployment

Create a deployment for the "green" environment:

    kubectl apply -f deployment/k8s/frontend-deployment-v2.yaml

Check the two apps are running (Kubernetes distributes traffic between two apps):

    kubectl get deployment
    kubectl get pod

Delete "green" deployment:

    kubectl delete deployment frontend-v2

## 4. Kubernetes: Rolling update

Checkout the branch canary-deployment:

    git checkout rolling-update

Apply the changes:

    kubectl apply -f deployment/k8s/frontend-deployment.yaml

Check deployment and pods:

    kubectl get deployment
    kubectl get pod
    kubectl describe deployment frontend

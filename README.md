# CloudOBS UI client

UI client for [cloudobs](https://github.com/ALLATRA-IT/cloudobs) project.

## Running the project locally

- Clone the repository:

  `git clone git@github.com:ALLATRA-IT/cloudobs-client.git`


- Go to the folder:

  `cd cloudobs-client`

- Run `npm install`

- After install, run `npm start`. The project will start on `localhost:3000`

## Docker mode
### Native
```
docker build -t $(basename $(pwd)) . --no-cache
docker run -p 3000:3000 $(basename $(pwd))
```

### Docker Compose for server and ui
A complex solution to have both, server and ui control on the one host.

```
# Use different directory to clone
git clone https://github.com/ALLATRA-IT/cloudobs.git && cd cloudobs
docker build -t $(basename $(pwd)) . --no-cache
```
```
# Get back to the repository directory
cd cloudobs-client
docker build -t $(basename $(pwd)) . --no-cache
```

* Check you have all required images using command `docker images`
```
# You should see something like that
REPOSITORY        TAG       IMAGE ID       CREATED          SIZE
cloudobs-client   latest    5ac92675e9b0   27 minutes ago   383MB
cloudobs          latest    310b6bcc7d97   46 minutes ago   394MB
```

* Then start compose
```
git clone git@github.com:ALLATRA-IT/cloudobs-infrastructure.git --depth 1
cp cloudobs-infrastructure/shared/files/docker-compose.yml .
ENVIRONMENT=prod BACKEND_PORT=5000 FRONTEND_PORT=3000 docker compose up -d
```
* Open http://localhost:3003

# CI/CD Secrets setup

```
gh secret set PRIVATE_SSH_KEY --body "<PRIVATE SSH KEY AS IS>" -r ALLATRA-IT/cloudobs-client
gh secret set PROD_HOST_IP --body "<HOST IP>" -r ALLATRA-IT/cloudobs-client
```

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
```
docker build -t $(basename $(pwd)) . --no-cache
docker run -p 3000:3000 $(basename $(pwd))
```

## Getting Started

First, install all dependencies:

```bash
npm install
#or
yarn install
```

Then, start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Working with Docker

Due to the need of a database a second Docker image is required to run this app.
The Image for this Nextjs App will be build with the Dockerfile at the project root.
To run this app using Docker we recommand using docker-compose:

```bash
# on Mac or Linux:
sudo docker-compose up
# on Windows:
docker-compose up
```

## Deploying on Azure

...
## Getting Started

There are multiple ways to run this application:

1. Docker
2. Azure
3. Install manually

When choosing the 1. or the 3. option you will need to have an ".env"-file in this projects root directory.
An template on how to structure this file can be found in .env.template. Lines that are required, or optional are descripted in this template file. A minimal working .env file could look like this:

```
JWT_SECRET=super-secret-pass
ADMIN_EMAIL=john@doe.com
ADMIN_PASSWORD=1234
```

If you just want to get started paste these three lines in your .env file.
This way you cannot send verification emails. This is required if you want other users to be able to register or want to change your email address.

After you started the application with one of the three possible ways login with the admin email and password set in your .env-file (in this example john@doe.com and 1234).

## Working with Docker

The easiest way to run this application is with docker. You only need to have the Docker desktop client installed and running.
On Windows open Powershell with admin privileges and navigate to this projects directory.
After that just execute:

```bash
docker-compose up
```

Thats it. Docker will build the images you need and start them.
When thats done open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note:
On default the app will use http, which is fine for testing on a local machine.
If you want to use https instead change line 5 to

```
command: npm run start
```

and add

```
- NODE_ENV=production
```

to the environments of the web service.

## Deploying on Azure

If you don't want to install and run this app locally, just visit our running instance on Azure:
[https://azure.microsoft.com](https://azure.microsoft.com)
Either register a new account with your email address (you will receive a verification email), or use
our preconfigurated admin account (email: john@doe.com, password: super-secure-admin-pa\$\$)

## Installing manually

To run this app manually (without docker) please make sure you have a local MongoDB instance running.
If you work for example with MongoDB Atlas please change the url in your .env-file.
The easiest way to setup MongoDB is with docker:

```bash
docker run -p 27017:27017 -d mongo:4.2.6-bionic
```

When you have a MongoDB instance up and running simply install

```bash
npm install --save-prod
# no need for development dependencies
```

Then, start the development server:

```bash
npm run dev
```

When thats done open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
If you choose to run the app in development mode you have to refresh your browser after loggin in the first time.
This behavior occurres because Nextjs only renders pages if necessary.

If you want this application to run in production mode you have to run these command instead

```bash
npm run build
npm run start
# Note: this will start the app using https
```

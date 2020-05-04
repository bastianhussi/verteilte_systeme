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

On default the app will be using https. If you cant use https (e.g running this locally) you have to delete line 14 in the docker-compose.yml file.

Thats it. Docker will build the images you need and start them. 
When thats done open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploying on Azure

...


## Installing manually

There are two ways to run this app manually:
In production- or in development mode.
In booth ways you need an local MongoDB Service running at localhost:27017.

```bash
npm install
```

Then, start the development server:

```bash
npm run dev
```

If you want this application to run in production mode you have to run these command instead

```bash
npm ci --only=production
npm run build
# This ways the app will work with http. 
npm run start 
# If you want to use https instead please execute this command instead:
NODE_ENV=production npm run start 
```
When thats done open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
If you choose to run the app in development mode you have to refresh your browser after loggin in the first time.
This behavior occurres because Nextjs only renders pages if necessary.
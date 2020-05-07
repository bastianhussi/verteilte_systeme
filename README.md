## Getting Started

There are multiple ways to run this application:

1. Docker
2. Azure
3. Manually

## Docker

The easiest way to run this application is with docker. You only need to have the Docker desktop client installed and running.
On Windows open Powershell with admin privileges and navigate to this projects directory.
After that just execute:

```bash
docker-compose up
```

Thats it. Docker will build the images you need and start them.
When thats done open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Login with:         planer@dhbw-stuttgart.de 
and password:       1234


Note:
You may have to refresh your page after loggin in the first time.
This behavior only occurres in development mode, because Nextjs only renders pages if necessary.

On default the app will use http, which is fine for testing on a local machine.
If you want to use https instead change line 5 of your docker-compose.yml file to

```
command: npm run start
```

## Azure

If you don't want to install and run this app locally, just visit our running instance on Azure:
[https://dhbw-planer.westeurope.cloudapp.azure.com](https://dhbw-planer.westeurope.cloudapp.azure.com)

Login with:         planer@dhbw-stuttgart.de 
and password:       1234

Or register a new account (You may need to check your spam filter for the verfication email)

## Manually

To run this app without Docker please make sure you have nodejs and npm installed. 
You also need a local MongoDB instance running.
If the address of your MongoDB instance is not "mongodb://localhost:27017",
please change the second line of your .env file to 
```
MONGO_HOST=mongodb://your_url:port
```
Normally the defaults in your .env file should work out of the box.

Now simply install all dependencies...

```bash
# no need for development dependencies
npm install --save-prod
```

... and start the development server:

```bash
npm run dev
```

When thats done open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Login with:         planer@dhbw-stuttgart.de 
and password:       1234

(you also find these credentials in the .env file at ADMIN_EMAIL=... and ADMIN_PASSWORD=...)


Note:
You may have to refresh your page after loggin in the first time.
This behavior only occurres in development mode, because Nextjs only renders pages if necessary.

On default the app will use http, which is fine for testing on a local machine.
If you want to use https instead please execute:

```bash
npm run build
npm run start
```

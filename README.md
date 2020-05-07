## Getting Started

There are multiple ways to run this application:

1. Docker
2. Azure
3. Manually

Note: when using Docker or installing manually please make sure your .env file is working.
In this file all configurations linke Admin email and password are set. 
The default values should be fine in most cases.
If you want to register new accounts, besides the admin account, you have to add valid credentials
to an smtp server at SMTP_HOST, SMTP_USER, SMTP_PASSWORD (SMTP_PORT, SMTP_SECURE are ok for most setups).

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
<br />
and password:       1234

On default the app will use http, which is fine for testing on a local machine.
If you want to use https instead, add this environment variable to your docker-compose.yml:

```
- NODE_ENV=production 
```

## Azure

If you don't want to install and run this app locally, just visit our running instance on Azure:
[https://dhbw-planer.westeurope.cloudapp.azure.com](https://dhbw-planer.westeurope.cloudapp.azure.com)

Login with:         planer@dhbw-stuttgart.de
<br />
and password:       1234

Or register a new account (You may need to check your spam filter for the verfication email).

## Manually

To run this app without Docker please make sure you have nodejs and npm installed. 
You also need a local MongoDB instance running.
If the address of your MongoDB instance is not "mongodb://localhost:27017",
please change the second line of your .env file to 

```
MONGO_HOST=mongodb://your_url:port
```

The default values in your .env file should work out of the box normally.
Now simply install all dependencies...

```bash
# no need for development dependencies
npm install --save-prod
```

... and start the development server:

```bash
npm run start
```

When thats done open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Login with:         planer@dhbw-stuttgart.de 
and password:       1234

On default the app will use http, which is fine for testing on a local machine.
If you want to use https instead please execute:

```bash
NODE_ENV=production npm run start
```

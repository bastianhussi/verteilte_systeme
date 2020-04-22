FROM node:13

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 3000

ENV JWT_SECRET MsbHREU5sNtC3WENuV8JqgVJxXdyPPsGESaEu
ENV MONGO_HOST mongodb://localhost:27017 
ENV MONGO_DB nextjs
ENV SMTP_HOST unvalid smpt host
ENV SMTP_PORT 465
ENV SMTP_SECURE true
ENV SMTP_USER unvalid smtp user
ENV SMTP_PASSWORD unvalid smtp pass
ENV ADMIN_EMAIL john@doe.com
ENV ADMIN_NAME root
ENV ADMIN_PASSWORD 123

CMD  npm run start JWT_SECRET=${JWT_SECRET} MONGO_HOST=${MONGO_HOST} MONGO_DB=${MONGO_DB} SMTP_HOST=${SMTP_HOST} SMTP_PORT=${SMTP_PORT} SMTP_SECURE=${SMTP_SECURE} SMTP_USER=${SMTP_USER} SMTP_PASSWORD=${SMTP_PASSWORD} ADMIN_EMAIL=${ADMIN_EMAIL} ADMIN_NAME=${ADMIN_NAME} ADMIN_PASSWORD=${ADMIN_PASSWORD} 

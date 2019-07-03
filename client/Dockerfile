## BUILD##
FROM node:8 as build

RUN mkdir -p /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /usr/src/app/

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

#CMD [ "npm", "run-script build" ]
RUN yarn build

##DEPLOY##
#define base image to start from
FROM nginx:1.12-alpine

#remove the default nginx config and replace with the project config
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginxReactRouter.conf /etc/nginx/conf.d/nginxReactRouter.conf

#make a directory for the certs, set permissions, and copy certs to container
RUN mkdir /etc/nginx/ssl
RUN chown -R root:root /etc/nginx/ssl
RUN chmod -R 600 /etc/nginx/ssl
COPY ./certs/* /etc/nginx/ssl/

#change to the app directory
WORKDIR /usr/src/app

#copy the code over
COPY --from=build /usr/src/app/build/ /usr/share/nginx/html

#expose the port from the container and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
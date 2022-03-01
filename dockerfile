# First, download the official node.js image and install all the relevant dependencies and build the app
FROM node:16.9.1 as build
WORKDIR /usr/src/app/

RUN mkdir client
COPY ["package.json", "package-lock.json", "./"]
COPY ["client/package.json", "client/package-lock.json", "./client"]

RUN npm install
# Build the React app
RUN cd client && npm install && cd ..

COPY . .
RUN npm run build

# Remove dev dependencies to minimize the image size
RUN rm -r node_modules
RUN npm install --only=prod

# Build stage 2, copy the relevant data into a lightweight Alpine version of node.js (< 10% of the size of the official image)
FROM node:16.9.1-alpine
WORKDIR /usr/src/app/
COPY ["package.json", "./"]
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/client/build ./client/build
ADD .env.docker .env
CMD ["npm", "start"]

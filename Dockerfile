FROM node:16 as build

WORKDIR /usr/app
COPY . .
RUN npm install

FROM node:alpine as main

COPY --from=build /usr/app /
COPY . .
RUN ENV BASE_URL=https://isec.bhashith.me/
EXPOSE 8080
CMD ["node", "app.js"]
FROM node:10 as build

WORKDIR /app
COPY . .
RUN npm install

FROM node:10

COPY --from=build /app /
EXPOSE 3000
CMD ["npm","start"]

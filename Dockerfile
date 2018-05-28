FROM node:8-alpine AS base
WORKDIR /code
EXPOSE 4000


FROM base AS build
RUN apk add --no-cache bash make g++ python
COPY package.json yarn.lock ./
RUN yarn install --production=false
COPY tsconfig.json .sequelizerc ./
COPY config/ ./config
COPY migrations/ ./migrations
COPY src/ ./src
COPY files/ ./files
RUN yarn compile

FROM build as clean
RUN yarn install --production
RUN rm -rf ./src

FROM base AS production
LABEL Name="ComparaOnline test" Version="2.0"
ARG ENVIRONMENT="production"
ENV NODE_ENV=${ENVIRONMENT}
COPY --from=clean /code ./
CMD ["node", "build/index.js"]

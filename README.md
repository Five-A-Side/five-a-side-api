<p align="center">
  <a target="blank"><img src="https://i.imgur.com/dqHthFn.png" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
    A microservice responsible for creating teams and scheduling football matches with your teammates.
</p>

[![Deployment status](https://github.com/Five-A-Side/five-a-side-api/actions/workflows/kci-pipeline.yml/badge.svg)](https://github.com/Five-A-Side/five-a-side-api/actions/workflows/kci-pipeline.yml)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
  - [MVP 🚀](#mvp-)
  - [Nice-to-haves ⭐](#nice-to-haves-)
- [Microservice Architecture ☁️](#microservice-architecture-️)
- [For developers](#for-developers)
  - [Description](#description)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
    - [Docker](#docker)
    - [Development](#development)
    - [Watch mode](#watch-mode)
    - [Production mode](#production-mode)
  - [Test](#test)
    - [Unit tests](#unit-tests)
    - [e2e tests](#e2e-tests)
    - [Test coverage](#test-coverage)

## Features

### MVP 🚀

- [ ] Create and manage teams, where team members can be invited and added to the group;
- [ ] Schedule matches and invite team members to join;
- [ ] Send push notifications to team members when a match is scheduled;
- [ ] Find and invite nearby players to join the match, in case a team member can't make it and a replacement is needed;
- [ ] Players to RSVP to the match, indicating whether they can make it or not;
- [ ] Keep score and track statistics of the matches, such as goals scored, assists, etc. [GOALS is the most important];
- [ ] Have the possibility of a player to see the available open matches in real time;

### Nice-to-haves ⭐

- [ ] Track the attendance of each player, to see who is most available to play;
- [ ] View the location of the match, with directions to the field;
- [ ] Rate their teammates, to help build a sense of community among players;
- [ ] Rate the opposing team, to help build a sense of community among players;
- [ ] Players to leave comments and feedback after the match;

# For developers

## Description

Built with [NestJS](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
npm install
```

## Running the app

### Docker

If you don't want to debug just run the service through docker with the command

```bash
docker compose up
```

Otherwise, at least make sure the `mongodb` service is running

```bash
docker compose up mongodb
```

### Development

```bash
npm run start
```

### Watch mode

```bash
npm run start:dev
```

### Production mode

```bash
npm run start:prod
```

## Test

### Unit tests

```bash
npm run test
```

### e2e tests

```bash
npm run test:e2e
```

### Test coverage

```bash
npm run test:cov
```

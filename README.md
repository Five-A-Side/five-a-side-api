# five-a-side API ⚽️

![five-a-side-logo-white-bg](https://i.imgur.com/mBFnoZ9.png)

Microservice responsible for creating teams and scheduling football matches with your teammates.

## Table of Contents
- [five-a-side API ⚽️](#five-a-side-api-️)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [MVP 🚀](#mvp-)
    - [Nice-to-haves ⭐](#nice-to-haves-)
  - [Microservice Architecture ☁️](#microservice-architecture-️)
- [For developers](#for-developers)
  - [Description](#description)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
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


## Microservice Architecture ☁️

# For developers
## Description

Built with [NestJS](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
npm install
```

## Running the app

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

# MetaphaseJS Demo

Demostration of MetaphaseJS framework ( **ALPHA VERSION** ).

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

**MetaphaseJS** is a super easy, efficient and agnostic state manager for Javascript. It can be used with React, Angular o vanilla JS. In this demo ReactJS and Typescript have been used.

## Demo

- :computer: [Use this link to access the demo](https://yagolopez.js.org/metaphasejs-react-demo/build/)
- :iphone: Or scan the QR code to load the demo in a smartphone:

<p align="center"><img src="qrcode-metaphasejs-demo-small.jpg"/></p>

## Motivation

- State management is an issue solved decades ago in server-side environments using transactional and relational databases. This is not the case client-side (browser) where it has remained as an unsolved issue until the adventment of libraries/patterns like Redux/Flux
- These other client state managers like Redux are verbose and complicated (inmutability is verbose and adds complexity) and they are basically reinventing the wheel
- There are other client databases (IndexDB, LovefieldDB, etc.) but they are complicated too (callbacks, asynchrony) or incomplete (localStorage)
- The intention of MetaphaseJS is to apply the same techniques of server-side state management to client-side apps.

## Features

- Simplicity: no callbacks, no asynchronous code, no functional nor inmutable complexities 

- Agnostic and frameworkless: it can be used with ReactJS, Angular, Vue, React Native, vanilla JS, etc.

  Simply plug-and-play

- State is a true SQLite relational database

- Manage state with simple SQL queries using an ORM (Object Relational Mapper)

- State can be saved to a database file

- State can be designed with any db tool that supports SQLite (even using a graphical UI without using code), then it can be filled with data, and imported into app

- Big developer productivity and satisfacction. (For example, an entire blog sistem can be developed in minutes)

- Ideal for static generated content (i. e.: static blogs without a server database)

- Comprehensive and switchable logger system. (it can be turned off in production for better performance)

## Requirements

- Yarn package manager (or NPM)

## Installation

- Clone the project
- Run `yarn` in the project directory

## Usage

- Run `yarn start`
- Test `yarn test`

## Contributing

1. Fork it
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Docs

TODO: generate API documentation with TypeDoc

## Credits

TODO: write credits

## License

MIT

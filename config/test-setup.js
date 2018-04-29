// const enzyme = require("enzyme");
// const Adapter = require("enzyme-adapter-react-16");
// enzyme.configure({ adapter: new Adapter() });

const yagoLogger = require('../src/orm/yago.logger');

// console.log('☑ LOG OF QUERIES SUPPRESSED');

// Jest needs to mock console.table() to avoid errors
console.table = jest.fn();

// Similar to "jest --slient" CLI flag
yagoLogger.disableConsole();


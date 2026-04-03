const authPaths = require('./authPaths');
const appointmentPaths = require('./appointmentPaths');
const servicePaths = require('./servicePaths');
const staffPaths = require('./staffPaths');
const clientPaths = require('./clientPaths');
const productPaths = require('./productPaths');
const orderPaths = require('./orderPaths');
const leavePaths = require('./leavePaths');
const specializationPaths = require('./specializationPaths');
const miscPaths = require('./miscPaths');
const socketPaths = require('../socket/socketPaths');

module.exports = {
    ...authPaths,
    ...appointmentPaths,
    ...servicePaths,
    ...staffPaths,
    ...clientPaths,
    ...productPaths,
    ...orderPaths,
    ...leavePaths,
    ...specializationPaths,
    ...miscPaths,
    ...socketPaths
};

"use strict";
exports.__esModule = true;
var async_1 = require("async");
var child_process_1 = require("child_process");
console.log('starting...');
async_1.series([
    function () { return child_process_1.exec('npm run dev --prefix ../../frontend'); },
    function () { return child_process_1.exec('npm test'); },
]);

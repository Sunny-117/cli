
const fs = require('fs');
const path = require('path');
module.exports.isDirExist = function (ProjectName) {
    fs.access(path.resolve(process.cwd(), ProjectName), fs.constants.F_OK, (err) => {
        if (err) {
            return false
        } else {
            return true
        }
    });
}
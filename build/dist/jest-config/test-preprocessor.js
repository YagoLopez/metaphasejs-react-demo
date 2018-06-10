var tsc = require("typescript");
var tsConfig = require("../tsconfig.test.json");
module.exports = {
    process: function (src, path) {
        if (path.endsWith(".ts") || path.endsWith(".tsx") || path.endsWith(".js")) {
            return tsc.transpile(src, tsConfig.compilerOptions, path, []);
        }
        return src;
    },
};
//# sourceMappingURL=test-preprocessor.js.map

// https://facebook.github.io/jest/docs/en/configuration.html#content

module.exports = {
    "moduleFileExtensions": [
        "js",
        "jsx",
        "json"
    ],
    "moduleDirectories": [
        "node_modules",
        "src"
    ],
    "moduleNameMapper": {
        "^.+\\.(css|scss)$": "<rootDir>/test/styleMock.js",
        "^.+\\.(jpg|jpeg|gif|png|svg|eot|ttf|woff|woff2|)$": "<rootDir>/test/imageMock.js"
    }
};
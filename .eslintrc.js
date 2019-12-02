
module.exports = {
  "parserOptions": {
    "ecmaVersion": 9,
    "sourceType": "module",
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-console": ["warn"],
    "no-unexpected-multiline": "error",
    "no-irregular-whitespace": "off",
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    // "semi": [
    //   "error",
    //   "always"
    // ],
    "semi": [
      "error",
      "never"
    ],
    // "no-unused-vars": 0
    "no-unused-vars": [
      "error",
      {
          "args": "after-used",
          "argsIgnorePattern": "^_\\w+"
      }
    ]
  },
  "overrides": [
    {
      "files": ["{,**/}*.test.js"],
      "globals": {
        process: true,
        describe: true,
        it: true,
        __filename: true,
        console: true,
      },
    },
  ]
}

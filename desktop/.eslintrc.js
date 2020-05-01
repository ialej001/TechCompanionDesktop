module.exports = {
  root: true, 
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  extends: ["plugin:prettier/recommended", "plugin:vue/base"],
  globals: {
    __static: true
  },
  rules: {
    // allow paren-less arrow functions
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0,
    // allow debugger during development
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0
  },
  plugins: [
    "vue"
  ]
};

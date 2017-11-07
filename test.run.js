const { email, password } = require("./config.json");

const util = require("util");

const lingualeoApi = require("./lib/lingualeo");

const WORD = "api";

console.log(`Test runner will use credentials: ${email} : ${password}`);

lingualeoApi
  .login(email, password)
  // .then(data => console.log("Login:", util.inspect(data)))
  .then(_ => lingualeoApi.getTranslates(WORD))
  .then(data => {
    console.log(`Translates for ${WORD}`, util.inspect(data));
    return data;
  })
  .then(list => lingualeoApi.addWord(WORD, list[0].value))
  .then(data => console.log("addWord", util.inspect(data)))
  .catch(err => console.error("Error", err));

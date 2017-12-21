const { email, password } = require("./config.json");

const util = require("util");

const lingualeoApi = require("./lib/lingualeo");

const WORD = "api";
const RU_WORD = "программист";
const WORD_SET_TITLE = "test word set";

console.log(`Test runner will use credentials: ${email} : ${password}`);

lingualeoApi
  .login(email, password)
  // .then(data => console.log("Login:", util.inspect(data)))
  .then(_ => lingualeoApi.getTranslates(WORD))
  .then(data => {
    console.log(`Translates for ${WORD}`, util.inspect(data.value));
    return data;
  })
  .then(list => lingualeoApi.addWord(WORD, list[0].value))
  .then(data => console.log("addWord", util.inspect(data.text)))
  .then(list => lingualeoApi.translate(RU_WORD, "ru", "en"))
  .then(translation =>
    console.log(
      `translation for "${RU_WORD}" from 'ru' to 'en' is "${translation}"`
    )
  )
  .then(() => lingualeoApi.addWordSet(WORD_SET_TITLE))
  .then(wordset =>
    console.log(`Wordset #${wordset.id} with title "${wordset.name}" was added`)
  )
  .catch(err => console.error("Error", err));

const request = require("superagent");

const LOGIN_URL = "http://api.lingualeo.com/api/login";
const GET_TRANSLATES_URL = "http://api.lingualeo.com/gettranslates";
const ADD_WORD_URL = "http://api.lingualeo.com/addword";

const agent = request.agent();

const login = (email, password) =>
  agent.get(LOGIN_URL).query({ email, password });

const getTranslates = word =>
  agent
    .get(GET_TRANSLATES_URL)
    .query({
      word
    })
    .then(res => res.body.translate);

const addWord = (word, tword, context = "") =>
  agent.get(ADD_WORD_URL).query({
    word,
    tword,
    context
  });

const translate = (word, sourceLang = "en", targetLang = "ru") =>
  agent
    .get(
      `https://lingualeo.com/translate.php?q=${encodeURIComponent(
        word
      )}&from=&source=${sourceLang}&target=${targetLang}`
    )
    .then(res => res.body.translation);

module.exports = {
  login,
  getTranslates,
  translate,
  addWord
};

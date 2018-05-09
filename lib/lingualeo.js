const request = require('superagent');

const LOGIN_URL = 'http://api.lingualeo.com/api/login';
const GET_TRANSLATES_URL = 'http://api.lingualeo.com/gettranslates';
const ADD_WORD_URL = 'http://api.lingualeo.com/addword';
const ADD_WORD_SET = 'http://lingualeo.com/userdict3/createWordSet';

const agent = request.agent();

const login = (email, password) =>
  agent
    .get(LOGIN_URL)
    .query({ email, password })
    .then(res => res.body)
    .then(result => {
      if (result.error_msg) {
        throw new Error(result.error_msg);
        return;
      }
      return result;
    });

const getTranslates = word =>
  agent
    .get(GET_TRANSLATES_URL)
    .query({
      word,
    })
    .then(res => res.body.translate);

const addWord = (word, tword, context = '') =>
  agent.get(ADD_WORD_URL).query({
    word,
    tword,
    context,
  });

const translate = (word, sourceLang = 'en', targetLang = 'ru') =>
  agent
    .get(
      `https://lingualeo.com/translate.php?q=${encodeURIComponent(
        word,
      )}&from=&source=${sourceLang}&target=${targetLang}`,
    )
    .then(res => res.body.translation);

const addWordSet = title => {
  return agent
    .get(ADD_WORD_SET)
    .query({ 'wordSet[name]': title })
    .then(res => res.body)
    .then(result => {
      if (result.error_msg) {
        throw new Error(result.error_msg);
      }
      if (!result.result || !result.result.id) {
        throw new Error(result);
      }
      return result.result;
    });
};

module.exports = {
  login,
  getTranslates,
  translate,
  addWord,
  addWordSet,
};

const request = require("superagent");

const LOGIN_URL = "http://api.lingualeo.com/api/login";
const GET_TRANSLATES_URL = "http://api.lingualeo.com/gettranslates";

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

module.exports = {
  login,
  getTranslates
};

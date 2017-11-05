const request = require("superagent");

const LOGIN_URL = "http://api.lingualeo.com/api/login";

const agent = request.agent();

const login = (email, password) =>
  agent.get(LOGIN_URL).query({ email, password });

module.exports = {
  login
};

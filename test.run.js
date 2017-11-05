const { email, password } = require("./config.json");
const lingualeoApi = require("./lib/lingualeo");

console.log(`Test runner will use credentials: ${email} : ${password}`);

lingualeoApi
  .login(email, password)
  .then(data => console.log("Login:", JSON.stringify(data)))
  .catch(err => console.error("Error", err));

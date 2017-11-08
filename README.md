# Lingualeo.ru API

Small wrapper for Lingualeo.ru. 

Thus Lingualeo has no public API - it's just a number of functions, which allow to do some stuff. More information might be found at sources of [Lingualeo Chrome Addon](https://chrome.google.com/webstore/detail/lingualeo-english-transla/nglbhlefjhcjockellmeclkcijildjhi?utm_source=chrome-ntp-icon)

***Usage example:***

```javascript
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
```

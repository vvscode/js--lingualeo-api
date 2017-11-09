/**
 * Use like
 * depends on http://kangoextensions.com/
 * var llS = new LingualeoServer('http://api.lingualeo.com', 'ru')
 * @param {*} apiUrl fe 'http://api.lingualeo.com'
 * @param {*} currentLanguage 'ru'
 */
const lingualeo = {
  addArgumentsToUrl(url, args = {}) {
    const c = Object.keys(args)
      .map(a => `${a}=${encodeURIComponent(args[a])}`)
      .join("&");
    return c ? url + this.getQueryParamsDelimiter(url) + c : url;
  },
  config: {
    debug: !1,
    domain: `http://${a}`,
    api: b,
    modules: {
      llLyrics: !0,
      llYoutube: !1,
      llSimplified: !0
    },
    path: {
      root: "?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=popup",
      login:
        "/login?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=options",
      profile:
        "/profile?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=logindialog",
      registerViaExtension: "?utm_source=ll_plugin&utm_medium=plugin",
      meatballs:
        "/meatballs?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=nomeatballsdialog",
      dictionaryFromInternet:
        "/glossary/learn/internet?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=simplifiedcontent#{originalText}",
      forgotPass:
        "/password/forgot?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=logindialog",
      goldStatus:
        "/gold?utm_source=ll_plugin&utm_medium=plugin&utm_campaign=wizardmanager",
      youtubeExport: "/content/addVideoContent",
      images: "https://d144fqpiyasmrr.cloudfront.net/plugins/all/images",
      audio_player:
        "https://d144fqpiyasmrr.cloudfront.net/plugins/all/flash/1.html#sound="
    },
    ajax: {
      isAuth: "/isauthorized",
      login: "/api/login",
      addWordToDict: "/addword",
      addWordToDictMultiple: "/addwords",
      translate: "/translate.php",
      getTranslations: "/gettranslates",
      setChromeHideCookie: "/setChromeHideCookie",
      getUntrainedWordsCount: "/getUntrainedWordsCount",
      checkSiteNotifications: `${b}/user/{user_id}/notifications/unread`,
      youtubeCaptionsInfo:
        "http://www.youtube.com/api/timedtext?type=list&v={id}"
    },
    userStorageDataPrefix: "user_",
    userStorageData: {
      user_id: {},
      fname: {},
      nickname: {
        persistent: !0
      },
      avatar: {},
      avatar_mini: {},
      lang_native: {
        persistent: !0,
        broadcastMessage: "nativeLanguageUpdated"
      },
      lang_interface: {
        persistent: !0,
        broadcastMessage: "localeMessagesUpdated"
      }
    },
    notificationTimeout: 6e3,
    maxTextLengthToTranslate: 255,
    simplifiedContentMaxWidth: 800,
    simplifiedContentBlurBackground: !1,
    defaultExportedYoutubeContentGenre: 12,
    untrainedWordsCheckingTimeout: 72e5,
    languageDetectionTimeout: 6e3,
    localDictionaryMaxWordsCount: 20
  }
};

const LingualeoServer = function(
  apiUrl = "http://api.lingualeo.com",
  targetLanguage = "ru"
) {
  const postAjaxData = (url, options) =>
    makeAjaxRequest(
      "POST",
      lingualeo.addArgumentsToUrl(url, { port }),
      options
    );
  const makeAjaxRequest = (method, url, options) => {
    if ("undefined" === typeof options.params || null === options.params)
      options.params = {};
    options.params.port = port;
    kango.xhr.send(
      {
        method,
        url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "LinguaLeo-Version": version,
          "X-Accept-Language": targetLanguage
        },
        params: options.params
      },
      xhr => {
        let data;
        if (200 !== xhr.status) {
          data = {
            error: !0,
            error_msg: `Response status error: ${xhr.status}`
          };
          this.responseStatusErrorHandler &&
            this.responseStatusErrorHandler(xhr.status, options.isSilentError);
          if (options.onError)
            options.onError(data.error_msg, null, xhr.status);
          if (options.onComplete) options.onComplete(data);
        } else if (options.isTextResponse) {
          data = { text: xhr.response || "" };
          if (options.onSuccess) options.onSuccess(data);
          if (options.onComplete) options.onComplete(data);
        } else {
          try {
            data = JSON.parse(xhr.response);
          } catch (c) {
            data = {
              error_code: 27051983,
              error_msg: "Wrong server response."
            };
          }
          if (data.error_code) {
            if (
              (this.responseErrorHandler &&
                this.responseErrorHandler(
                  data.error_msg,
                  data.error_code,
                  options.isSilentError
                ),
              options.onError)
            )
              options.onError(data.error_msg, data, xhr.status);
          } else if (options.onSuccess) options.onSuccess(data || {});
          if (options.onComplete) options.onComplete(data || {});
        }
      }
    );
  };
  var port = kango.getExtensionInfo().settings.port;
  var version = kango.getExtensionInfo().version;
  this.responseErrorHandler = this.responseStatusErrorHandler = null;
  this.setUserLocale = locale => {
    targetLanguage = locale || "ru";
  };
  this.loadTranslations = (a, onSuccess, onError) =>
    postAjaxData(apiUrl + lingualeo.config.ajax.getTranslations, {
      isSilentError: !1,
      params: {
        word: a.replace(/&/g, "%26"),
        include_media: 1,
        add_word_forms: 1
      },
      onSuccess,
      onError
    });
  this.setWordTranslation = (
    word,
    tword,
    context,
    context_url,
    context_title,
    onSuccess,
    onError
  ) =>
    postAjaxData(apiUrl + lingualeo.config.ajax.addWordToDict, {
      isSilentError: !1,
      params: {
        word,
        tword,
        context: context || "",
        context_url,
        context_title
      },
      onSuccess,
      onError
    });
  this.setWordTranslationMultiple = (a, onSuccess, onError) => {
    for (var params = [], d = 0, h; (h = a[d]); d++)
      (params[`words[${d}][word]`] = h.word),
        (params[`words[${d}][tword]`] = h.tword),
        (params[`words[${d}][context]`] = h.context),
        (params[`words[${d}][context_url]`] = h.context_url),
        (params[`words[${d}][context_title]`] = h.context_title);
    postAjaxData(apiUrl + lingualeo.config.ajax.addWordToDictMultiple, {
      isSilentError: !0,
      params,
      onSuccess,
      onError
    });
  };
  this.translateCustomText = (customText, source, target, onComplete) =>
    makeAjaxRequest("GET", apiUrl + lingualeo.config.ajax.translate, {
      isSilentError: !0,
      params: {
        q: encodeURIComponent(customText),
        source,
        target
      },
      onComplete
    });
  this.checkAuthorization = (isSilentError, onSuccess, onError) =>
    postAjaxData(apiUrl + lingualeo.config.ajax.isAuth, {
      isSilentError,
      onSuccess(a) {
        onSuccess && onSuccess(a.is_authorized);
      },
      onError
    });
  this.getUntrainedWordsCount = (onSuccess, onError) =>
    postAjaxData(apiUrl + lingualeo.config.ajax.getUntrainedWordsCount, {
      isSilentError: !0,
      onSuccess,
      onError
    });
  this.setCookieWithServer = onSuccess =>
    postAjaxData(apiUrl + lingualeo.config.ajax.setChromeHideCookie, {
      isSilentError: !0,
      onSuccess
    });
  this.login = (email, password, onComplete) =>
    postAjaxData(apiUrl + lingualeo.config.ajax.login, {
      isSilentError: !0,
      params: {
        email: encodeURIComponent(email),
        password: encodeURIComponent(password)
      },
      onComplete
    });
  this.getUserData = onComplete =>
    postAjaxData(apiUrl + lingualeo.config.ajax.login, {
      isSilentError: !0,
      onComplete
    });
  this.checkSiteNotifications = (userId, onSuccess) => {
    const url = lingualeo.config.ajax.checkSiteNotifications.replace(
      "{user_id}",
      userId
    );
    makeAjaxRequest("GET", url, { isSilentError: !0, onSuccess });
  };
  this.getYoutubeCaptionsInfo = (url, onComplete) =>
    postAjaxData(url, {
      isTextResponse: !0,
      onComplete
    });
  this.exportYoutubeContentToJungle = (contentEmbed, genreId, onComplete) =>
    postAjaxData(
      lingualeo.config.domain + lingualeo.config.path.youtubeExport,
      {
        params: { contentEmbed, genreId },
        onComplete
      }
    );
};

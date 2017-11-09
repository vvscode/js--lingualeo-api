/**
 * Use like
 * depends on http://kangoextensions.com/
 * var llS = new LingualeoServer('http://api.lingualeo.com', 'ru')
 * @param {*} apiUrl fe 'http://api.lingualeo.com'
 * @param {*} currentLanguage 'ru'
 */
var lingualeo = {
  addArgumentsToUrl: function(a, b) {
    b = b || {};
    var c = Object.keys(b)
      .map(function(a) {
        return a + "=" + encodeURIComponent(b[a]);
      })
      .join("&");
    return c ? a + this.getQueryParamsDelimiter(a) + c : a;
  },
  config: {
    debug: !1,
    domain: "http://" + a,
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
      checkSiteNotifications: b + "/user/{user_id}/notifications/unread",
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

var LingualeoServer = function(apiUrl, targetLanguage) {
  function e(a, c) {
    l("POST", lingualeo.addArgumentsToUrl(a, { port: m }), c);
  }
  function l(a, c, b) {
    if ("undefined" === typeof b.params || null === b.params) b.params = {};
    b.params.port = m;
    kango.xhr.send(
      {
        method: a,
        url: c,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "LinguaLeo-Version": q,
          "X-Accept-Language": n
        },
        params: b.params
      },
      function(a) {
        var d;
        if (200 !== a.status) {
          d = { error: !0, error_msg: "Response status error: " + a.status };
          k.responseStatusErrorHandler &&
            k.responseStatusErrorHandler(a.status, b.isSilentError);
          if (b.onError) b.onError(d.error_msg, null, a.status);
          if (b.onComplete) b.onComplete(d);
        } else if (b.isTextResponse) {
          d = { text: a.response || "" };
          if (b.onSuccess) b.onSuccess(d);
          if (b.onComplete) b.onComplete(d);
        } else {
          try {
            d = JSON.parse(a.response);
          } catch (c) {
            d = { error_code: 27051983, error_msg: "Wrong server response." };
          }
          if (d.error_code) {
            if (
              (k.responseErrorHandler &&
                k.responseErrorHandler(
                  d.error_msg,
                  d.error_code,
                  b.isSilentError
                ),
              b.onError)
            )
              b.onError(d.error_msg, d, a.status);
          } else if (b.onSuccess) b.onSuccess(d || {});
          if (b.onComplete) b.onComplete(d || {});
        }
      }
    );
  }
  var k = this,
    n = targetLanguage || "ru",
    m = kango.getExtensionInfo().settings.port,
    q = kango.getExtensionInfo().version;
  this.responseErrorHandler = this.responseStatusErrorHandler = null;
  this.setUserLocale = function(a) {
    n = a || "ru";
  };
  this.loadTranslations = function(a, c, b) {
    e(apiUrl + lingualeo.config.ajax.getTranslations, {
      isSilentError: !1,
      params: {
        word: a.replace(/&/g, "%26"),
        include_media: 1,
        add_word_forms: 1
      },
      onSuccess: c,
      onError: b
    });
  };
  this.setWordTranslation = function(a, c, b, f, d, h, k) {
    e(apiUrl + lingualeo.config.ajax.addWordToDict, {
      isSilentError: !1,
      params: {
        word: a,
        tword: c,
        context: b || "",
        context_url: f,
        context_title: d
      },
      onSuccess: h,
      onError: k
    });
  };
  this.setWordTranslationMultiple = function(a, c, b) {
    for (var f = [], d = 0, h; (h = a[d]); d++)
      (f["words[" + d + "][word]"] = h.word),
        (f["words[" + d + "][tword]"] = h.tword),
        (f["words[" + d + "][context]"] = h.context),
        (f["words[" + d + "][context_url]"] = h.context_url),
        (f["words[" + d + "][context_title]"] = h.context_title);
    e(apiUrl + lingualeo.config.ajax.addWordToDictMultiple, {
      isSilentError: !0,
      params: f,
      onSuccess: c,
      onError: b
    });
  };
  this.translateCustomText = function(a, c, b, f) {
    a = {
      isSilentError: !0,
      params: { q: encodeURIComponent(a), source: c, target: b },
      onComplete: f
    };
    l("GET", apiUrl + lingualeo.config.ajax.translate, a);
  };
  this.checkAuthorization = function(a, c, b) {
    e(apiUrl + lingualeo.config.ajax.isAuth, {
      isSilentError: a,
      onSuccess: function(a) {
        c && c(a.is_authorized);
      },
      onError: b
    });
  };
  this.getUntrainedWordsCount = function(a, c) {
    e(apiUrl + lingualeo.config.ajax.getUntrainedWordsCount, {
      isSilentError: !0,
      onSuccess: a,
      onError: c
    });
  };
  this.setCookieWithServer = function(a) {
    e(apiUrl + lingualeo.config.ajax.setChromeHideCookie, {
      isSilentError: !0,
      onSuccess: a
    });
  };
  this.login = function(a, c, b) {
    e(apiUrl + lingualeo.config.ajax.login, {
      isSilentError: !0,
      params: { email: encodeURIComponent(a), password: encodeURIComponent(c) },
      onComplete: b
    });
  };
  this.getUserData = function(a) {
    e(apiUrl + lingualeo.config.ajax.login, {
      isSilentError: !0,
      onComplete: a
    });
  };
  this.checkSiteNotifications = function(a, c) {
    var b = lingualeo.config.ajax.checkSiteNotifications.replace(
      "{user_id}",
      a
    );
    l("GET", b, { isSilentError: !0, onSuccess: c });
  };
  this.getYoutubeCaptionsInfo = function(a, c) {
    e(a, {
      isTextResponse: !0,
      onComplete: c
    });
  };
  this.exportYoutubeContentToJungle = function(a, c, b) {
    e(lingualeo.config.domain + lingualeo.config.path.youtubeExport, {
      params: { contentEmbed: a, genreId: c },
      onComplete: b
    });
  };
};

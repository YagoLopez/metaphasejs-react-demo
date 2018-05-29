"use strict";
var precacheConfig = [["./index.html", "0d50fc4786c3fcfb14b2289b4e541bb2"], ["./static/css/main.81142a26.css", "fd5b2db528df5ef967275bcc1c9310e7"], ["./static/media/color.c7a33805.png", "c7a33805ffda0d32bd2a9904c8b02750"], ["./static/media/fontawesome-webfont.674f50d2.eot", "674f50d287a8c48dc19ba404d20fe713"], ["./static/media/fontawesome-webfont.912ec66d.svg", "912ec66d7572ff821749319396470bde"], ["./static/media/fontawesome-webfont.af7ae505.woff2", "af7ae505a9eed503f8b8e6982036873e"], ["./static/media/fontawesome-webfont.b06871f2.ttf", "b06871f281fee6b241d60582ae9369b9"], ["./static/media/fontawesome-webfont.fee66e71.woff", "fee66e712a8a08eef5805a46892932ad"], ["./static/media/line.567f5738.gif", "567f57385ea3dde2c9aec797d07850d2"], ["./static/media/roboto-v15-latin-regular.16e1d930.woff", "16e1d930cf13fb7a956372044b6d02d0"], ["./static/media/roboto-v15-latin-regular.38861cba.ttf", "38861cba61c66739c1452c3a71e39852"], ["./static/media/roboto-v15-latin-regular.3d3a5358.svg", "3d3a53586bd78d1069ae4b89a3b9aa98"], ["./static/media/roboto-v15-latin-regular.7e367be0.woff2", "7e367be02cd17a96d513ab74846bafb3"], ["./static/media/roboto-v15-latin-regular.9f916e33.eot", "9f916e330c478bbfa2a0dd6614042046"]],
  cacheName = "sw-precache-v3-sw-precache-webpack-plugin-" + (self.registration ? self.registration.scope : ""),
  ignoreUrlParametersMatching = [/^utm_/], addDirectoryIndex = function (e, t) {
    var a = new URL(e);
    return "/" === a.pathname.slice(-1) && (a.pathname += t), a.toString()
  }, cleanResponse = function (t) {
    return t.redirected ? ("body" in t ? Promise.resolve(t.body) : t.blob()).then(function (e) {
      return new Response(e, {headers: t.headers, status: t.status, statusText: t.statusText})
    }) : Promise.resolve(t)
  }, createCacheKey = function (e, t, a, n) {
    var r = new URL(e);
    return n && r.pathname.match(n) || (r.search += (r.search ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(a)), r.toString()
  }, isPathWhitelisted = function (e, t) {
    if (0 === e.length) return !0;
    var a = new URL(t).pathname;
    return e.some(function (e) {
      return a.match(e)
    })
  }, stripIgnoredUrlParameters = function (e, a) {
    var t = new URL(e);
    return t.hash = "", t.search = t.search.slice(1).split("&").map(function (e) {
      return e.split("=")
    }).filter(function (t) {
      return a.every(function (e) {
        return !e.test(t[0])
      })
    }).map(function (e) {
      return e.join("=")
    }).join("&"), t.toString()
  }, hashParamName = "_sw-precache", urlsToCacheKeys = new Map(precacheConfig.map(function (e) {
    var t = e[0], a = e[1], n = new URL(t, self.location), r = createCacheKey(n, hashParamName, a, /\.\w{8}\./);
    return [n.toString(), r]
  }));

function setOfCachedUrls(e) {
  return e.keys().then(function (e) {
    return e.map(function (e) {
      return e.url
    })
  }).then(function (e) {
    return new Set(e)
  })
}

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(cacheName).then(function (n) {
    return setOfCachedUrls(n).then(function (a) {
      return Promise.all(Array.from(urlsToCacheKeys.values()).map(function (t) {
        if (!a.has(t)) {
          var e = new Request(t, {credentials: "same-origin"});
          return fetch(e).then(function (e) {
            if (!e.ok) throw new Error("Request for " + t + " returned a response with status " + e.status);
            return cleanResponse(e).then(function (e) {
              return n.put(t, e)
            })
          })
        }
      }))
    })
  }).then(function () {
    return self.skipWaiting()
  }))
}), self.addEventListener("activate", function (e) {
  var a = new Set(urlsToCacheKeys.values());
  e.waitUntil(caches.open(cacheName).then(function (t) {
    return t.keys().then(function (e) {
      return Promise.all(e.map(function (e) {
        if (!a.has(e.url)) return t.delete(e)
      }))
    })
  }).then(function () {
    return self.clients.claim()
  }))
}), self.addEventListener("fetch", function (t) {
  if ("GET" === t.request.method) {
    var e, a = stripIgnoredUrlParameters(t.request.url, ignoreUrlParametersMatching), n = "index.html";
    (e = urlsToCacheKeys.has(a)) || (a = addDirectoryIndex(a, n), e = urlsToCacheKeys.has(a));
    var r = "./index.html";
    !e && "navigate" === t.request.mode && isPathWhitelisted(["^(?!\\/__).*"], t.request.url) && (a = new URL(r, self.location).toString(), e = urlsToCacheKeys.has(a)), e && t.respondWith(caches.open(cacheName).then(function (e) {
      return e.match(urlsToCacheKeys.get(a)).then(function (e) {
        if (e) return e;
        throw Error("The cached response that was expected is missing.")
      })
    }).catch(function (e) {
      return console.warn('Couldn\'t serve response for "%s" from cache: %O', t.request.url, e), fetch(t.request)
    }))
  }
});
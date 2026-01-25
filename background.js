(function () {
  "use strict";

  function makeTextPatcher(func) {
    return (e) => {
      var stream = browser.webRequest.filterResponseData(e.requestId),
        dec = new TextDecoder("UTF-8"),
        data = [];

      stream.ondata = function (e) {
        data.push(dec.decode(e.data, { stream: true }));
      };
      stream.onstop = function () {
        var s = data.join(""),
          enc = new TextEncoder();

        stream.write(enc.encode(func(s)));
        stream.close();
      };
      return {};
    };
  }

  browser.webRequest.onBeforeRequest.addListener(
    makeTextPatcher((s) => {
      var textFind = "t.prototype.enableVim=function(){",
        textAdd =
          "a.VimMode.Vim.noremap(';', 'l');" +
          "a.VimMode.Vim.noremap('l', 'k');" +
          "a.VimMode.Vim.noremap('k', 'j');" +
          "a.VimMode.Vim.noremap('j', 'h');" +
          "a.VimMode.Vim.noremap('h', ';');";

      return s.replace(textFind, "$&" + textAdd);
    }),
    {
      types: ["script"],
      urls: ["https://static.ce-cdn.net/main.v*.*.js"],
    },
    ["blocking"],
  );
  browser.webRequest.onBeforeRequest.addListener(
    makeTextPatcher((s) => {
      var textFind = "monacoVim.initVimMode(e,n&&n.current?n.current:void 0);",
        textAdd =
          "monacoVim.VimMode.Vim.noremap(';', 'l');" +
          "monacoVim.VimMode.Vim.noremap('l', 'k');" +
          "monacoVim.VimMode.Vim.noremap('k', 'j');" +
          "monacoVim.VimMode.Vim.noremap('j', 'h');" +
          "monacoVim.VimMode.Vim.noremap('h', ';');";
      return s.replace(textFind, "$&" + textAdd);
    }),
    {
      types: ["script"],
      urls: ["https://leetcode.com/_next/static/chunks/*.js"],
    },
    ["blocking"],
  );
  browser.webRequest.onBeforeRequest.addListener(
    makeTextPatcher((s) => {
      return s
        .replace(
          '{keys:"h",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!1}}',
          '{keys:"j",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!1}}',
        )
        .replace(
          '{keys:"l",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!0}}',
          '{keys:";",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!0}}',
        )
        .replace(
          '{keys:"j",type:"motion",motion:"moveByLines",motionArgs:{forward:!0,linewise:!0}}',
          '{keys:"k",type:"motion",motion:"moveByLines",motionArgs:{forward:!0,linewise:!0}}',
        )
        .replace(
          '{keys:"k",type:"motion",motion:"moveByLines",motionArgs:{forward:!1,linewise:!0}}',
          '{keys:"l",type:"motion",motion:"moveByLines",motionArgs:{forward:!1,linewise:!0}}',
        );
    }),
    {
      types: ["script"],
      urls: ["https://d1a7p14oqam61r.cloudfront.net/packs/js/*.js"],
    },
    ["blocking"],
  );
  browser.webRequest.onBeforeRequest.addListener(
    makeTextPatcher((s) => {
      return s
        .replace(
          '{keys:"h",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!1}}',
          '{keys:"j",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!1}}',
        )
        .replace(
          '{keys:"l",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!0}}',
          '{keys:";",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!0}}',
        )
        .replace(
          '{keys:"j",type:"motion",motion:"moveByLines",motionArgs:{forward:!0,linewise:!0}}',
          '{keys:"k",type:"motion",motion:"moveByLines",motionArgs:{forward:!0,linewise:!0}}',
        )
        .replace(
          '{keys:"k",type:"motion",motion:"moveByLines",motionArgs:{forward:!1,linewise:!0}}',
          '{keys:"l",type:"motion",motion:"moveByLines",motionArgs:{forward:!1,linewise:!0}}',
        );
    }),
    {
      types: ["script"],
      urls: ["https://hrcdn.net/*.js", "https://cdn.hackerearth.com/*.js", "https://neetcode.io/*.js"],
    },
    ["blocking"],
  );
})();

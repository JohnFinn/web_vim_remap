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
          "g.VimMode.Vim.noremap(';', 'l');" +
          "g.VimMode.Vim.noremap('l', 'k');" +
          "g.VimMode.Vim.noremap('k', 'j');" +
          "g.VimMode.Vim.noremap('j', 'h');" +
          "g.VimMode.Vim.noremap('h', ';');";

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
      urls: ["https://hrcdn.net/fcore/assets/monacovim-4f9bc0dc.js"],
    },
    ["blocking"],
  );
})();

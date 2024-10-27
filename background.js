(function () {
  "use strict";

  function onBR(e) {
    var stream = browser.webRequest.filterResponseData(e.requestId),
      dec = new TextDecoder("UTF-8"),
      data = [];

    stream.ondata = function (e) {
      data.push(dec.decode(e.data, { stream: true }));
    };
    stream.onstop = function () {
      var s = data.join(""),
        enc = new TextEncoder(),
        textFind = "t.prototype.enableVim=function(){",
        textAdd =
          "g.VimMode.Vim.noremap(';', 'l');" +
          "g.VimMode.Vim.noremap('l', 'k');" +
          "g.VimMode.Vim.noremap('k', 'j');" +
          "g.VimMode.Vim.noremap('j', 'h');" +
          "g.VimMode.Vim.noremap('h', ';');";

      s = s.replace(textFind, "$&" + textAdd);
      stream.write(enc.encode(s));
      stream.close();
    };
    return {};
  }

  browser.webRequest.onBeforeRequest.addListener(
    onBR,
    {
      types: ["script"],
      urls: ["https://static.ce-cdn.net/main.v*.*.js"],
    },
    ["blocking"],
  );
})();

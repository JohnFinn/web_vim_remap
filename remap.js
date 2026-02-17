// const Vim = require('monaco-vim').VimMode.Vim;
// console.log(Vim)
// Vim.noremap(';', 'l');
// Vim.noremap('l', 'k');
// Vim.noremap('k', 'j');
// Vim.noremap('j', 'h');
// Vim.noremap('h', ';');

console.log('remapping start 2');

const interval = setInterval(() => {
  if (window.monacoVim && monacoVim.VimMode && monacoVim.VimMode.Vim) {
    clearInterval(interval);

    const Vim = monacoVim.VimMode.Vim;
    console.log('Vim imported');

    Vim.noremap(';', 'l');
    Vim.noremap('l', 'k');
    Vim.noremap('k', 'j');
    Vim.noremap('j', 'h');
    Vim.noremap('h', ';');

    console.log('remapping done');
  }
}, 50);

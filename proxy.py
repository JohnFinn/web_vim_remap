from mitmproxy import http


def log(*a, **kw):
    with open("/tmp/log.txt", "at") as file:
        print(*a, **kw, file=file)


LEETCODE_URL = "https://leetcode.com/_next/static/chunks/"


def is_whitelisted(url: str) -> bool:
    return url.endswith(".js") and url.startswith(
        (
            "https://static.ce-cdn.net/",  # compiler explorer
            LEETCODE_URL,  # leetcode
            "https://d1a7p14oqam61r.cloudfront.net/packs/js/",  # app.coderpad.io
            "https://hrcdn.net/fcore/assets/monacovim",  # hackerrank
        )
    )


def handle_leetcode(content):
    textFind = b"monacoVim.initVimMode(e,n&&n.current?n.current:void 0);"
    textAdd = (
        b"monacoVim.VimMode.Vim.noremap(';', 'l');"
        + b"monacoVim.VimMode.Vim.noremap('l', 'k');"
        + b"monacoVim.VimMode.Vim.noremap('k', 'j');"
        + b"monacoVim.VimMode.Vim.noremap('j', 'h');"
        + b"monacoVim.VimMode.Vim.noremap('h', ';');"
    )
    return content.replace(textFind, textAdd + textFind)


def handle_most(content):
    return (
        content.replace(
            b'{keys:"h",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!1}}',
            b'{keys:"j",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!1}}',
        )
        .replace(
            b'{keys:"l",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!0}}',
            b'{keys:";",type:"motion",motion:"moveByCharacters",motionArgs:{forward:!0}}',
        )
        .replace(
            b'{keys:"j",type:"motion",motion:"moveByLines",motionArgs:{forward:!0,linewise:!0}}',
            b'{keys:"k",type:"motion",motion:"moveByLines",motionArgs:{forward:!0,linewise:!0}}',
        )
        .replace(
            b'{keys:"k",type:"motion",motion:"moveByLines",motionArgs:{forward:!1,linewise:!0}}',
            b'{keys:"l",type:"motion",motion:"moveByLines",motionArgs:{forward:!1,linewise:!0}}',
        )
    )


def response(flow: http.HTTPFlow) -> None:
    if not is_whitelisted(flow.request.pretty_url):
        return
    new_content = (
        handle_most(flow.response.content)
        if not flow.request.pretty_url.startswith(LEETCODE_URL)
        else handle_leetcode(flow.response.content)
    )
    log(
        "N" if flow.response.content is new_content else "Y",
        flow.request.pretty_url,
    )
    flow.response.content = new_content

from mitmproxy import http


def log(*a, **kw):
    with open("/tmp/log.txt", "at") as file:
        print(*a, **kw, file=file)


def matches_leetcode_js(url: str) -> bool:
    return url.endswith(".js") and url.startswith(
        (
            "https://static.ce-cdn.net/",  # compiler explorer
            "https://leetcode.com/_next/static/chunks/",  # leetcode
            "https://d1a7p14oqam61r.cloudfront.net/packs/js/",  # app.coderpad.io
            "https://hrcdn.net/fcore/assets/monacovim",  # hackerrank
        )
    )


def response(flow: http.HTTPFlow) -> None:
    """Log URL and SHA-256 hash of the response body."""
    if not matches_leetcode_js(flow.request.pretty_url):
        return
    log("matched", flow.request.pretty_url, "replacing content")
    flow.response.content = (
        flow.response.content.replace(
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

import hashlib
import re
from mitmproxy import http


def log(*a, **kw):
    with open("/tmp/log.txt", "at") as file:
        print(*a, **kw, file=file)


def calculate_sha256(data: bytes) -> str:
    """Compute SHA-256 hash of the given data."""
    return hashlib.sha256(data).hexdigest()


def matches_leetcode_js(url: str) -> bool:
    return url.endswith(".js")


def response(flow: http.HTTPFlow) -> None:
    """Log URL and SHA-256 hash of the response body."""
    if not matches_leetcode_js(flow.request.pretty_url):
        return
    log("matched", flow.request.pretty_url)
    log("replacing content")
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

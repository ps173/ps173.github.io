import json, os, re, sys
from urllib.request import Request, urlopen

COOKIE = os.environ.get("STORYGRAPH_COOKIE", "")
USERNAME = "mehmehsloth"

URLS = {
    "currently_reading": (f"https://app.thestorygraph.com/currently-reading/{USERNAME}?per_page=50", 0),
    "recently_read": (f"https://app.thestorygraph.com/books-read/{USERNAME}?per_page=50", 3),
    "want_to_read": (f"https://app.thestorygraph.com/to-read/{USERNAME}?per_page=50", 3),
}


def fetch_page(url, cookie):
    req = Request(url, headers={
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Cookie": f"remember_user_token={cookie}",
    })
    with urlopen(req) as resp:
        return resp.read().decode("utf-8")


def parse_books(html):
    blocks = re.split(r'class="book-title-author-and-series"[^>]*>', html)[1:]
    books, seen = [], set()

    for block in blocks:
        m = re.search(r'/books/([a-f0-9-]+)">([^<]+)</a>', block)
        if not m:
            continue
        bid, title = m.group(1), m.group(2)
        if bid in seen:
            continue
        seen.add(bid)

        text = re.sub(r'<[^>]+>', " ", block)
        text = re.sub(r'\s+', " ", text).strip()

        author = ""
        am = re.search(
            rf'{re.escape(title)}\s*(.*?)(?:\d+\s*pages|\d+\s*editions|ISBN)',
            text, re.IGNORECASE,
        )
        if am:
            author = am.group(1).strip()

        pages = (m := re.search(r'(\d+)\s*pages?', text, re.IGNORECASE)) and m.group(1) or ""
        year = (m := re.search(r'Original Pub Year:\s*(\d{4})', text)) and m.group(1) or ""
        fmt = (m := re.search(r'Format:\s*(\w+)', text)) and m.group(1) or ""
        isbn = (m := re.search(r'ISBN/UID:\s*(\d{10,13})', text)) and m.group(1) or ""
        cover = f"https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg?default=false" if isbn else ""

        rating = (m := re.search(r'(\d+\.?\d*)\s*mehmehsloth', text)) and m.group(1) or ""

        tags = list(set(
            t.lower()
            for t in re.findall(
                r'\b(nonfiction|fiction|health|history|science|biography|art|'
                r'classics|philosophy|poetry|romance|thriller|mystery|fantasy|'
                r'horror|essays|memoir|self.?help|psychology|sociology|technology|'
                r'travel|religion|politics|business|education|music|design|'
                r'nature|short.?stories)\b',
                text, re.IGNORECASE,
            )
        ))

        books.append({
            "id": bid,
            "title": title,
            "author": author,
            "cover": cover,
            "pages": pages,
            "year": year,
            "format": fmt if fmt.lower() != "not" else "",
            "rating": rating,
            "tags": tags,
        })

    return books


def main():
    cookie = COOKIE
    if not cookie:
        print("STORYGRAPH_COOKIE not set", file=sys.stderr)
        sys.exit(1)

    result = {}
    for key, (url, limit) in URLS.items():
        html = fetch_page(url, cookie)
        if key == "currently_reading":
            html = re.split(r'Paused\s*\(\d+\)', html, flags=re.IGNORECASE)[0]
        books = parse_books(html)
        result[key] = books[:limit] if limit else books

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()

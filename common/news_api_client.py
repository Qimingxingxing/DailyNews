import requests
from datetime import datetime

NEWS_API_ENDPOINT = "https://newsapi.org/v2/everything"
NEWS_API_KEY = "159a9d379deb443bb999115ecee1c441"

BBC_NEWS = "bbc-news"
BBC_SPORT = "bbc-sport"
CNN = "cnn"

SORT_BY_TOP = "publishedAt"  # 'latest' is not a valid sortBy value; use 'publishedAt'


def get_news_from_source(sources, sortBy=SORT_BY_TOP):
    articles = []
    today = datetime.utcnow().strftime('%Y-%m-%d')

    for source in sources:
        payload = {
            "apiKey": NEWS_API_KEY,
            "from": today,
            "to": today,
            "sources": source,  # Correct key
            "sortBy": sortBy,
            "language": "en",
            "pageSize": 20
        }

        response = requests.get(NEWS_API_ENDPOINT, params=payload)
        res_json = response.json()

        if res_json and res_json.get("status") == "ok":
            articles.extend(res_json.get("articles", []))

        articles = [
        {
            "source": {
                "id": "bbc-news",
                "name": "BBC News"
            },
            "author": "BBC News",
            "title": "ewiurtoewutoewiutio",
            "description": "A new report shows AI is having a major impact on industries across the globe.",
            "url": "https://www.bbc.com/news/world-us-canada-55568621",
            "urlToImage": "https://ichef.bbci.co.uk/news/1024/cpsprodpb/1234.jpg",
            "publishedAt": "2025-04-05T10:30:00Z",
            "content": "AI is being adopted faster than expected in industries like finance, healthcare, and education..."
        },
        {
            "source": {
                "id": "cnn",
                "name": "CNN"
            },
            "author": "John Doe",
            "title": "wall street gains on strong job report",
            "description": "Wall Street saw gains today after the latest job report showed strong hiring in March.",
            "url": "https://www.bbc.com/news/election-us-2020-55567865",
            "urlToImage": "https://cdn.cnn.com/cnnnext/dam/assets/5678.jpg",
            "publishedAt": "2025-04-05T14:00:00Z",
            "content": "U.S. employers added 300,000 jobs in March, far above the expected 200,000, pushing the Dow up 300 points..."
        }
    ]
    return articles

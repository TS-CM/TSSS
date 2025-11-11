
---
title: 首頁
layout: default
---

# 歡迎蒞臨天星宮網站

天星宮網站提供最新公告、祭典行事曆、活動剪影以及聯絡資訊，歡迎信眾與香客瀏覽。本宮致力於弘揚傳統文化，並以數位方式與信眾建立更緊密的聯繫。

## 最新公告

{% for post in site.posts limit:3 %}
- **[{{ post.title }}]({{ post.url | relative_url }})** - {{ post.date | date: '%Y-%m-%d' }}
{% endfor %}

查看更多公告，請前往[公告](/news/)。

## 即將舉行的活動

{% assign upcoming = site.events | sort: 'date' %}
{% for event in upcoming limit:3 %}
- **[{{ event.title }}]({{ event.url | relative_url }})** - {{ event.date | date: '%Y-%m-%d' }}
{% endfor %}

更多活動資訊，請前往[行事曆](/events/)。

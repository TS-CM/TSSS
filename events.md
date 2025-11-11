---
title: 行事曆
layout: default
permalink: /events/
---

# 行事曆

以下為本宮即將舉行的活動，依日期排序：

{% assign events = site.events | sort: 'date' %}
{% for event in events %}
### [{{ event.title }}]({{ event.url | relative_url }})
日期：{{ event.date | date: '%Y-%m-%d' }}
{% if event.location %}地點：{{ event.location }}{% endif %}

{{ event.excerpt | strip_html | truncate: 100 }}

---

{% endfor %}

## 行事曆（Google Calendar）


<iframe src="https://calendar.google.com/calendar/embed?src=59d9e3f9422f4e1e80c820d0dfdf05c846d434c2ece0fe8b31b92f577c986189%40group.calendar.google.com&ctz=Asia%2FTaipei" style="border:0" width="100%" height="600" frameborder="0" scrolling="no"></iframe>


## 公告試算表（Google 試算表）

<iframe src="https://docs.google.com/spreadsheets/d/1KUgTHObWtjbpnYGT2oJTKi0LNUbpJt4_4Bj65CpDxZw/pubhtml?widget=true&amp;headers=false"
        width="100%"
        height="480"></iframe>

# Torrent browse

[![CodeQL](https://github.com/KiraLT/torrent-browse/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/KiraLT/torrent-browse/actions/workflows/codeql-analysis.yml)
[![codecov](https://codecov.io/gh/KiraLT/torrent-browse/branch/main/graph/badge.svg)](https://codecov.io/gh/KiraLT/torrent-browse)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Torrents discovery library for both NodeJS & browser.

Read [Documentation 📘](https://kiralt.github.io/torrent-browse/)

Check [Demo 🎁](https://kiralt.github.io/torrent-browse/demo/)

## 

## Browser VS Node

This library works in both NodeJS and the browser. However some default providers may not work in the browser due to browser limitations. 

> Due to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) limitation browser can't fetch data from different domain. To get around that in the browser library uses free proxy servers. However they do not support custom headers and other things to get around website protections (like [cloudflare](https://www.cloudflare.com/)).
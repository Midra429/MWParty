# <sub><img src="packages/extension/assets/icon.png" width="30px" height="30px"></sub> MWParty
[![GitHub Release](https://img.shields.io/github/v/release/Midra429/MWParty?label=Releases)](https://github.com/Midra429/MWParty/releases/latest)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/cbnglejndffdphngiccfigpaofjdckap?label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/cbnglejndffdphngiccfigpaofjdckap)
[![Firefox Add-ons](https://img.shields.io/amo/v/mwparty?label=Firefox%20Add-ons)](https://addons.mozilla.org/ja/firefox/addon/mwparty/)

[<img src="packages/extension/assets/badges/chrome.png" height="60px">](https://chromewebstore.google.com/detail/cbnglejndffdphngiccfigpaofjdckap)
[<img src="packages/extension/assets/badges/firefox.png" height="60px">](https://addons.mozilla.org/ja/firefox/addon/mwparty/)

## 概要
複数の動画配信サービスに対応したウォッチパーティー用拡張機能です。

## 対応している動画配信サービス
- [Prime Video](https://www.amazon.co.jp/gp/video/storefront/)
- [dアニメストア](https://animestore.docomo.ne.jp/animestore/)
- [ABEMA](https://abema.tv/)
- [DMM TV](https://tv.dmm.com/vod/)
- [Hulu](https://www.hulu.jp/)
- [U-NEXT](https://video.unext.jp/)
- [YouTube](https://www.youtube.com/)
- [ニコニコ動画](https://www.nicovideo.jp/)
- [TVer](https://tver.jp/)

※ 増減する可能性あり

## インストール
### Chrome Web Store
https://chromewebstore.google.com/detail/cbnglejndffdphngiccfigpaofjdckap

### Firefox Add-ons
https://addons.mozilla.org/ja/firefox/addon/mwparty/

## 不具合報告・機能提案など
- GitHubの[Issues](https://github.com/Midra429/MWParty/issues)
- SNSアカウント宛にメッセージやメンション
  - X / Twitter: [@MWPartyExt](https://x.com/MWPartyExt)
  - Submarin: [@Midra](https://submarin.online/@Midra)
  - Discord: [midra429](https://discord.gg/wh3s5VNC)

---

## 開発
### 環境
- [pnpm](https://pnpm.io/ja/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Chrome](https://www.google.com/intl/ja/chrome/)

### 開発サーバー
```sh
# Chrome
pnpm extension run dev
```
```sh
# Firefox
pnpm extension run dev:firefox
```

### 出力
```sh
# packages/extension/dist/chrome-mv3
pnpm extension run build
```
```sh
# packages/extension/dist/firefox-mv3
pnpm extension run build:firefox
```

### 出力 (ZIP)
```sh
# packages/extension/dist/mwparty-extension-0.0.0-chrome.zip
pnpm extension run zip
```
```sh
# packages/extension/dist/mwparty-extension-0.0.0-firefox.zip
# packages/extension/dist/mwparty-extension-0.0.0-sources.zip
pnpm extension run zip:firefox
```

## ライセンス
当ライセンスは [MIT](LICENSE.txt) ライセンスの規約に基づいて付与されています。

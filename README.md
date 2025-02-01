# <sub><img src="packages/extension/assets/icon.png" width="30px" height="30px"></sub> MWParty
[![GitHub Release](https://img.shields.io/github/v/release/Midra429/mwparty?label=Releases)](https://github.com/Midra429/mwparty/releases/latest)
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
- GitHubの[Issues](https://github.com/Midra429/mwparty/issues)
- SNSアカウント宛にメッセージやメンション
  - X / Twitter: [@Midra429](https://x.com/Midra429)

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
# dist/chrome-mv3
pnpm extension run build
```
```sh
# dist/firefox-mv3
pnpm extension run build:firefox
```

### 出力 (ZIP)
```sh
# dist/mwparty-0.0.0-chrome.zip
pnpm extension run zip
```
```sh
# dist/mwparty-0.0.0-firefox.zip
# dist/mwparty-0.0.0-sources.zip
pnpm extension run zip:firefox
```

### Clerkの設定
https://clerk.com/docs/deployments/deploy-chrome-extension#add-the-extensions-id-to-your-web-apps-allowed-origins
```sh
curl -X PATCH https://api.clerk.com/v1/instance \
  -H "Authorization: Bearer sk_live_**********" \
  -H "Content-type: application/json" \
  -d '{"allowed_origins": ["chrome-extension://<EXTENSION_ID>", "moz-extension://<EXTENSION_ID>"]}'
```

## ライセンス
当ライセンスは [MIT](LICENSE.txt) ライセンスの規約に基づいて付与されています。

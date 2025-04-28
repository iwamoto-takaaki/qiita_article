---
title: bootstrap4.2とcssの使い分け
tags:
  - HTML
  - CSS
  - Bootstrap
  - bootstrap4
private: false
updated_at: '2019-01-29T13:14:48+09:00'
id: f1bc1bf8d8b1cd1d4d85
organization_url_name: null
slide: false
ignorePublish: false
---
#はじめに

前回、[bootstrap4.2でcss無しのポートフォリオサイトを作った](https://qiita.com/takaaki-iwamoto/items/05e51441cc748df8ecb9)というタイトルで、bootstrap4だと簡単なページならCSS無しでレスポンシブ対応までできる事を紹介しました。

実際のところはCSSを使った方が良い部分も多いので、bootstrap4と自分で定義したCSSがある程度書ける人はどう書き分ければいいかについて考えたので見てもらえると嬉しいです。(CSSの書き方がなっていないという指摘は歓迎します。)

リンク：
- [完成品](https://iwamoto-takaaki.github.io/bootstrap-and-css-profile/)
- [ソース](https://github.com/iwamoto-takaaki/bootstrap-and-css-profile)
- [前回との差分](https://github.com/iwamoto-takaaki/bootstrap-and-css-profile/compare/a247c1cc42e03914beec033c71aad9ba194fd5a2..master)
　(もっと差分がきれいに出るように履歴の調整すればよかったのですが、rebaseまわりがまだ練習がたりないようです。)

前回のは「HTML一本でコピペでやれる！」というのが面白みだったのでCDNを使っていましたが、今回はダウンロードして使っています。

#方針
HTMLは、classで意味を補足しつつ、CSSで表示方法を指定するセマンティックな書き方をしましょうというのが教科書的なwebページの作り方と覚えています。bootstrapはclassを多量に指定するので、HTMLは非常に読みづらくなってしまいます。

また、表示方法について書かれている箇所がHTMLとCSS両方になるで、非常に管理がしづらいです。（そうでなくてもCSSにゴミを残さず書くことはいまだできていない私です。）

HTMLをすっきりさせつつ、必要最低限でbootstrapを使っていこうと考えました。

#内容
- CSSで普通に書く
- CSSでも良いもの
- bootstrapのclassをカスタマイズ
- bootstrapをそのまま使う
- 注意したい

##CSSで普通に書く

色などはclass属性で指定すると邪魔なのでCSSで指定します。そもそも、bootstrapの色だけじゃ足りないですし。

```css:style.css
.section-title .underbar{
    background-color: #4DF59B;
}

header, footer{
    background-color: #343a40;
}
```
私が知らないだけかもしれませんが、文字サイズを画面サイズに合わせて変更する事ができず手動でやりました。ない機能は使わないというのも大人の知恵ですが、このようなケースはそこそこありそうです。

```css:style.css
@media (min-width: 1140px){
    #myname{
        font-size: 3rem;
    }
}

@media (min-width: 540px){
    #myname{
        font-size: 2rem;
    }
}

#myname{
    font-size: 1.2rem;
}
```

## CSSでも良いもの

paddingやmarginをbootstrapで制御するのは手軽で良いのですが、CSSに書いた方がすっきりします。

例えば変更前のHTMLが下のようだったとして。

```html:index.html
    <header class="pt-3 pb-2 bg-dark">
```

CSSで書けばこのように書くのと同じです。タイプ量は増え、ソースコードの行数も増えますが、読みやすくなります。

```css:style.css
header{
    padding-top: 3rem;
    padding-bottom: 2rem;
    background-color: #343a40;
}
```

セクションのタイトルのアンダーバーなどは、まとめて設定ができるCSSの方が無難です。
classを5個設定し、3個所に記述がある場合、私は必ずメンテ漏れをする自信があります。

```css:style.css
.section-title .underbar{
    width: 6rem;
    height: 0.5rem;
    margin-right: auto;
    margin-left: auto;
    background-color: #4DF59B;
}
```

あと、bootstrapのflexboxに関しては、HTMLだけで使えるという利点はありますが、paddingなどと同じくCSSで設定した方がすっきり書けます。

## bootstrapのclassをカスタマイズ
bootstrapで指定して、細かいところはCSSで追記することによって使い勝手を良くする方法があります。

```css:style.css
.container {
    margin-top: 2rem;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    text-align: center;
}
```

cardは角に丸みをつけてみました。(実のところcardは全部を自分で作っても手間はかからない気がしますが・・・)

```css:style.css
.carousel-item img{
    width: 100%;
}

.card{
    border-radius: 1rem;
    padding: 0;
}

.card .card-img-top{
    border-radius: 1rem 1rem 0 0;
}
```

## bootstrapをそのまま使う
ナビゲーションバーが代表格ですがjavascriptを使うものは、CSSでなんとかできるものではありません。
CSSからjavascriptの動作を設定するテクニックはないものでしょうか？下手にいじって面倒なことになることは多いです。

また、レスポンシブデザイン周りの設定は、CSSで書くと結構面倒なのでbootstrapでやりたい機能です。

```html:index.html
                <div class="card col-12 col-sm-4">
```
ただ、HTMLがすごく見づらくなるので、あまり良い気分ではありません。

##注意したい
手が滑って、CSSでやった方が良い部分をbootstrapで書いたままになっていると後でメンテ漏れ起こす可能性が高いので注意いしたいです。

```html:index.html
            <!-- CSSでも良いところはCSSで書く方針でも思わず使って後で困る覚悟はしといた方が良いかも -->
            <img src="./image/IMG_1804_400x400.JPG" alt="twitter-image" class="w-50 rounded-circle shadow-lg p-1 mb-5 bg-dark rounded">
```

#さいごに
今回の書き方はbootstrapの便利さがあまり活かされない書き方かもしれませんので、逆にどこまでCSS書かずに済ますかということを考える方が潔いかもしれません。
次はSCSSで、カスタマイズして使う方法をやってみようと思いますが、選択肢が多いので、方針を決めかねそうです。

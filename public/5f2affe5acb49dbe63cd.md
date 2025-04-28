---
title: 倍賭け法(マーチンゲール法)で儲かるか中学生とPythonで確かめた
tags:
  - その他
  - Python3
  - モンテカルロ法
private: false
updated_at: '2020-10-06T12:28:25+09:00'
id: 5f2affe5acb49dbe63cd
organization_url_name: null
slide: false
ignorePublish: false
---
# はじめに

数学が好きな息子がどっかで倍賭け法を知ったらしく、おもしろそうに説明してきた。

マーチンゲール法というやり方で、[Wikipediaによると](https://ja.wikipedia.org/wiki/%E3%83%99%E3%83%83%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0)

>最も古典的かつ有名な手法で、カジノ必勝法として永らく愛されてきた。倍賭け法とも言われる。
まず1単位賭け、負ければその倍の2単位、さらに負ければそのさらに倍の4単位、と賭けていき、一度でも勝てばただちに1単位に戻す、という手法である。試行回数に関係なく、勝った時には1単位を得ることになる。
多くの場合には少額の勝ちであるが、負ける時は大敗する。負けが連続するとたちまちパンク、もしくはテーブルリミットと呼ばれる賭けの上限に達してしまう。

とのことで、うまくは行かないということは知っていた。

とはいえ実際どのような負け方をするのか試したことはなかったので、実際やってみることにした。中学生の息子が理解できるように確率は使わずにやってみる。

# 賭け関数

```python
import random

def play():
    a = random.randint(0, 1)
    if a == 0:
        return 'win'
    else:
        return 'lose'
```

ゲームの結果を返す関数を定義。

```python
def test():
    win = 0
    lose = 0
    for i in range(1000):
        if play() == 'win':
            win += 1
        else:
            lose += 1

    print('win: ' + str(win) + ' , lose: ' + str(lose))
    
for i in range(10):
    test()
```

これを1,000回試行した結果を10回表示して、結果のバラけ方を確認。

```text

win: 498 , lose: 502
win: 491 , lose: 509
win: 479 , lose: 521
win: 509 , lose: 491
win: 513 , lose: 487
win: 520 , lose: 480
win: 521 , lose: 479
win: 495 , lose: 505
win: 526 , lose: 474
win: 524 , lose: 476
```

こんな感じです。勝率5割近辺なので問題なし。

# マーチンゲール法の施行

中学生なので、ギャンブルはできませんがまあ彼としては結構な金額1万円を軍資金とする。最初の掛け金は100円。

負けたら掛け金を倍額にして勝つまで繰り返す。

```python
def martingale(money, bet):
    times = 1
    while(True):
        if play() == 'win':
            money += bet
            return money, times
        else:
            money -= bet
            bet += bet
            if money <= bet:
                return money, times
        times += 1
```

10回試して結果を表示。

```python
def test():
    money, times = martingale(10000, 100)
    
    if money < 0:
        print('Lose at: ' + str(times) + ', money: ' + str(money))
    else:
        print('Win at: ' + str(times) + ', money: ' + str(money))

for i in range(10):
    test()
```

で結果。

```text
Win at: 4, money: 10100
Win at: 3, money: 10100
Win at: 1, money: 10100
Win at: 2, money: 10100
Win at: 2, money: 10100
Win at: 4, money: 10100
Win at: 1, money: 10100
Win at: 1, money: 10100
Win at: 3, money: 10100
Win at: 2, money: 10100
```

実際はこれを何回も実行しましたがたまに負ける程度。確実に勝てる。息子の考えている通り。

# 繰り返した場合

これってどのくらい続けられるのか確認したい。一回で1万円を賭けた場合と比較するために倍額になった時点で終わり。また、倍額にして掛け金が足らなくなった場合も100円からやり直すという方針とする。

```python
def iterate(money, bet):
    day = 1
    duble = money * 2
    while(True):
        money, times = martingale(money, 100)
        if money <= 0:
            return money, day
        elif duble <= money:
            return money, day
        day += 1
```

私はor条件を書くより `else if` を好む。判定後の処理が複雑になりそうな場合は、判定結果を返す関数を書く。どうでもいいですけど・・・

繰り返した回数を日数として扱う。1万円を軍資金として100円からスタートした場合、100日で倍額になり終了します。一度でも負けると

さてこれを例によって10回試してみると・・・

```python
def test():
    money, day = iterate(10000, 100)
    
    print('day: ' + str(day) + ', money: ' + str(money))

for i in range(10):
    test()
```

結果は

```text
day: 164, money: 20000
day: 100, money: 20000
day: 164, money: 20000
day: 100, money: 20000
day: 98, money: 0
day: 64, money: 0
day: 100, money: 20000
day: 90, money: 0
day: 104, money: 0
day: 20, money: 0
```

ん？5勝5敗ですね。結構負けます。これは初めから1万円賭けたら良いのか、たくさん遊べたと感じるかは個人の好みですが、実際の勝率を確認してみたくなりました。

# もう少し試してみる

ということで、1000回ほど試してみるを10回ほど表示します。

```python
def test():
    win = 0
    lose = 0
    for i in range(1000):
        money, day = iterate(10000, 100)
        if 0 < money:
            win += 1
        else:
            lose += 1
            
    print('win: ' + str(win) + ', lose: ' + str(lose))

for i in range(10):
    test()
```

paiza.ioで試したのですがTimeOutになったので、半分に分けて2回実行しています。

```text
win: 510, lose: 490
win: 498, lose: 502
win: 502, lose: 498
win: 467, lose: 533
win: 496, lose: 504
win: 498, lose: 502
win: 500, lose: 500
win: 527, lose: 473
win: 500, lose: 500
win: 508, lose: 492
```

ほぼほぼ勝率5割ですね。

# 軍資金を増やしてみた

では100万円ではどうなるでしょう。

```python
def test():
    win = 0
    lose = 0
    for i in range(1000):
        money, day = iterate(1000000, 100)
        if 0 < money:
            win += 1
        else:
            lose += 1
            
    print('win: ' + str(win) + ', lose: ' + str(lose))

for i in range(10):
    test()
```

賭けの回数が増えるのでかなり重たい処理でした。

```text
win: 507, lose: 493
win: 489, lose: 511
win: 490, lose: 510
win: 521, lose: 479
win: 497, lose: 503
win: 467, lose: 533
win: 493, lose: 507
win: 497, lose: 503
win: 496, lose: 504
win: 510, lose: 490
```

結果、勝率は5割つまり一気に賭けても倍賭けで回数を増やしても結果が変わらないということです。

100円の儲けのために100万円を用意してもこれなので、これ以上資金を増やすことは意味がないと思われます。残念だったね息子よ。

# まとめ

中学生の息子に説明するためのプログラムなので、確率ではなく実際にやってみるということをした。彼は数学の能力も高いので計算は説明についてこられたかもしれませんが、私の方の能力の問題に当たる可能性も高かった・・・

実のところ、倍賭けすると負けの確率は半分になるが、負けた時の金額が倍になっているので、繰り返したときの勝率は一気に賭けた場合と変わらなくなる。冷静になれば当たり前のことですが、必勝法とか言われるとコロっと騙される。(永久機関と同じだなぁ)

そういう意味で、実際に試すというのは非常に効果的な方法だと思われた。

追記－この検証方法って、モンテカルロ法と呼ぶのを後で知った。(名前しか知らんかった)
自信が無いので、これはそう言わんよとかまさにという人があればコメント下さい。

# 感想

慣れないpythonで書いてみた。もうひとりの息子がpythonを書いていてちょっと興味を覚えたからだ。書くときにはちょっと癖があるように感じるが、読みやすいのが良い。

これは内緒なんだけど、最初に組んだプログラムは境界条件にバグがあり少し儲かる計算結果になっていた・・・

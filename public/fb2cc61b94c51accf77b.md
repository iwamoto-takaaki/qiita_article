---
title: Rails用のvagrantfile書いたよ
tags:
  - Rails
  - CentOS
  - Vagrant
  - Vagrantfile
private: false
updated_at: '2019-04-04T00:16:25+09:00'
id: fb2cc61b94c51accf77b
organization_url_name: null
slide: false
ignorePublish: false
---
#はじめに
タイトル通りです。OSはCentOS7です。
[github](https://github.com/iwamoto-takaaki/vagrantfile-for-rails)に乗せときますのでご入用の方はクローンしてください。

vagrant+railsで検索してvagrantfileが出てこなかったので、少し意地になって作りました。
`vagrant up`でセットアップ完了するのがvagrant道です。

上手く動作しなかったら教えてくだされは、ありがたい。しかしながら、持っている技術はここまでなのでなおせる自信はありません。
そもそも、Vagrant公式の[BOX検索](https://app.vagrantup.com/boxes/search?utf8=%E2%9C%93&sort=downloads&provider=&q=rails)でたくさん出てきます。

そもそも、`vagrant up`してから私の環境で３０分くらいかかります。
チーム用のBOXを作る際のたたき台として使うと良いかもしれません。

ちなみに、`vagrant up`が完了したら、`vagrant ssh`で接続して、

```shell
$ cd /srv/website
$ rails server -b 0.0.0.0 -p 3000
```
を叩くとサーバが起動して、ブラウザの`localhost:8080`でrailsにつなぐことができます。
IPを指定しないとなぜか上手くいかないことについて心当たりがある方は教えてください。

#vagrantfile
```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
  config.vm.synced_folder "src/", "/srv/website"
  config.vm.network :forwarded_port, guest: 3000, host: 8080
  config.vm.provision :shell, path: "bootstrap_root.sh"
  config.vm.provision :shell, path: "bootstrap_vagrant_1.sh", privileged: false
  config.vm.provision :shell, path: "bootstrap_vagrant_2.sh", privileged: false
end
```

設定用のスクリプトファイルが3つあるのが今回の工夫点です。
順番に説明します。

## 通常のスクリプト


```bootstrap_root.sh
if [ -f "/vagrant_provision" ]; then
	exit 0
fi

echo '### yun update ###'
yum -y update

echo '### install git ###'
yum install git -y

echo '### install devels ###'
yum install -y openssl-devel readline-devel zlib-devel sqlite-devel

echo '### install gem ###'
yum install rubygems -y
gem update --system

echo '### install gem ###'
yum install gcc-c++ make -y

echo '### install node ###'
curl -sL https://rpm.nodesource.com/setup_11.x | sudo bash
yum install -y nodejs

echo '###################################'
echo '### root provision #1 finished! ###'
echo '###################################'
touch /vagrant_provision
```

yumでインストールします。`sudo`がついてないことからも判る通り、普通に呼び出すとroot権限で実行されます。
ここを意識していなかったので、結構ハマりました。

rubyはもとから入っているので、すっ飛ばしてgemをインストールしています。
しかし、ruby2.0なので、rails5.2では動かせません。

`vagrant_provision`はvagrantのprovisionでよく使われる方法で、2回目以降の実行をさせないための完了を示したファイルです。

## 実行ユーザー用のスクリプト（その１）
```bash:bootstrap_vagrant_1.sh
if [ -f "./vagrant_provision1" ]; then
	exit 0
fi

echo '### install rbenv ###'
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
cd ~/.rbenv 
src/configure 
make -C src
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
echo 'export PATH="$HOME/.rbenv/shims:$PATH"' >> ~/.bash_profile
~/.rbenv/bin/rbenv init

echo '### install ruby-build ###'
git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build

echo '######################################'
echo '### vagrant provision #1 finished! ###'
echo '######################################'
touch ./vagrant_provision1
```

主にrbenvのセットアップをするスクリプトです。
rbenvは複数バージョンrubyを使い分けるためのソフトです。
ユーザーのPATHに書き込みが必要なので、`vagrantfile`で`privileged: false`を付けてvagrantユーザーで実行しています。
(最初はroot権限で実行して、rbenvでruby2.6にしたのに`ruby -v`が2.0のままで、随分時間を喰われました・・・)

で、PATHを有効にするために、一旦スクリプトを終了させています。

## 実行ユーザー用のスクリプト（その２）
```bash:bootstrap_vagrant_2.sh
if [ -f "./vagrant_provision2" ]; then
	exit 0
fi

echo '### install ruby ###'
rbenv install -v 2.6.2
rbenv global 2.6.2

echo '### install rails ###'
gem install rails

echo '### create site ###'
cd /srv
rails new website

echo '######################################'
echo '### vagrant provision #2 finished! ###'
echo '######################################'
touch ./vagrant_provision2
```

こちらは、ruby2.6をインストールして、railsをインストールして、サイトを構築しています。
特に見るべきところは無いです。

しかし、vagrant_provisionという空っぽのファイルが２つ見えるとところにあるのはあまり気分が良くないですね。

# おわりに
サーバ起動まで自動化すべきかもしれませんが、Linuxの知識も、railsの知識も足りません。
`.gitignore`はもう少しrailsになれたら足しておきます。
forkして下されば幸いです。

質問下さればうれしいのでできる限りお応えしますが、ひょっとしたらプログラムQAサイトにリンクを貼った方が答えが得られるかもしれません。

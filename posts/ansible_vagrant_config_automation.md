---
title: "Ansibleを使って自分用のVagrant環境構築の自動化をしてみた"
date: 2016-02-13T00:44:04.000Z
updated: 2016-04-04T10:38:21.000Z
tags: 
  - Ansible
  - Apache
  - Vagrant
---


少しAnsibleについて触ってみたので、メモを残しておきます。


## 目次

- [背景](#background)
- [構築目標](#goal)
- [Vagrantfileを用意する](#vagrant)
- [Ansibleの設定](#ansible)
  - [Ansibleのインストール](#install)
  - [Ansibleの設定ディレクトリの構造](#directory)
- [ApacheのVirtualDocumentRoot](#apache)
- [今回のデータ](#data)
- [雑感](#other)


## <a name="background">背景</a>

元々Vagrantは使ってたのですが、Chefは利用しておらずSSHで直接設定変更していたため、全くもって環境の共有や移動・復帰について考えていませんでした。

しかし、最近PCの調子が悪くなり、クリーンインストールをしたのですが、ローカルの開発環境構築で<del>どうやって構築したのかメモすらしてなかったため</del>面倒なことがあり、どうせなら自動化させたいな、と思い色々と調べてみました。

そこでAnsibleという自動実行ツールがあることを知り、こっちの方が面白そうだなぁと思い、自分用のVagrant環境構築の設定を用意してみたためメモを残しておきます。


## <a name="goal">構築目標</a>

自分用のローカル開発環境については、下記のような状態で構築しています。

- LAMP（CentOS7 + Apache2 + MariaDB + PHP5.6）
- RPMForge, epel, remiのyumリポジトリを追加（念のため）
- ApacheのVirtualDocumentRootを設定して、サブドメイン運用を楽にする（ドキュメントルートを分けたい）

という感じです。基本的には、1台だけ構築するけど複数のサイトを別のドキュメントルートに分けたい、というモノグサ設定という感じです。


## <a name="vagrant">Vagrantfileを用意する</a>

Vagrantfileもモノグサ設定です。簡単な記述しか用意していません。

また、ネットワークの遅延対策として[こちらの記事](http://blog.shibayu36.org/entry/2013/08/12/090545)と、OSXで80番ポートを利用する際に、直接hostのポートを80にするとうまく動かないので、[こちらの記事](http://qiita.com/hidekuro/items/a94025956a6fa5d5494f)を参考にさせていただいています。

```ruby
Vagrant.configure(2) do |config|
    # boxファイルもbentoから拝借
    config.vm.box = "bento/centos-7.2"

    # via: http://qiita.com/hidekuro/items/a94025956a6fa5d5494f
    # ポート番号は10080 -> 80
    config.vm.network "forwarded_port", guest: 80, host: 10080
    config.vm.network "forwarded_port", guest: 22, host: 2200

    # up, reload 時に PF 設定
    config.trigger.after [:provision, :up, :reload] do
        system('echo "rdr pass on lo0 inet proto tcp from any to 127.0.0.1 port 80 -> 127.0.0.1 port 10080" | sudo pfctl -ef - > /dev/null 2>&1')
        system('echo "set packet filter 127.0.0.1:80 -> 127.0.0.1:10080"')
    end

    # halt, destroy 時に PF をリセット
    config.trigger.after [:halt, :destroy] do
        system("sudo pfctl -df /etc/pf.conf > /dev/null 2>&1")
        system('echo "reset packet filter"')
    end

    # via: http://blog.shibayu36.org/entry/2013/08/12/090545
    # IPv6とDNSでのネットワーク遅延対策で追記
    config.vm.provider :virtualbox do |vb|
      vb.customize ["modifyvm", :id, "--natdnsproxy1", "off"]
      vb.customize ["modifyvm", :id, "--natdnshostresolver1", "off"]
    end

    # ansible を実行
    config.vm.provision "ansible" do |ansible|
        ansible.playbook = "provisioning/site.yml"
        ansible.inventory_path = "provisioning/vagrants"
        ansible.limit = 'all'
    end
end
```


## <a name="ansible">Ansibleの設定</a>

### <a name="install">Ansibleのインストール</a>

既にVagrantfileにansibleの設定を記述してしまいましたが、インストールを行います。

自分の環境の場合はMacなので、brewコマンドで一発です。

```shell
brew install ansible
```

その他、pip（pythonのパッケージソフトウェア）を使ってインストールすることも可能です。[公式サイトに色々なインストールの方法が記載されています](http://docs.ansible.com/ansible/intro_installation.html)ので、そちらが参考になるかと思います。

### <a name="directory">Ansibleの設定ディレクトリの構造</a>

Ansibleのベストプラクティスという形で、ディレクトリ構造を一定のルールで配置すると、自動的に必要なファイルを読みに行ってくれるようになります。

書き始めると結構長くなりますし、[既に綺麗にまとめられている記事があります](http://knowledge.sakura.ad.jp/tech/3084/)ので、今回は省略します。

と、いうことで、自分のVagrant環境の自動化を行う場合のディレクトリ構造としては下記のようになりました。

```yaml
/
  - host_vars/
    - vagrants.yml
  - roles/
    - httpd/
      - files/
        - virtual.conf
      - handler/
        - main.yml
      - tasks/
        - main.yml
    - mariadb/
      - tasks/
        - main.yml
      - templates/
        - my.cnf.j2
    - php/
      - tasks/
        - main.yml
    - yum_repos/
      - tasks/
        - main.yml
  - site.yml
  - vagrants
  - vagrants.yml
```


## <a name="apache">ApacheのVirtualDocumentRoot</a>

ApacheのVirtualDocumentRootを利用すると、ディレクトリを分けるだけでサブドメインを変更する切り分けることができます。

今回はローカル環境なので、簡単な設定になっています。

```apacheconf
<VirtualHost *:80>
  ServerName localhost
  ServerAlias *.localhost
  VirtualDocumentRoot /vagrant/www/%1/htdocs

  <Directory /vagrant/www/*/htdocs/>
    Options FollowSymLinks
    AllowOverride All
    Require all granted
  </Directory>
</VirtualHost>
```

上記のように設定すると、

```shell
ローカル環境                  Vagrant環境                  URL
/path/to/www/foo/htdocs  ->  /vagrant/www/foo/htdocs  ->  http://foo.localhost/
/path/to/www/bar/htdocs  ->  /vagrant/www/bar/htdocs  ->  http://bar.localhost/
```

というように繋がるようになります。


## <a name="data">今回のデータ</a>

[GitHubにコミットしました。](https://github.com/sus-happy/VagrantAnsible)使い方間違ってるよ、であったり、ここマズイよ、という点がありましたらご指摘いただけると助かります。


## <a name="other">雑感</a>

環境の共有について先延ばしにしてしまっていましたが、今回のクリーンインストールで、同じ環境を構築する難しさを実感したので、自動化出来るとかなり便利になりそうな気がしてきました。

取り急ぎ自分用なので、新しい端末になった時や、また調子が悪くなった時に実感するんでしょうが、もっと大きなチームで開発するときはまた違うのでしょう。

Ansibleだけでなく、Chef Zeroというツールもありますが、どちらが良いのかは自分にはハッキリとはわかりません。とは言え、効率化を推し進める方策を取って行きたいですね。
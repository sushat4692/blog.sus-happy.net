title: "Twilio APIを使ってPHP経由でSMSを送信してみた"
date: 2014-06-15T00:38:20.000Z
updated: 2016-04-03T11:01:11.000Z
tags: 
  - PHP
  - Twilio
---

クラウド電話APIのTwilioをPHPで使ってSMSを送信する機会があったので、今後のためにも残しておきます。


## Twilioについて

[Twilio](http://twilio.kddi-web.com/)とは、Web上で電話を操作することが出来るクラウド電話サービスで、APIも提供されているため、Webシステムと連動して利用することが出来ます。

最近では本人認証のために、電話番号を入力→電話 or SMSで認証コードを通知という流れがあるかと思いますが、そういった電話やSMSの送信を自動的に制御する、といったことが出来るようになります。


## Twilio API

Twilio APIは「Twilio REST API」というREST形式も提供されており、HTTP通信で操作を行うことが出来ます。Twitter APIやFacebook API等の最近主流の方法ですね。  
 他にも「Twiml」という独自の形式や、「Client API」という形式も存在しているようですが、今回は使用していません。

また、PHP、.NET(C#)、Python、Java、Ruby、nodejs等のライブラリが提供されているため、これらの言語ではRESTのやり取りもほぼ気にしなくてもプログラムすることが出来ます。

[Twilio APIの裏側では何が行われているのか説明されているスライド](http://www.slideshare.net/shin1x1/twilio-api-php-27402275)がありましたので、そちらを見ていただくと分かりやすいかと思います。


## 実装

### PHPライブラリを取得

前述したとおり、[Twilioを利用するためのPHPライブラリが配布](https://jp.twilio.com/docs/libraries)されていますので、コチラを利用することにします。  
 ちなみに、Codeigniter、Drupal、FuelPHP用のライブラリも用意されているようですね、素敵。

Composerからもインストール出来るみたいですが、コチラは勉強不足です…。

### SMS送信処理例

下記のように記述することで、特定の番号にSMSを送ることが出来ます。

```php
<?php

$to = '09012345678'; // 送信先

// ログイン後のダッシュボードに記載されている情報を入れる
$user_id    = 'dummy_user_id';
$auth_token = 'dummy_auth_token';

// Twilioで購入した番号を入力
$from       = '+18*********';

require_once( 'path/to/Twilio.php' );
$client = new Services_Twilio( $user_id, $auth_token );

try {
    $client->account->messages->create( array(
        'To'   => preg_replace( '/^0/', '+81', $to ),  // 送信先 国際電話になるので、頭の0を+81に変換
        'From' => $from,                               // 送信元
        'Body' => $body,                               // メール本文
    ) );
} catch( Services_Twilio_RestException $e ) {
    die( $e->getMessage() );
}
```

非常にシンプルです。

ちなみに画像を送信することも可能で、その場合は「MediaUrl」に画像ファイルのURLを入れてパラメータに渡すと送信できるみたいです。

### 注意点

Twilioの公式サイトにも記載がありますが、SMS送信を利用する場合は幾つか注意点がありますのでご注意ください。

- 現状ではTwilioからSMSを送信する場合、アメリカの番号からしか送信出来ないため、番号購入時にはアメリカの番号を選択する必要があります
- そのため、国際電話経由のSMS送信となり、**「遅配や未達が発生する可能性」**があったり、**「au宛にはhttp(s)://という文字列を含んだメールが届かない」**という制約が存在します

その他、幾つか注意点がありますので、参考サイトをご確認ください。  
 参考：[Twilio SMS | 機能 | Twilio for KDDI Web Communications](http://twilio.kddi-web.com/function/sms/)


## 参考

- [Twilio for KDDI Web Communications | クラウド電話API](http://twilio.kddi-web.com/)
- [Twilio ドキュメント](https://jp.twilio.com/docs)
- [Twilio APIライブラリ – PHP, C#, Python, Java, Ruby](https://jp.twilio.com/docs/libraries)
- [Twilio API を PHP で触ってみよう](http://www.slideshare.net/shin1x1/twilio-api-php-27402275)


## 追記 14/06/16

トライアルについても少し調べていたのですが、残し忘れていたのでこちらもメモメモ。

### 契約までの流れ

1. [Twilioサイト](http://twilio.kddi-web.com/)にアクセス
2. 画面右上「サインアップ」をクリック
3. 名前、メールアドレス、パスワードを入力
4. 携帯番号を入力（認証のため）  
 ※国際番号での入力のため、最初の0を抜いて入力します  
 例）[ +81 ] 90 1234 5678
5. 携帯に届いた認証コードを入力
6. 電話番号を手に入れましょう。  
 「手に入れましょう。」をクリック
7. アメリカ番号を選択（SMS送信がアメリカ番号のみ対応のため）  
 いずれかの番号右の「始めましょう」ボタンをクリック  
 ※番号は何番でも問題ありません。
8. 画面下「あなたのアカウントに行きましょう」クリックで完了  
 ※契約直後トライアル期間中は無料です。

### トライアル期間について

トライアル期間については、**「一定額の無料金額」**という設定がなされているそうで、1ヶ月や2ヶ月の様な期間設定ではありません。  
 また、金額設定は非公開のようですので、急に停止してしまう可能性もあるみたいですね。

その他の制約としては、**「認証を行った番号にしか送信出来ない」**という所も考慮する必要があるかと思います。

また、トライアルアカウント終了後、ちょっと複雑な契約がなされているみたいなので、ただのテストで契約を行っている場合は、番号を手放しておいたほうが良さそうです。  
 参考：[無料トライアル中「使用状況」を見ると料金が表示されています。支払う必要がありますか？ : Twilio for KDDI Web Communications](https://twilioforkwc.zendesk.com/entries/23795853-%E7%84%A1%E6%96%99%E3%83%88%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%AB%E4%B8%AD-%E4%BD%BF%E7%94%A8%E7%8A%B6%E6%B3%81-%E3%82%92%E8%A6%8B%E3%82%8B%E3%81%A8%E6%96%99%E9%87%91%E3%81%8C%E8%A1%A8%E7%A4%BA%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%81%BE%E3%81%99-%E6%94%AF%E6%89%95%E3%81%86%E5%BF%85%E8%A6%81%E3%81%8C%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99%E3%81%8B-)
title: "Unity（UnityScript）とFlash（AIR for iOS/Android）のP2Pについて調べたのでメモ"
date: 2015-04-05T18:22:21.000Z
updated: 2016-04-03T10:34:03.000Z
tags: 
  - Android
  - Flash
  - iOS
  - Unity
  - UnityScript
---


P2Pについて色々と調べている中で、UnityとFlashについて一旦テストで実験までしてみたので、忘れても良いようにメモを残しておきます。

なお、「P2P通信すること」だけが目的だったため、Unityのゲームエンジンとしてのオブジェクトの同期処理等は調べていないためその辺りの説明は省いています。


## 目次

- [Unity（UnityScript）でのP2P](#unity-head)
- [Flash（AIR for iOS/Android）でのP2P](#flash-head)


## <a name="unity-head">Unity（UnityScript）でのP2P</a>

NetWorkViewsというコンポーネントが提供されているので、そちらを利用すると容易に実装する事が可能です。

詳しくドキュメントは読んでいませんが、実行した端末の内1台をホストとして用い、他の端末をホスト端末のIP/ポートに接続することで実現するようです。

### ホストとして接続

まずはネットワーク内の1台をホストとして接続させます。

```javascript
var port:int = 65535;
Network.InitializeServer( 10, port, false );
```

### ホストに接続

他の端末はホストに接続しているIPとポートに接続します。

```javascript
var ip:String = '192.168.***.***';
var port:int  = 65535;
Network.Connect( ip, port );
```

### コールバック

接続完了、切断など、それぞれの処理時のコールバック関数が用意されています。

```javascript
private function OnDisconnectedFromServer()
{
    // サーバから切断
}

private function OnPlayerDisconnected( pl: NetworkPlayer )
{
    // 他のプレイヤーが切断
}

private function OnServerInitialized()
{
    // サーバ初期化完了
    // Network.InitializeServer完了
}

private function OnConnectedToServer()
{
    // サーバに接続
    // Network.Connect完了
}

private function OnFailedToConnect()
{
    // 接続失敗
}
```

### データ通信

端末同士で通信をする際は、RPCを用いて別端末のメソッドに引数を渡してコールすることで実現します。  
 また、RPCで実行する関数には、「**@RPC**」（C#だと「**[RPC]**」）とラベリングする必要があります。

```javascript
private var nView: NetworkView;

// データ送信
public function sendMessage( msg: String )
{
    nView.RPC( 'fugaFunctions', RPCMode.ALL, msg );
}

// データ受信
@RPC
private function fugaFunctions( msg ) {
    Debug.Log( msg );
}
```

また、RPCに渡せる引数の型は、「int, float, string, NetworkPlayer, NetworkViewID, Vector3, Quaternion」の内のいずれかで、一度に渡せるデータ量は4KB以内であること、という制限があります。


## <a name="flash-head">Flash（AIR for iOS/Android）でのP2P</a>

Flashには、Adobe社が開発しているRTMFPを活用したP2P通信が可能となっています。Unityとは異なりホストを用意する必要がなく、ネットワーク自体に名前を付け、「同じ名前のネットワークに接続している端末」にデータを通信することが可能です。

また、以降のサンプルコードにはimportの表記を抜いていますので、ご利用の際は必要な内容を追記下さい。

### Adobe Cirrusに接続する

この辺り詳しくは調べていないのですが、Adobe Cirrus（以前はAdobe Stratus？）にピア同士を接続する仲介を頑張ってもらいます。  
 その際に開発者キーが必要となりますので、[Adobeのサイトから取得](https://www.rtmfp.net/cgi-bin/cirrusdevkey)します。（Adobe IDが必要となります）

```javascript
private const SERVER:String = 'rtmfp://p2p.rtmfp.net';
private const DEVKEY:String = '開発者キー';
    
var _connect:NetConnection;

// Cirrusに接続開始
private function doConnect():void
{
    _connect = new NetConnection();
    _connect.addEventListener( NetStatusEvent.NET_STATUS, _netStatusHandler );
    _connect.connect( SERVER, DEVKEY );
}

private function _netStatusHandler( e:NetStatusEvent ):void
{
    switch( e.info.code ) {
    	case 'NetConnection.Connect.Success':
    	    trace( '接続成功' );
    	    break;
    }
}
```

connectの第一引数にnullや「rtmfp:」だけを入力する場合もあるそうですが、違いについては詳しく調べていません。また調査してみます。

### ネットワークに接続する

Cirrusに接続ができたらネットワークに接続します。  
 この時にネットワークに名前を付けることで、ローカルネットワーク全体が対象、という訳ではなく特定の端末と接続出来るようになります。（com.example.application というようなドメイン+アプリケーション名で付けるのが分かりやすく、一般的らしい）

その他、GroupSpecifierクラスの属性がネットワークの仕様となり、一度ネットワークに接続すると途中で変更することが出来ないのでご注意下さい。（[それぞれの属性についてはコチラを参照ください](http://help.adobe.com/ja_JP/FlashPlatform/reference/actionscript/3/flash/net/GroupSpecifier.html)）  
 今回はメッセージのやり取りを行えるように「**postingEnabled**」と「<string>serverChannelEnabled</string>」をtrueにしておきます。

```javascript
// _netStatusHandler以外の前述の例
    
var _groups:NetGroup,
    _groupspec:GroupSpecifier;

// ネットワークに接続開始
private function onConnect():void
{
    _groupspec = new GroupSpecifier( 'ネットワーク名' );
    _groupspec.postingEnabled = true;
    _groupspec.serverChannelEnabled = true;
    
    // NetGroupには、Cirrusに接続したNetConnectionとGroupSpecifierの文字列化したデータを渡す
    _groups = new NetGroup( _connect, _groupspec.toString() );
    _groups.addEventListener( NetStatusEvent.NET_STATUS, _netStatusHandler );
}

// 前述の例に追記してます
private function _netStatusHandler( e:NetStatusEvent ):void
{
    switch( e.info.code ) {
    	case 'NetConnection.Connect.Success':
    	    trace( '接続成功' );
    	    onConnect();
    	    break;
    	case 'NetGroup.Connect.Success':
            trace( 'ネットワークに接続成功' );
            break;
        case 'NetGroup.Neighbor.Connect':
            trace( '同じネットワークに別の端末が接続' );
            break;
    }
}
```

### データ通信

データの送信はNetGroupのpostメソッドを呼ぶだけですが、前述のとおりpostingEnabledがtrueになっていないと利用することは出来ません。

受け手側はNetStatusEvent.NET_STATUSが呼ばれるので、「NetGroup.Posting.Notify」というコードで判別して処理します。  
 また、同じデータをpostしようとすると送信する前に自動的に破棄してしまうので、シーケンス番号を付与しておいた方が良いようです。

```javascript
// _netStatusHandler以外の前述の例

// シーケンス番号
private var _ID:int = 0;

// データ送信
private function sendMessage( msg: String ):void
{
    var message = new Object();
    message.ID  = _ID ++;
    message.msg = msg;
    message.sender = _connect.nearID;
    
    _groups.post( message );
}

// データ受信
private function onGetMessage( message: Object ):void
{
    trace( message.msg );
}

// 前述の例にさらに追記してます
private function _netStatusHandler( e:NetStatusEvent ):void
{
    switch( e.info.code ) {
    	case 'NetConnection.Connect.Success':
    	    trace( '接続成功' );
    	    onConnect();
    	    break;
    	case 'NetGroup.Connect.Success':
            trace( 'ネットワークに接続成功' );
            break;
        case 'NetGroup.Neighbor.Connect':
            trace( '同じネットワークに別の端末が接続' );
            break;
        case 'NetGroup.Posting.Notify':
            onGetMessage( e.info.message );
            break;
    }
}
```

また、Flashの場合も送信できる型に制限があり、「Object,int,Number,String」のいずれかである必要があります。（制限サイズは分かりませんが結構大きなデータも一気に送信できていました）


## 雑感

まだ接続してメッセージ送る程度の内容なので、もっと便利な仕組みがあるはずですが、それぞれに一長一短がありそうですね。  
 実際にAndroidまでは同期しているコトを確認出来て、面白そうな事が出来そうで楽しく実験できました。  
 もうちょっと試してみて今回必要な仕組みに最適なモノを活用していきたいと思います。


## 参考

### Unity

- [Unity NetworkViewでシンプルChatを作ってみる : ブリブサー開発戦線　〜僕らはあの戦いを忘れない〜](http://blog.livedoor.jp/bribser_dev/archives/3628336.html)
- [Unity – マニュアル: ネットワーク リファレンス ガイド](http://docs.unity3d.com/ja/current/Manual/NetworkReferenceGuide.html)

### Flash

- [RTMFP 上の 1 対 1 ストリーミング （NetConnection 編） – akihiro kamijo](http://cuaoar.jp/2010/03/rtmfp-1-1.html)
- [RTMFP 上の 1 対 1 ストリーミング （NetStream 編） – akihiro kamijo](http://cuaoar.jp/2010/03/rtmfp-1-1-netstream.html)
- [RTMFP ストリームのアクセス制御 – akihiro kamijo](http://cuaoar.jp/2010/03/rtmfp.html)
- [NetConnection – Adobe ActionScript® 3（AS3 ）API リファレンス](http://help.adobe.com/ja_JP/FlashPlatform/reference/actionscript/3/flash/net/NetConnection.html)
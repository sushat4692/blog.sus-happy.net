---
title: "ReactPixiでコンテクスト（Context）を渡す"
date: 2022-09-10T20:16:00.000Z
updated: 2022-09-10T20:16:00.000Z
tags: 
  - JavaScript
  - React
  - PixiJS
thumbnail: "/content/images/2022/08/react-pixi.png"
---

[ReactにはContextというコンポーネント間でデータを受け渡す機能](https://ja.reactjs.org/docs/context.html)があります。この機能を活用すると、基本的には指定のコンポーネントの子コンポーネントで利用する事が出来るようになるのですが、ReactPixiはCanvas要素を使っている関係もあってか、そのままではReactPixiのコンポーネントではContextのデータを受け取ることが出来ません。

## PixiJS、ReactPixiとは

[PixiJS](https://pixijs.com/)は、通常のアニメーションはもちろん、スプライトアニメーションなどにも対応している2Dに特化したWebGLにも対応しているレンダリングエンジンです。

そのPixiJSをReact上でも利用しやすいコンポーネントの形で用意されたライブラリが[ReactPixi](https://reactpixi.org/)です。コンポーネントのプロパティから表示位置やスプライト画像を指定することが出来るため、Reactの機能を使いながらPixiJSのレンダリングエンジンを活用することが可能です。

## ContextをReactPixiで使う時の問題点と解決方法

ReactPixiのコンポーネント下では、そのまま記述するだけではContextの伝播は行われず、値を取得することが出来ません。

```tsx
import { createContext } from "react";
import { Stage, Sprite } from "@inlet/react-pixi";

// Contextの作成
const FooContext = createContext(true);

// ReactPixiのコンポーネント
const MySprite: React.FC = () => {
  // 取得できない
  const fooValue = useContext(FooContext);
  
  return (
    <Sprite />
  );
}

// 親コンポーネント、ここでContextを宣言する
const App: React.FC = () => {
  return (
    <FooContext.Provider value={true}>
      <Stage>
        <MySprite />
      </Stage>
    </FooContext.Provider>
  );
}
```

### Context Bridgeを利用する

そこで、[Context Bridge](https://reactpixi.org/context-bridge)という機能が用意されていますので、この機能を活用することでReactPixiのコンポーネントにも値を渡すことが可能です。

（ほぼマニュアルのコピペになりますが…TypeScriptの型定義も追加した場合）

```tsx
import { createContext } from "react";
import { Stage, Sprite } from "@inlet/react-pixi";

// Contextの作成
const FooContext = createContext(true);

// Context Bridgeの準備
// ここでContextを宣言することになる
type ContextBridgeProps = {
  Context: React.Context<boolean>;
  render: (children: React.ReactNode) => React.ReactNode;
}
const ContextBridge: React.FC<ContextBridgeProps> = ({ children, Context, render }) => {
  return (
    <Context.Consumer>
      {value => render(<Context.Provider value={value}>{children}</Context.Provider>)}
    </Context.Consumer>
  );
}

// ContextBridgeを使った独自Stageを準備
const StageProps = React.ComponentProps<typeof Stage>;
const MyStage: React.FC<StageProps> = ({ children, ...props }) => {
  return (
    <ContextBridge
      Context={FooContext}
      render={(children) => <Stage {...props}>{children}</Stage>}
    >
      {children}
    </ContextBridge>
  );
}

// ReactPixiのコンポーネント
const MySprite: React.FC = () => {
  // 取得できるようになる
  const fooValue = useContext(FooContext);
  
  return (
    <Sprite />
  );
}

// 親コンポーネント
const App: React.FC = () => {
  return (
    <MyStage>
      <MySprite />
    </MyStage>
  );
}
```

結構長い記述が必要になりますが…これで各ReactPixiのコンポーネントでContextの値が取得出来るようになります。


## Recoilを利用した場合の対応

Recoilも同様にそのまま記述すると値の伝播が行われませんので、[Recoil側にBridgeの機能が用意されています](https://recoiljs.org/docs/api-reference/core/useRecoilBridgeAcrossReactRoots)ので、こちらを利用する必要があります。

※ただし、フック名からも分かるように動作は不安定な時もあるようです。

```tsx
import { createContext } from "react";
import {
  atom,
  useRecoilState,
  RecoilRoot,
  useRecoilBridgeAcrossReactRoots_UNSTABLE
} from 'recoil';
import { Stage, Sprite } from "@inlet/react-pixi";

// Atomの作成
const FooState = atom({
  key: 'foo',
  default: false,
});

// Recoil Bridgeを使った独自Stageを準備
const StageProps = React.ComponentProps<typeof Stage>;
const MyStage: React.FC<StageProps> = ({ children, ...props }) => {
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();
  
  return (
    <Stage {...props}>
      <RecoilBridge>
        {children}
      </RecoilBridge>
    </Stage>
  );
}

// ReactPixiのコンポーネント
const MySprite: React.FC = () => {
  // 取得できるようになる
  const [foo, setFoo] = useRecoilState(FooState);
  
  return (
    <Sprite />
  );
}

// 親コンポーネント
const App: React.FC = () => {
  return (
    <RecoilRoot>
      <MyStage>
        <MySprite />
      </MyStage>
    </RecoilRoot>
  );
}
```

## 雑感

アニメーションが必要な場合はPixiJS、インタラクティブな処理が必要な場合はReactが便利なので、インタラクティブなアニメーションを制作する時にはReactPixiを活用すると色々な動きを効率的に作れそうな感じを受けました。

ContextやRecoilも使えることが分かったので、Canvas内外問わず大きくコンポーネントが離れていても互いに値の受け渡しを行うことができそうなので、色々と試してみようと思います。

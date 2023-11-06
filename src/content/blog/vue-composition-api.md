---
title: "Vue Composition APIについて触ってみた"
date: 2019-10-20T07:43:00.000Z
updated: 2019-10-20T07:43:00.000Z
tags:
    - JavaScript
    - Vue.js
    - Nuxt.js
thumbnail: "../../assets/images/2019/10/vue.png"
---

Vue3がそろそろ公開されそうな雰囲気なので、ちょっと先にVue Composition APIをつかってみました。

[Composition API RFC](https://vue-composition-api-rfc.netlify.com/)をボチボチ読んで、[Class Component](https://github.com/vuejs/vue-class-component)で書いてたものを変換してみたのでその時のメモを残しておきます。

## Props

`props`は`setup`の第一引数から取得可能。

```ts
<template>
  <p>{{ foo }}</p>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

// Propsの型推論用
type Props = {
  foo: string,
  bar: number
}

export default createComponent({
  // createComponent内でpropsを定義する
  // 定義の仕方は通常のVueと一緒
  props: {
    foo: { type: String, { default: 'hoge' } },
    bar: { type: Number, { required: true } }
  },
  // setupの第一引数でpropsを取得できる
  setup(props: Props) {
    // props.foo
  }
})
</script>
```

## Data

`reactive`や`ref`で定義した変数を`setup`内で返してあげると、テンプレート内でも利用できるリアクティブな変数、`data`と同じ様な扱いになる様子。

```ts
<template>
  <p>{{ foo }}</p>
</template>

<script lang="ts">
import { createComponent, reactive, toRefs } from '@vue/composition-api'

// リアクティブな変数を返す
const createComponentState = () => {
  const state = reactive({
    foo: 'bar'
  })

  // そのまま返すと...componentState を実行する時に
  // リアクティブが切れちゃうので、toRefsを通す
  return toRefs(state)
}
type ComponentState = ReturnType<typeof createComponentState>

export default createComponent({
  setup() {
    // setup内で関数を実行する
    const componentState = createComponentState()

    // returnするとtemplate内で利用できる
    return {
      ...componentState
    }
  }
})
</script>
```

## Computed

まさに`computed`という関数があるので、こちらを利用して用意した値を`setup`内で返してあげれば`computed`と同じ様な扱いに。

また、computed内で`set`/`get`に対して関数を渡してあげれば、setter/getterも対応が可能。

```ts
<template>
  <p>{{ foo }}</p>
</template>

<script lang="ts">
import { createComponent, reactive, computed, toRefs } from '@vue/composition-api'

// Injectするキーと型を取得する
import { SomethingStore, SomethingStoreKey } from 'path/to/store'

// リアクティブな変数を返す
const createComponentState = (store: SomethingStore) => {
  const state = reactive({
    // Getterのみ
    foo: computed(() => {
      return store.foo
    }),
    // Setterも使う時はget,setを指定する
    bar: computed({
      get: () => {
        return store.bar
      },
      set: (val) => {
        store.bar = val
      }
    })
  })

  return toRefs(state)
}
type ComponentState = ReturnType<typeof createComponentState>

export default createComponent({
  setup() {
    // Injectでstoreの情報を取得して、コンポーネント変数作成時に渡す
    // Vuexでも別に良い、その時は多分setup関数の第2引数context内のrootを使う形になりそう
    const store = inject(SomethingStoreKey)
    const componentState = createComponentState(store)

    return {
      ...componentState
    }
  }
})
</script>
```

## Methods

`setup`内で関数を返してあげればテンプレート内から呼び出せる。

```ts
<template>
  <div>
    <button @click="clickHandler">Button</button>
    <button @click="complexClickHandler">Complex Button</button>
  </div>
</template>

<script lang="ts">
import { createComponent, reactive, toRefs } from '@vue/composition-api'

// リアクティブな変数を返す
const createComponentStore = () => {
  const state = reactive({
    // ... 省略
  })
  return toRefs(state);
}
type ComponentState = ReturnType<typeof createComponentState>

// setup内に関数を返すための関数
// 変数を受け取れるようにしておき、setup内で定義したデータの受け渡しをする
const useComplexClickHandler = ({ componentState }: { componentState: ComponentState }) => {
  return () => {
    // クリックされて実行する処理をココに記入する
  }
}

export default createComponent({
  setup() {
    const componentState = createComponentStore()

    // setupで返してあげればtemplate内で利用できる
    const clickHander = () => {
      window.alert('Clicked')
    }

    // ややこしい処理をする時はsetupの外に出すことを推奨されている
    // また、外に出すことができるので、mixinじゃなくても共通化が可能
    // setup内で生成したリアクティブな変数を渡すことで、状態を保つ
    const complexClickHandler = useComplexClickHandler({ componentState })

    return {
      ...componentState,
      clickHandler,
      complexClickHandler
    }
  }
})
</script>
```

## Watch

`watch`関数が用意されてるので、そちらを利用すればOK。

ちょっと注意しないといけないと思ったのが、`watch`は`reactive`や`ref`、`computed`で定義したような、リアクティブな変数しか受け付けていないので、propsの値をそのまま渡すことは出来ない様子。

取りあえずは一度`computed`に通した値を渡すようにしていますが、何が正解なのかな？

```ts
<template>
  <p>{{ foo }}</p>
</template>

<script lang="ts">
import { createComponent, reactive, toRefs, watch } from '@vue/composition-api'

// Propsの型推論用
type Props = {
  foo: string
}

// リアクティブな変数を返す
const createComponentStore = ({ props }: { props: Props }) => {
  const state = reactive({
    // watch関数はリアクティブな変数を型指定されているので
    // computedを通してリアクティブな変数にする
    fooRef: computed(() => {
      return props.foo
    })
  })
  return toRefs(state);
}
type ComponentState = ReturnType<typeof createComponentState>

export default createComponent({
  setup(props: Props) {
    // computed用にpropsを渡す
    const componentState = createComponentStore({ props })

    // propsを直接渡せないので、一度computedに通した値を渡す
    watch(componentState.fooRef, (newVal) => {
      console.log(newVal)
    })

    return {
      ...componentState
    }
  }
})
</script>
```

### その他仕様

#### 全体をウォッチ

`watch`の第一引数に関数を渡すと、コンポーネント内のリアクティブな変数いずれかの値が変わると実行される。

```ts
watch(() => {
    // 何かが変われば実行される
});
```

#### 複数の値を対象にする

第一引数に配列を渡すと複数の値に対して監視が行え、実行する関数の変更後の値も配列で返される。

```ts
watch([fooRef, barRef], ([newFoo, newBar], [prevFoo, prevBar]) => {
    // fooRefまたはbarRefが変われば実行される
});
```

#### 初期化

`watch`実行する前に値を初期化しておきたい場合、初期化関数が用意されている。

実行されるタイミングはこんな時。

-   `watch`が再実行された時
-   `watch`が停止された時（`stop`が実行されたり、アンマウントされた時など）

また、使い方は二種類。

```ts
// 第一引数に関数を渡し時は、第一引数に初期化関数が渡される
watch((onCleanup) => {
    onCleanup(() => {
        // ココで初期化する
    });
});

// 第一引数に関数を渡し時は、第三引数に初期化関数が渡される
watch(fooRef, (newFoo, oldFoo, onCleanup) => {
    onCleanup(() => {
        // ココで初期化する
    });
});
```

他にも色々あるみたいだけど、一旦ここまで…。

## Emit

`setup`の第二引数の`context`内に`emit`が含まれているので、それを活用すればOK。

```ts
<template>
  <button @click="clickHandler"></button>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

export default createComponent({
  // setup関数の第二引数の中にemitが含まれている
  setup(_props, { emit }) {
    const clickHandler = (e) => {
      // 使い方は$emitと同じ様な感じ
      emit('click', e)
    }

    return {
      clickHandler
    }
  }
})
</script>
```

## $el/$ref

`$el`は無いっぽい。`$ref`はテンプレート内でref属性を指定した名称と同じ変数名の`ref`を用意してあげればアクセスできるようになる。

~~最初何故か反映されない、と思っていたら`setup`からreturnするの忘れていたというのは内緒。~~

```ts
<template>
  <p ref="foo">{{ foo }}</p>
</template>

<script lang="ts">
import { createComponent, ref, onMounted } from '@vue/composition-api'

export default createComponent({
  setup(props: Props) {
    // テンプレートで渡したref属性と同じ名前で用意する
    const test = ref(null)

    onMounted(() => {
      console.log(test) // -> <p ref="foo">
    })

    return {
      test
    }
  }
})
</script>
```

## ライフサイクルフック

[API Reference](https://vue-composition-api-rfc.netlify.com/api.html#lifecycle-hooks)に書いてある通りだけど…

`beforeCreate`と`created`は`setup`内で書いちゃえばOK。

| Before         | After   |
| -------------- | ------- |
| `beforeCreate` | `setup` |
| `created`      | `setup` |

他はon...という関数が用意されてます。

| Before          | After             |
| --------------- | ----------------- |
| `beforeMount`   | `onBeforeMount`   |
| `mounted`       | `onMounted`       |
| `beforeUpdate`  | `onBeforeUpdate`  |
| `updated`       | `onUpdated`       |
| `beforeDestroy` | `onBeforeUnmount` |
| `destroyed`     | `onUnmounted`     |
| `errorCaptured` | `onErrorCaptured` |

また、新しく2つのデバッグ用のフックが追加されてます。

-   `onRenderTracked`
-   `onRenderTriggered`

## 雑感

PHPの経験が元々多いのもあってクラス型の考え方がベースにあるので、関数型の考え方は最初はとっつきづらかったんですが、やってみると面白いですね。

実際にVue3が発表されたときにはどんな実装になるのか楽しみです。

import ReactDOM from "react-dom/server"
import { NextApiRequest, NextApiResponse } from "next"
import { loadDefaultJapaneseParser } from "budoux"
import * as playwright from "playwright-aws-lambda"
import postList from "./posts.json"

const parser = loadDefaultJapaneseParser()

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@900&display=swap');

  * {
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
    display: grid;
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: 900;
    line-height: 1.4;
    overflow: hidden;
    font-size: 10px;
    color: #151515;
  }
  body {
    padding: 3rem;
  }

  div {
    margin: auto;
    text-align: center;
  }

  h1 {
    font-size: 8rem;
    -webkit-text-stroke: 0.2rem #fff;
    margin: 0 0 2rem 0;
  }

  p {
    position: relative;
    display: inline-block;
    font-size: 4.2rem;
    -webkit-text-stroke: 0.15rem #fff;
    margin: 0;
    padding-top: 2rem;
  }
  p::before,
  p::after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 0.15rem
  }
  p::before {
    background: #fff;
  }
  p::after {
    top: 0.15rem;
    background: #151515;
  }
`

const Content = ({ title, thumbnail }) => (
  <html>
    <head>
      <style dangerouslySetInnerHTML={{ __html: styles }}></style>
    </head>
    <body
      style={{
        background: `url(${thumbnail}) no-repeat center center / cover`,
      }}
    >
      <div>
        <h1
          dangerouslySetInnerHTML={{
            __html: parser.translateHTMLString(title),
          }}
        />
        <p>{process.env.NEXT_PUBLIC_SITE_NAME}</p>
      </div>
    </body>
  </html>
)

const ogp = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { slug } = req.query as { slug: string }
    const baseUrl = {
      production: process.env.NEXT_PUBLIC_SITE_URL,
      development: "http://localhost:3000",
    }[process.env.NODE_ENV]

    const post = postList.find(p => p.slug === slug)
    if (!post) {
      throw new Error("Not found by filtering slug")
    }

    // サイズの設定
    const viewport = { width: 1200, height: 630 }

    // ブラウザインスタンスの生成
    const browser = await playwright.launchChromium()
    const page = await browser.newPage({ viewport })

    // HTMLの生成
    const props = {
      title: post.frontmatter.title,
      thumbnail:
        baseUrl + (post.frontmatter.thumbnail ?? "/content/background.jpg"),
    }
    const markup = ReactDOM.renderToStaticMarkup(<Content {...props} />)
    const html = `<!doctype html>${markup}`

    // HTMLをセットして、ページの読み込み完了を待つ
    await page.setContent(html, { waitUntil: "networkidle" })

    // スクリーンショットを取得する
    const image = await page.screenshot({ type: "jpeg", quality: 80 })
    await browser.close()

    // Vercel Edge Networkのキャッシュを利用するための設定
    res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate")

    // Content Type を設定
    res.setHeader("Content-Type", "image/jpeg")

    // レスポンスを返す
    res.end(image)
  } catch (error) {
    console.error("[Error]: ", error)
    res.status(404).json({ message: "Cannot render og-image" })
  }
}

export default ogp

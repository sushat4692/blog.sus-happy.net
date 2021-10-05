import ReactDOM from "react-dom/server"
import { NextApiRequest, NextApiResponse } from "next"
import * as playwright from "playwright-aws-lambda"

const styles = `
  * {
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
    display: grid;
    font-family: sans-serif;
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
    font-size: 16rem;
    line-height: 1.4;
    font-weight: 900;
    -webkit-text-stroke: 0.2rem #fff;
    margin: 0;
  }
`

const Content = ({ thumbnail }) => (
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
        <h1>{process.env.NEXT_PUBLIC_SITE_NAME}</h1>
      </div>
    </body>
  </html>
)

const ogp = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const baseUrl = {
      production: process.env.NEXT_PUBLIC_SITE_URL,
      development: "http://localhost:3000",
    }[process.env.NODE_ENV]

    // サイズの設定
    const viewport = { width: 1200, height: 630 }

    // ブラウザインスタンスの生成
    const browser = await playwright.launchChromium()
    const page = await browser.newPage({ viewport })

    // HTMLの生成
    const props = {
      thumbnail: baseUrl + "/content/background.jpg",
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

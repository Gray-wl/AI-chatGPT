const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
dotenv.config();
const GPT_API_KEY = process.env.OPENAI_API_THISKEY;
const PORT = 3000;

if (!GPT_API_KEY) {
  console.log("请配置 ChatGPT API Key");
  return;
}

const configuration = new Configuration({ apiKey: GPT_API_KEY });
const openai = new OpenAIApi(configuration);

// 解析客户端发送的 URL 编码格式的请求体数据，将其转换为 JavaScript 对象，并将其赋值给 req.body
app.use(express.urlencoded({ extended: true }));
// 通过 request.body 拿到请求体中 json 格式的数据
app.use(express.json());
app.use(cors());

app.post("/convert", async (req, res) => {
  const { value } = req.body;
  
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: value }],
    });
    res.json({
      message: "Successful",
      response: completion.data.choices[0].message.content,
    });
  } catch (err) {
    console.log("completion err:", err);
  }
});

app.listen(PORT, () => {
  console.log(`Node.js 服务正在监听 ${PORT} 端口 ...`);
});

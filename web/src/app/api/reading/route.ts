
export const maxDuration = 120; // Increased duration for reasoning models

export async function POST(req: Request) {
  const { prompt, apiKey } = await req.json();

  // Use provided key, or environment variable, or the hardcoded default fallback
  const token = apiKey || process.env.DEEPSEEK_API_KEY || "sk-374367e566b547a383797a2a15fb9431";
  
  console.log("Using DeepSeek API Key:", token.substring(0, 8) + "...");

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { 
            role: 'system', 
            content: `你是一位居于漫宿（The Mansus）之上的守密人，通晓《密教模拟器》(Cultist Simulator) 与《司辰之书》(Book of Hours) 的所有隐秘历史。
你不再是凡人，而是某种更高维度的存在，通过“司辰塔罗”这一媒介与寻求飞升或解答的凡人沟通。

你的语言风格必须严格遵循以下准则：
1.  **晦涩与诗意**：拒绝平铺直叙。使用隐喻、象征和碎片化的叙事。参考洛夫克拉夫特、亚历克西斯·肯尼迪（Alexis Kennedy）的笔触。
2.  **神秘主义词汇**：频繁使用如“辉光”、“伤口”、“裂隙”、“无形之术”、“防剿局”、“辉光之镜”等术语。
3.  **第二人称**：始终称呼用户为“你”或“寻求者”、“做梦者”。
4.  **性相标注**：当提及特定性相时，必须使用 <Icon name="aspect_name"/> 格式。支持：lantern, grail, moth, winter, heart, edge, forge, knock, sky, moon, nectar, rose, scale, secrethistories。

你的解读结构应当如同一场仪式：
1.  **入梦（The Descent）**：对现状的隐喻描述，仿佛你看到了用户灵魂的颜色或周围的灵体。
2.  **揭示（The Revelation）**：对每一张牌的深度解析。不要只解释牌面，要讲述与该司辰相关的传说、禁忌或历史片段。将牌的含义编织进用户的命运中。
3.  **低语（The Whispers）**：最终的指引、警告或预言。这不应是明确的建议，而是一个需要用户自己去解开的谜题。

请记住，漫宿没有仁慈，只有交易。知识是危险的。` 
          },
          { role: 'user', content: prompt }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API Error:", response.status, errorText);
      return new Response(errorText, { status: response.status });
    }

    // Directly return the stream from DeepSeek to the client
    // This preserves the SSE format (data: {...}) which the client will parse manually
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}


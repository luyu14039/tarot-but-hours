
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

你必须展现出**大师级的解牌技巧**，特别是对于**逆位（Reversed）**的解读。不要机械地认为逆位等于“坏”，而应从以下五个维度进行洞察：
1.  **能量阻滞**：原本的力量被堵住或未能释放（如 <Icon name="forge"/> 的创造力受阻）。
2.  **内在转向**：能量流向内心，象征潜意识与自我觉察（常见于 <Icon name="moth"/> 或 <Icon name="moon"/>）。
3.  **时机延后**：并非不会发生，而是时机未成熟，需要等待（如 <Icon name="winter"/> 的寂静）。
4.  **过度或不足**：正位能量的极端化（如 <Icon name="edge"/> 变得过于暴虐或软弱）。
5.  **挑战出现**：该议题正在接受考验，是成长的契机。

此外，你必须精通**牌阵动力学（Spread Dynamics）**：
1.  **位置的权重**：牌的含义必须结合其所在位置（如“过去”、“现在”、“未来”或“障碍”、“指引”）来解读。同一张牌在不同位置有截然不同的启示。
2.  **元素互动**：观察相邻牌之间的性相（Aspects）关系。例如，<Icon name="winter"/>（静默）可能会抑制 <Icon name="heart"/>（生命）的活力；<Icon name="forge"/>（改变）可能会被 <Icon name="lantern"/>（理智）所引导。
3.  **叙事连贯性**：不要孤立地解读每一张牌。寻找牌与牌之间的共同主题、颜色或符号。将它们串联成一个连贯的故事，讲述用户是如何从过去走到现在，又将如何走向未来。

你的解读结构应当如同一场仪式，内容必须**详实且富有洞见**，切忌简短空洞：
1.  **入梦（The Descent）**：对现状的隐喻描述。仿佛你透过辉光看到了用户灵魂的颜色、周围的灵体或正在发生的无形之战。
2.  **揭示（The Revelation）**：对每一张牌的**深度解析**。不要只解释牌面，要讲述与该司辰相关的传说、禁忌或历史片段。**关键：**虽然语言保持神秘，但必须将这些隐喻与用户的问题建立**清晰且深刻的逻辑联系**。不要让用户感到困惑，而要让他们感到被“看穿”。请展开论述，不要吝啬你的词汇。
3.  **飞升（The Ascension）**：这是关于**破局**的指引。不要只停留在预言，要告诉寻求者如何利用手中的性相（Aspects）去改变命运。是需要 <Icon name="forge"/> 的重铸，还是 <Icon name="moth"/> 的蜕变？给出**积极、具体但带有密教色彩**的行动建议。告诉他们如何从当前的困境中找到通往更高重历史的道路。

请记住，漫宿没有仁慈，只有交易。但你作为守密人，既然收下了他们的“时间”，就有义务给予他们足以改变命运的知识。不要让他们空手而归。` 
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


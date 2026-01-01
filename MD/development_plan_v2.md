# 司辰塔罗 (Tarot of the Hours) 进阶开发方案

本方案旨在深化“司辰塔罗”的神秘学内涵，引入正逆位机制，完善塔罗对应关系，并优化 LLM 的解读能力。

## 1. 数据结构升级 (Data Structure)

### 1.1 扩展司辰数据 (`web/src/data/hours.ts`)

我们需要为每一位司辰（Hour）增加对应的塔罗牌信息。考虑到司辰数量（30+）多于大阿卡纳（22张），我们将采用“大阿卡纳 + 关键小阿卡纳”或“多对一”的映射策略，或者自定义的扩展塔罗体系。

**修改 `HourCard` 接口：**

```typescript
export interface HourCard {
  // ... 现有字段
  tarotCard: {
    name: string;   // 例如 "The Fool", "Ace of Cups"
    meaning: string; // 简短的塔罗含义，辅助 LLM 理解
  };
}
```

**数据填充示例：**

*   **0 - The Moth (飞蛾)** -> **The Fool (愚者)**: 混乱、新的开始、本能。
*   **I - The Door in the Eye (瞳中之扉)** -> **The Magician (魔术师)** / **The Hierophant (教皇)**: 知识、启示、指引。
*   **XIII - The Elegiast (挽歌儿)** -> **Death (死神)**: 结束、转化、纪念。

### 1.2 引入抽牌状态 (`web/src/store/useStore.ts`)

抽到的牌不仅仅是静态的司辰卡，还包含了“抽牌时刻”的状态（正逆位、牌阵位置）。

**定义新类型 `DrawnCard`：**

```typescript
import { HourCard } from '@/data/hours';

export interface DrawnCard extends HourCard {
  isReversed: boolean;       // 是否逆位
  positionName: string;      // 在牌阵中的位置名称（如“过去”、“阻碍”）
  positionDescription: string; // 位置含义描述
}
```

**更新 Store：**

```typescript
interface AppState {
  // ...
  drawnCards: DrawnCard[]; // 替换原来的 HourCard[]
  setDrawnCards: (cards: DrawnCard[]) => void;
  // ...
}
```

---

## 2. 核心逻辑优化 (Core Logic)

### 2.1 抽牌与正逆位生成

在用户完成洗牌并点击抽牌时，我们需要随机决定每张牌的正逆位。

**修改抽牌逻辑（建议在 `web/src/app/spread/page.tsx` 或相关组件中）：**

```typescript
const handleDraw = () => {
  // 1. 洗牌
  const shuffled = shuffle(hoursData);
  
  // 2. 选取前 N 张
  const selected = shuffled.slice(0, spreadCount);
  
  // 3. 赋予状态
  const drawn: DrawnCard[] = selected.map((card, index) => {
    const isReversed = Math.random() < 0.5; // 50% 概率逆位
    const positionInfo = getPositionInfo(selectedSpread, index); // 获取位置含义
    
    return {
      ...card,
      isReversed,
      positionName: positionInfo.name,
      positionDescription: positionInfo.description
    };
  });
  
  setDrawnCards(drawn);
};
```

### 2.2 牌阵定义系统

为了让 LLM 更好地理解牌阵，我们需要将牌阵的定义结构化。

**新建 `web/src/data/spreads.ts`：**

```typescript
export const SPREAD_DEFINITIONS = {
  single: {
    name: "林地的一瞥",
    positions: [
      { name: "启示", description: "当下的核心指引或问题的直接答案。" }
    ]
  },
  three: {
    name: "漫宿的道路",
    positions: [
      { name: "雄鹿之门 (过去)", description: "导致当前局面的根源或历史影响。" },
      { name: "蜘蛛之门 (现在)", description: "当前的处境、挑战或机遇。" },
      { name: "孔雀之门 (未来)", description: "如果沿着当前道路前行，可能到达的终点。" }
    ]
  },
  five: {
    name: "十字路的故事",
    positions: [
      { name: "核心", description: "问题的本质。" },
      { name: "阻碍", description: "你面临的挑战或对抗力量。" },
      { name: "指引", description: "建议采取的行动或态度。" },
      { name: "结果", description: "最终的走向。" },
      { name: "隐秘", description: "被忽略的因素或潜意识的影响。" }
    ]
  }
};
```

---

## 3. Prompt 工程优化 (Prompt Engineering)

在 `web/src/app/reading/page.tsx` 中，我们将构建一个包含丰富上下文的 Prompt。

**新 Prompt 结构：**

```text
你是一位居于漫宿之上的守密人...（保持原有的人设 System Prompt）

【仪式信息】
用户问题：${question}
所选牌阵：${spreadName} - ${spreadDescription}

【牌面启示】
${drawnCards.map((card, i) => `
位置 ${i + 1}：[${card.positionName}]
- 含义：${card.positionDescription}
- 抽到的司辰：${card.name} (${card.englishName})
- 状态：${card.isReversed ? "【逆位】(Reversed)" : "【正位】(Upright)"}
- 对应塔罗：${card.tarotCard.name} (${card.tarotCard.meaning})
- 核心准则：${card.aspects.join(", ")}
- 关键词：${card.isReversed ? card.keywords.reversed.join(", ") : card.keywords.upright.join(", ")}
- 低语：${card.lore}
`).join("\n")}

请根据每张牌所在的【位置】和【正逆位状态】，结合司辰的传说与塔罗的隐喻，为用户解读命运。
对于逆位的牌，请着重解读其“过度”、“不足”、“内化”或“阻滞”的一面。
```

---

## 4. UI/UX 改进

### 4.1 卡牌展示 (`Card.tsx`)

*   **逆位渲染**：如果 `isReversed` 为 true，CSS `transform: rotate(180deg)`。
*   **详情展示**：在卡牌详情视图中，增加一行显示：“对应塔罗：XXX”。

### 4.2 牌阵布局

*   在“漫宿的道路”（三张牌）和“十字路的故事”（五张牌）中，在卡牌下方或上方明确标注位置名称（如“过去”、“现在”），帮助用户理解。

---

## 5. 实施步骤

1.  **数据准备**：编辑 `hours.ts`，补全 40 位司辰的塔罗对应数据。
2.  **类型定义**：更新 `useStore.ts` 和相关组件的类型定义。
3.  **逻辑实现**：
    *   创建 `spreads.ts`。
    *   修改抽牌逻辑，加入正逆位随机和位置分配。
4.  **前端适配**：
    *   修改 `Card` 组件支持逆位显示。
    *   修改 `ReadingPage` 的 Prompt 构建逻辑。
5.  **测试与微调**：测试 LLM 对正逆位和新牌阵定义的理解效果。

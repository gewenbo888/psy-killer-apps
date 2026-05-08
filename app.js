// Psy Protocol Killer Apps Lab · Psy 协议杀手级应用实验室
// Plain JS · template literals throughout for CJK safety

(function () {
  "use strict";

  const root = document.documentElement;
  const LANG_KEY = "pka-lang";
  const THEME_KEY = "pka-theme";

  function applyLang(lang) {
    root.setAttribute("data-lang", lang);
    document.querySelectorAll(".lang-toggle button").forEach(b => {
      b.classList.toggle("active", b.dataset.langSet === lang);
    });
    document.querySelectorAll("[data-en-placeholder]").forEach(el => {
      const v = el.getAttribute(`data-${lang}-placeholder`);
      if (v) el.placeholder = v;
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    document.querySelectorAll(".theme-toggle button").forEach(b => {
      b.classList.toggle("active", b.dataset.themeSet === theme);
    });
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }
  document.querySelectorAll(".lang-toggle button").forEach(b => {
    b.addEventListener("click", () => applyLang(b.dataset.langSet));
  });
  document.querySelectorAll(".theme-toggle button").forEach(b => {
    b.addEventListener("click", () => applyTheme(b.dataset.themeSet));
  });
  try {
    const sl = localStorage.getItem(LANG_KEY); if (sl) applyLang(sl);
    const st = localStorage.getItem(THEME_KEY); if (st) applyTheme(st);
  } catch (_) {}

  // ─── Module 01 · Architecture cards ──────────────────────────────
  const archCards = [
    {
      kicker: ["Realms", "Realms"],
      titleEn: "Partitioned execution domains, not one global VM",
      titleZh: "分区执行域,而非单一全局虚拟机",
      bodyEn: `A realm is a sandboxed state and execution domain identified by a uid. The default is realm 0 (uid=0); applications can occupy higher-uid realms (e.g. uid=524288). Cross-realm interactions are explicit and proof-mediated. The product implication: an application can run as if it had the chain to itself, without paying for everyone else&apos;s congestion.`,
      bodyZh: `realm 是由 uid 标识的状态与执行沙箱。默认值为 realm 0(uid=0);应用可占用更高 uid 的 realm(如 uid=524288)。跨 realm 交互显式存在,经证明中介。产品意涵:应用可如同独占链一般运行,而无需为其他人的拥堵买单。`,
      cls: "primary"
    },
    {
      kicker: ["Coordinator", "协调器"],
      titleEn: "One ordering authority, then prove the rest",
      titleZh: "排序由一个权威完成,其余由证明承担",
      bodyEn: `The coordinator orders transactions, batches them, and feeds them to the prover stack. It is a single point — but a single point that emits cryptographic evidence of every transition. The product implication: latency is bounded by coordinator throughput rather than by global consensus delay, while validity is still verifiable by anyone with the proof.`,
      bodyZh: `协调器排序交易、打包,并将其送入证明栈。它是单点——但是一个对每次状态转移都发出密码学证据的单点。产品意涵:时延受限于协调器吞吐,而非全局共识延迟;有效性仍可由任何持有证明者独立验证。`,
      cls: "coral"
    },
    {
      kicker: ["Recursive ZK", "递归零知识"],
      titleEn: "Plonky2 · Poseidon hash · Goldilocks field",
      titleZh: "Plonky2 · Poseidon 哈希 · Goldilocks 域",
      bodyEn: `Recursive Plonky2 proofs over the Goldilocks field with Poseidon-based hashing let the chain compress arbitrarily many transitions into a single succinct artifact. The point is not the cryptographic alphabet soup — the point is that an application can settle a million-step computation onto L1 by submitting one short proof. Onchain games and AI agents become economically viable at this point.`,
      bodyZh: `Goldilocks 域上、基于 Poseidon 哈希的递归 Plonky2 证明,允许把任意多状态转移压缩为单一简洁证据。关键不在那串密码学字母汤,而在于:应用可通过提交一个短证明,把百万步计算结算至 L1。链上游戏与智能体在此点上才在经济意义上可行。`,
      cls: "gold"
    },
    {
      kicker: ["Persistent identity", "持久身份"],
      titleEn: "psy-wallet as cross-app account, not per-app login",
      titleZh: "psy-wallet 是跨应用账户,而非按应用登录",
      bodyEn: `A psy-wallet account is not bound to a single application. Reputation, balances, and history accumulate at the identity layer; applications query identity rather than re-creating it. The product implication: building a new app on Psy starts from a non-zero installed base of accounts that already have history, not from cold-start.`,
      bodyZh: `psy-wallet 账户不绑定于单一应用。信誉、余额、历史在身份层累积;应用查询身份,而非重新构造。产品意涵:在 Psy 上构建新应用,起点是已有历史的非零账户存量,而非从冷启动开始。`,
      cls: "teal"
    }
  ];
  function renderCards(hostId, items) {
    const host = document.getElementById(hostId);
    if (!host) return;
    host.innerHTML = items.map(c => `
      <div class="card ${c.cls || ""}">
        <div class="kicker"><span lang="en">${c.kicker[0]}</span><span lang="zh">${c.kicker[1]}</span></div>
        <h3><span lang="en">${c.titleEn}</span><span lang="zh">${c.titleZh}</span></h3>
        <p><span lang="en">${c.bodyEn}</span><span lang="zh">${c.bodyZh}</span></p>
      </div>
    `).join("");
  }
  renderCards("archCards", archCards);

  // ─── Module 02 · Killer App generator ────────────────────────────
  const genCategories = {
    social:    { en: "Onchain social", zh: "链上社交" },
    agent:     { en: "AI agent economy", zh: "智能体经济" },
    game:      { en: "Persistent world / game", zh: "持久世界 / 游戏" },
    knowledge: { en: "Knowledge / research", zh: "知识 / 研究" },
    market:    { en: "Prediction / forecasting", zh: "预测 / 预报" },
    coord:     { en: "Coordination / labor", zh: "协调 / 劳动" },
    creator:   { en: "Creator tools", zh: "创作者工具" }
  };
  const genAudiences = {
    devs:      { en: "Developers", zh: "开发者" },
    creators:  { en: "Creators", zh: "创作者" },
    traders:   { en: "Traders / quants", zh: "交易者 / 量化" },
    research:  { en: "Researchers", zh: "研究者" },
    consumer:  { en: "Mainstream consumers", zh: "大众消费者" },
    agents:    { en: "AI agents themselves", zh: "AI 智能体本身" }
  };
  const genPrimitives = {
    realm:     { en: "Realm-isolated state", zh: "Realm 隔离状态" },
    proof:     { en: "Recursive proof of work", zh: "工作量的递归证明" },
    identity:  { en: "Persistent identity + reputation", zh: "持久身份 + 信誉" },
    privacy:   { en: "Selective-disclosure privacy", zh: "选择性披露隐私" },
    coord:     { en: "Coordinator-scheduled batch", zh: "协调器调度批" },
    indexer:   { en: "GraphQL indexer over state", zh: "状态的 GraphQL 索引" }
  };

  // Pre-baked concept seeds keyed by (category, primitive). Audience modulates language.
  const conceptSeeds = {
    "social|identity": {
      nameEn: "Birthright Social",
      nameZh: "原生社交",
      pitchEn: "A Twitter-shaped client where your followers, mute list, and post archive belong to a Psy identity, not the client. Switching clients is one signature; followers come with you. Moderation becomes a market — competing client teams curate differently and compete for users.",
      pitchZh: "形如 Twitter 的客户端,但粉丝、屏蔽名单与帖子档案归属于 Psy 身份而非客户端。切换客户端只需一次签名,粉丝随之迁移。审核成为市场——不同客户端团队以不同策划方式竞争用户。",
      vEn: "follower-portability is innately viral", vZh: "粉丝可携带,天然病毒",
      fEn: "identity layer is the protocol", fZh: "身份层即协议",
      sEn: "client-side, scales horizontally", sZh: "客户端侧,水平扩展",
      mEn: "client subscription + creator tips", mZh: "客户端订阅 + 创作者打赏",
      nEn: "graph N²; first 100k users decide", nZh: "图谱 N²;前十万用户决定胜负"
    },
    "agent|identity": {
      nameEn: "Agentic Reputation",
      nameZh: "智能体信誉",
      pitchEn: "An open registry where AI agents earn cryptographically verifiable reputation by completing paid tasks. An agent that wrote 10,000 successful pull requests is a different economic entity than one that has done none — and the difference is on-chain queryable, portable across employers.",
      pitchZh: "一个开放注册表:AI 智能体通过完成有偿任务积累可密码学验证的信誉。完成过一万个成功 PR 的智能体,是与零经验智能体不同的经济实体——区别在链上可查、跨雇主可携带。",
      vEn: "agents themselves become brands", vZh: "智能体自身成为品牌",
      fEn: "persistent identity is the load-bearing primitive", fZh: "持久身份为承重基元",
      sEn: "scales with agent population, not human", sZh: "随智能体而非人类规模扩展",
      mEn: "fees on task settlement", mZh: "任务结算手续费",
      nEn: "double-sided: agents + employers", nZh: "双边:智能体 + 雇主"
    },
    "agent|coord": {
      nameEn: "Agent Workpool",
      nameZh: "智能体工作池",
      pitchEn: "A protocol where humans post computational tasks (search, summarization, code review, image-gen) and a market of agents bid to execute them. The coordinator orders bids, recursive proofs verify completion criteria where possible, identity tracks reputation. Open Mechanical Turk for AI agents, with built-in escrow.",
      pitchZh: "一个协议:人类发布计算任务(搜索、摘要、代码评审、图像生成),智能体市场对其竞标执行。协调器排序竞标,递归证明在可能处验证完成标准,身份层追踪信誉。面向 AI 智能体的开放 Mechanical Turk,内嵌托管。",
      vEn: "developer-facing only; medium viral", vZh: "面向开发者,病毒度中等",
      fEn: "needs coordinator + identity + proofs", fZh: "需协调器 + 身份 + 证明",
      sEn: "linear in tasks, mostly compute-bound", sZh: "随任务线性,主要受算力约束",
      mEn: "% on each task settled", mZh: "每项任务结算费率",
      nEn: "two-sided market, sticky reputation", nZh: "双边市场,信誉黏性"
    },
    "game|realm": {
      nameEn: "Realm-Native MMO",
      nameZh: "Realm 原生 MMO",
      pitchEn: "An MMO where each major region of the world is a separate realm. Player inventories live in identity; combat and economy in realm contracts. Cross-realm trade is proof-mediated. The studio can shut down its client; the world keeps running until someone forks a new client. Mods become first-class citizens.",
      pitchZh: "一款 MMO:世界的每个主要区域为一个独立 realm。玩家背包归属于身份层;战斗与经济归属于 realm 合约。跨 realm 贸易经证明中介。工作室可以关闭客户端,世界继续运行,直到有人分叉新客户端。模组成为一等公民。",
      vEn: "viral inside gaming culture", vZh: "在游戏文化内具病毒度",
      fEn: "every Psy primitive is used", fZh: "用尽 Psy 各项基元",
      sEn: "scales by sharding regions into realms", sZh: "通过将区域分片为 realm 扩展",
      mEn: "cosmetic + land + match-fee", mZh: "皮肤 + 土地 + 对战费",
      nEn: "world-state network effect, hard to copy", nZh: "世界状态网络效应,难以复制"
    },
    "knowledge|proof": {
      nameEn: "Citation-Bonded Research",
      nameZh: "以引用为押金的研究",
      pitchEn: "A research-DAO where claims are posted with cryptographic citation receipts. Reviewers stake on claim validity; if a claim is later refuted, stake is slashed and a portion compensates the refuter. Replaces journal prestige with on-chain skin-in-the-game for both authors and reviewers.",
      pitchZh: `一个研究 DAO:论断与密码学的引用收据一同发布。评审者对论断有效性下注;若论断后被推翻,押金被罚没,部分用以补偿驳斥者。以"作者与评审皆下注"取代期刊威望。`,
      vEn: "intra-academic; slow viral", vZh: "学术圈内传播,病毒慢",
      fEn: "proofs-of-citation are protocol-fitting", fZh: "引用证明高度契合协议",
      sEn: "scales with research output, slow", sZh: "随研究产出扩展,缓慢",
      mEn: "stake fees + premium queries", mZh: "押金费 + 付费查询",
      nEn: "dense citation graph, sticky lock-in", nZh: "密集引用图,锁定性强"
    },
    "market|proof": {
      nameEn: "Recursive Forecast Market",
      nameZh: "递归预测市场",
      pitchEn: "A prediction market where each forecast can be a function of other forecasts, composable into complex contingent claims (&quot;P(US recession in 2027 | Fed cut by July&quot;). Recursive proofs let market state remain succinct even at thousands of nested questions. Resolution oracles are themselves staked; bad oracles are slashed.",
      pitchZh: `一个预测市场:每个预测可以是其他预测的函数,可组合为复杂条件请求(如"七月前美联储降息条件下 2027 年美国经济衰退概率")。递归证明让市场状态在数千个嵌套问题下仍保持简洁。解析预言机自身需押金,失误则罚没。`,
      vEn: "viral within finance/policy circles", vZh: "在金融/政策圈病毒",
      fEn: "uses recursive proofs natively", fZh: "原生使用递归证明",
      sEn: "succinct state by design", sZh: "状态简洁,设计使然",
      mEn: "trading fees + oracle stakes", mZh: "交易费 + 预言机押金",
      nEn: "liquidity is the moat", nZh: "流动性即护城河"
    },
    "coord|coord": {
      nameEn: "Open-Source Bounty Engine",
      nameZh: "开源赏金引擎",
      pitchEn: "A bounty system where issues from any open-source project can be funded with Psy-native escrow, claimed by developers, reviewed by maintainers, and settled with proofs of merge. Reputation accrues to identities, not to platforms. Replaces a fragmented ecosystem of bounty platforms with one composable layer.",
      pitchZh: "一个赏金系统:任何开源项目的 issue 可由 Psy 原生托管资助,开发者认领,维护者评审,以合并证明结算。信誉归属于身份,而非平台。以一个可组合层取代当前碎片化的赏金平台生态。",
      vEn: "popular within OSS communities", vZh: "在开源社区内传播",
      fEn: "coordinator + identity layer", fZh: "协调器 + 身份层",
      sEn: "linear in active repos", sZh: "随活跃仓库线性",
      mEn: "small fee on settled bounties", mZh: "已结赏金的小额手续费",
      nEn: "moderate; OSS communities are sticky", nZh: "中等;开源社区有黏性"
    },
    "creator|privacy": {
      nameEn: "Sealed-Patron Creator OS",
      nameZh: "密封赞助创作者 OS",
      pitchEn: "A creator-monetization system where supporters can pay a creator without revealing their identity to the platform — only to the creator if and when the creator chooses to acknowledge. Selective disclosure inverts today&apos;s default: privacy on by default, transparency by act of authorship.",
      pitchZh: "一个创作者变现系统:支持者可向创作者付费而无须向平台披露身份——仅在创作者选择致谢时披露。选择性披露颠倒了今日默认:隐私默认开启,透明由作者主动行为产生。",
      vEn: "viral with fan/patreon culture", vZh: "在粉丝/赞助文化中病毒",
      fEn: "selective disclosure is the primitive", fZh: "选择性披露即基元",
      sEn: "linear in patrons", sZh: "随赞助者线性",
      mEn: "small fee on tips, optional subs", mZh: "打赏小额手续费,可选订阅",
      nEn: "creator-brand network effect", nZh: "创作者品牌网络效应"
    }
  };

  // Default seed for unmatched combos
  function defaultSeed(catKey, audKey, primKey) {
    const cat = genCategories[catKey];
    const aud = genAudiences[audKey];
    const prim = genPrimitives[primKey];
    return {
      nameEn: `${cat.en} × ${prim.en}`,
      nameZh: `${cat.zh} × ${prim.zh}`,
      pitchEn: `A ${cat.en.toLowerCase()} application targeted at ${aud.en.toLowerCase()}, built around ${prim.en.toLowerCase()} as the load-bearing primitive. The product opportunity is real but the design is non-trivial; treat this as a starting prompt rather than a finished concept and iterate against the architecture diagram in Module 1.`,
      pitchZh: `一个面向 ${aud.zh} 的 ${cat.zh}应用,以 ${prim.zh} 为承重基元。产品机会真实存在,但设计并非简单;将其视为出发提示而非完成形态,并对照模块 1 的架构图进行迭代。`,
      vEn: "depends on execution",  vZh: "取决于执行",
      fEn: `${prim.en} is structurally suited`, fZh: `${prim.zh} 结构适配`,
      sEn: "scales with audience size", sZh: "随受众规模扩展",
      mEn: "to be designed",  mZh: "待设计",
      nEn: "protocol-typical", nZh: "协议典型"
    };
  }

  function fillGenSelects() {
    const c = document.getElementById("genCategory");
    const a = document.getElementById("genAudience");
    const p = document.getElementById("genPrimitive");
    c.innerHTML = Object.keys(genCategories).map(k => `<option value="${k}">${genCategories[k].en} · ${genCategories[k].zh}</option>`).join("");
    a.innerHTML = Object.keys(genAudiences).map(k => `<option value="${k}">${genAudiences[k].en} · ${genAudiences[k].zh}</option>`).join("");
    p.innerHTML = Object.keys(genPrimitives).map(k => `<option value="${k}">${genPrimitives[k].en} · ${genPrimitives[k].zh}</option>`).join("");
  }
  fillGenSelects();

  function generateConcept() {
    const c = document.getElementById("genCategory").value;
    const a = document.getElementById("genAudience").value;
    const p = document.getElementById("genPrimitive").value;
    const key = `${c}|${p}`;
    const seed = conceptSeeds[key] || defaultSeed(c, a, p);

    const cat = genCategories[c];
    const aud = genAudiences[a];
    const prim = genPrimitives[p];

    document.getElementById("genOutput").innerHTML = `
      <div class="gen-card">
        <span class="ribbon">${cat.en} → ${aud.en} · ${cat.zh} → ${aud.zh} · ${prim.en} / ${prim.zh}</span>
        <h4><span lang="en">${seed.nameEn}</span><span lang="zh">${seed.nameZh}</span></h4>
        <div class="tag-row">
          <span class="tag viral">VIRAL · <span lang="en">${seed.vEn}</span><span lang="zh">${seed.vZh}</span></span>
          <span class="tag fit">FIT · <span lang="en">${seed.fEn}</span><span lang="zh">${seed.fZh}</span></span>
          <span class="tag scale">SCALE · <span lang="en">${seed.sEn}</span><span lang="zh">${seed.sZh}</span></span>
          <span class="tag money">MONEY · <span lang="en">${seed.mEn}</span><span lang="zh">${seed.mZh}</span></span>
          <span class="tag network">NETWORK · <span lang="en">${seed.nEn}</span><span lang="zh">${seed.nZh}</span></span>
        </div>
        <p><span lang="en">${seed.pitchEn}</span><span lang="zh">${seed.pitchZh}</span></p>
      </div>
    `;
  }
  document.getElementById("genBtn").addEventListener("click", generateConcept);
  generateConcept();

  // ─── Module 03 · AI × Psy cards ──────────────────────────────────
  const aiCards = [
    {
      kicker: ["Wallets, not API keys", "钱包,而非 API key"],
      titleEn: "An agent that pays for its own compute",
      titleZh: "为自己算力付费的智能体",
      bodyEn: `Today, an agent calls a paid API and the bill goes to the human owner&apos;s credit card. The credit card has identity, the agent does not. With a Psy-native account, the agent itself holds funds, signs payments, and accumulates a balance from work it has performed. The economic boundary moves from the human to the agent. This is small in description and enormous in product space.`,
      bodyZh: `如今,智能体调用付费 API 时,账单走向其人类所有者的信用卡——信用卡有身份,智能体没有。在 Psy 原生账户中,智能体自身持币、签名付款、并由其完成的工作积累余额。经济边界从人类移至智能体。描述上微小,产品空间上巨大。`,
      cls: "primary"
    },
    {
      kicker: ["Cross-app reputation", "跨应用信誉"],
      titleEn: "Receipts for work, portable across employers",
      titleZh: "工作收据,可跨雇主携带",
      bodyEn: `An agent that has completed 10,000 tasks under one platform should not have to start over when moving to another. A protocol-native reputation primitive makes the receipt of work portable, while still letting platforms run their own evaluation criteria on top of the same data. The platform competes on judgment, not on owning the data.`,
      bodyZh: `在某一平台已完成一万项任务的智能体,不应在迁至另一平台时归零。协议原生的信誉基元让"工作的收据"可携带,同时仍允许平台在同一数据之上施加各自的评价标准。平台以判断力而非数据所有权竞争。`,
      cls: "coral"
    },
    {
      kicker: ["Decentralized memory", "去中心化记忆"],
      titleEn: "Long-term agent memory that does not depend on one company",
      titleZh: "不依赖某一家公司的长期智能体记忆",
      bodyEn: `Agents today forget when their hosting provider changes. Agent memory anchored to a Psy realm survives provider migration, can be partially exported, audited, or archived without giving up the agent&apos;s ongoing operation. A research agent that has read your entire library does not have to re-read it when you change cloud vendors.`,
      bodyZh: `今天的智能体在更换托管商时即遗忘。锚定于 Psy realm 的智能体记忆,跨提供商迁移仍存活,可部分导出、审计或归档,而不中断智能体本身的持续运行。已读完你全部资料库的研究智能体,在你更换云厂商时不必重读。`,
      cls: "teal"
    },
    {
      kicker: ["Agent-native DAOs", "智能体原生 DAO"],
      titleEn: "Organizations whose members include AI agents",
      titleZh: "成员包含 AI 智能体的组织",
      bodyEn: `Mixing humans and agents in one organizational legal-and-economic structure is structurally awkward in today&apos;s corporate forms. A protocol-native organization with weighted voting, transparent treasury, and per-member reputation does not care if the member is human or agent — it just verifies the signature. New kinds of work get organized this way before they get incorporated.`,
      bodyZh: `在当今公司形式中,把人与智能体混编入同一法律—经济组织在结构上很别扭。一个协议原生的组织,以加权投票、透明国库与按成员信誉运作,并不在乎成员是人还是智能体——只验证签名。新型工作往往在被法人化之前,先以这种方式组织起来。`,
      cls: "magenta"
    }
  ];
  renderCards("aiCards", aiCards);

  // ─── Module 04 · Onchain Social cards ────────────────────────────
  const socialCards = [
    {
      kicker: ["Portable graph", "可携带图谱"],
      titleEn: "Why Twitter cannot do this",
      titleZh: "为何 Twitter 做不到",
      bodyEn: `Twitter cannot let you take your followers because that exit option destroys its monopoly rent. A protocol whose monetization is at the application layer (not the graph layer) has no such conflict — clients compete to serve the same persistent graph and the user picks the best client. The graph is a public good that the protocol coordinates; the apps are the businesses.`,
      bodyZh: `Twitter 不让你带走粉丝,是因为这一退出权毁了它的垄断租金。变现位于应用层(而非图谱层)的协议无此冲突——客户端为同一持久图谱争相服务,用户选最佳客户端。图谱是协议协调的公共物品,应用才是生意。`,
      cls: "primary"
    },
    {
      kicker: ["Moderation as market", "审核即市场"],
      titleEn: "Replace one moderation policy with N",
      titleZh: "以 N 种审核政策取代单一政策"
,
      bodyEn: `Today, every social platform has one moderation policy that everyone has to live with. A protocol-native graph lets users subscribe to moderation feeds the way they subscribe to client feeds. Some users will choose strict; some loose; some specific to a region or language. The protocol does not pick winners; it makes the choice legible and switchable.`,
      bodyZh: `今日每个社交平台只有一套全员适用的审核政策。协议原生图谱让用户像订阅客户端一样订阅审核源:严苛、宽松、按地域或语言定制——协议不挑胜负,只让选择可视、可切换。`,
      cls: "coral"
    },
    {
      kicker: ["Creator monetization", "创作者变现"],
      titleEn: "Creator economy without lock-in",
      titleZh: "不被锁死的创作者经济"
,
      bodyEn: `A creator on a closed platform spends years building an audience that the platform owns. On a protocol-native graph the audience belongs to the creator&apos;s identity, payments are direct, and the platform&apos;s value is in distribution and discovery, not in custody. Most attempts at this have stumbled on UX, not on architecture; better wallets close the gap.`,
      bodyZh: `在封闭平台上,创作者花数年累积起一群被平台拥有的受众。在协议原生图谱中,受众归属于创作者身份,支付直接,平台价值在于分发与发现,而非托管。多数此类尝试栽在 UX 而非架构上;更好的钱包能弥合差距。`,
      cls: "teal"
    },
    {
      kicker: ["Sovereign communities", "自治社区"],
      titleEn: "Subreddits that cannot be deleted",
      titleZh: "不可被删除的子社区",
      bodyEn: `Reddit can delete a subreddit. Discord can delete a server. A protocol-native community sits in a realm and is removed only by its own governance. This is not always desirable — bad actors persist longer. The right design is graduated: easy to leave a community, hard to delete one out from under its members. Tradeoff, not principle.`,
      bodyZh: `Reddit 可删除子版,Discord 可删除服务器。协议原生社区位于一个 realm,仅由其自身治理删除。这并不总是好事——恶意行为者也会更难被清除。正确设计是分级:易于离开社区,难以从成员脚下抽走社区。这是权衡,而非原则。`,
      cls: "gold"
    }
  ];
  renderCards("socialCards", socialCards);

  // ─── Module 05 · Game cards ──────────────────────────────────────
  const gameCards = [
    {
      kicker: ["Persistence", "持久性"],
      titleEn: "Worlds the studio cannot turn off",
      titleZh: "工作室无法关闭的世界",
      bodyEn: `When a major MMO closes its servers, billions of player-hours of state simply vanish. A world whose canonical state lives in a realm survives client failure. Communities can fork the client, host their own indexers, and continue. The game becomes a public artifact, not a service rental.`,
      bodyZh: `当某主流 MMO 关闭服务器时,数十亿小时的玩家状态消失无形。其规范状态存于 realm 的世界,能在客户端失效后继续存在。社区可分叉客户端、自建索引器、继续进行。游戏成为公共构件,而非服务租赁。`,
      cls: "primary"
    },
    {
      kicker: ["Mod-owned worlds", "模组拥有的世界"],
      titleEn: "Why mods become first-class",
      titleZh: "为何模组成为一等公民",
      bodyEn: `Today, mods exist by sufferance — the studio can break them with the next patch. A game with on-chain rules that mods extend cryptographically (rather than monkey-patch) gives modders a real economic position. The studio still ships the canonical client, but it cannot unilaterally invalidate a popular mod overnight.`,
      bodyZh: `今日的模组靠工作室容忍存在——下一版补丁即可使之失效。其规则在链上、模组以密码学方式扩展(而非猴子补丁)的游戏,赋予模组作者真实的经济地位。工作室仍发行规范客户端,但无法在一夜之间单方面使流行模组失效。`,
      cls: "coral"
    },
    {
      kicker: ["NPC societies", "NPC 社会"],
      titleEn: "Autonomous economies of agent-NPCs",
      titleZh: "智能体 NPC 的自主经济"
,
      bodyEn: `An NPC running on an off-chain script is a stage prop. An agent-NPC with its own wallet, its own reputation, its own cross-realm trade history is an actor in the game economy. The most interesting onchain games will not be human-vs-human or human-vs-content; they will be ecologies where humans and agents both participate as economic equals.`,
      bodyZh: `运行于链下脚本的 NPC 不过是道具。拥有自己钱包、自己信誉、自己跨 realm 交易历史的智能体 NPC,则是游戏经济中的演员。最有意思的链上游戏将既非"人对人"亦非"人对内容",而是人与智能体作为经济平等者共同参与的生态。`,
      cls: "teal"
    },
    {
      kicker: ["Player governance", "玩家治理"],
      titleEn: "Hard rules on the chain, soft rules in the community",
      titleZh: "硬规则在链上,软规则在社区",
      bodyEn: `Not every rule belongs on-chain. Combat physics, item rarity, world coordinates — yes. Etiquette, group culture, lore decisions — usually no. Good design separates the two and lets players govern the soft layer through whatever forum they prefer, without chain-bloat or governance fatigue.`,
      bodyZh: `并非所有规则都该上链。战斗物理、物品稀有度、世界坐标——是;礼仪、团队文化、设定决策——通常否。好设计将两者分离,让玩家在偏好的论坛中治理软层,而不需要链膨胀或治理疲劳。`,
      cls: "gold"
    }
  ];
  renderCards("gameCards", gameCards);

  // ─── Module 06 · Knowledge cards ─────────────────────────────────
  const knowledgeCards = [
    {
      kicker: ["Curation markets", "策展市场"],
      titleEn: "Pay people to remember accurately",
      titleZh: "为准确记忆付费",
      bodyEn: `Wikipedia&apos;s editor pool is mostly volunteer. That works for breadth and fails for depth in domains that require continuous expert attention. A curation-market layer over a knowledge graph lets specialized communities pay specialists to maintain a specific subgraph — without forcing the underlying data into a single namespace or a single license.`,
      bodyZh: `维基百科的编辑队伍以志愿者为主——这对广度有效,在需要持续专家关注的领域则深度不足。在知识图谱之上加设策展市场层,让专门社区为专家维护特定子图付费,而不强迫底层数据进入单一命名空间或单一许可证。`,
      cls: "primary"
    },
    {
      kicker: ["Citation receipts", "引用收据"],
      titleEn: "Make the citation graph load-bearing",
      titleZh: "让引用图谱承重",
      bodyEn: `Academic citations are already a graph; they are just under-used as economic infrastructure. Cryptographic citation receipts let downstream uses of a research artifact compensate the original authors automatically — a kind of slow royalty for foundational work. The infrastructure exists; the social agreement to use it is the hard part.`,
      bodyZh: `学术引用本身就是一张图,只是其经济基础设施作用被低估了。密码学引用收据让对一项研究构件的下游使用,自动补偿原作者——为基础性工作建立一种缓慢的版税机制。基础设施已存在;社会层面同意使用它,才是难处。`,
      cls: "teal"
    },
    {
      kicker: ["Civilization memory", "文明记忆"],
      titleEn: "Things that survive for centuries",
      titleZh: "能存续数百年之物"
,
      bodyEn: `A protocol whose state can be reconstructed from a recursive proof and an L1 transcript is, in theory, recoverable as long as L1 itself remains. That is a longer time horizon than any company. Civilization-scale memory primitives — long-form archives, dictionary projects, multilingual encyclopedias — start to make sense at this time horizon.`,
      bodyZh: `一种可由递归证明与 L1 交易记录重建状态的协议,理论上只要 L1 仍在,就可恢复。这是比任何公司都更长的时间跨度。在此时间尺度下,文明规模的记忆基元——长文档案、辞典工程、多语百科——开始变得合理。`,
      cls: "gold"
    },
    {
      kicker: ["Honest limit", "诚实的限制"],
      titleEn: "What chain-knowledge cannot do",
      titleZh: "链上知识做不到的事",
      bodyEn: `Chain-anchored knowledge does not solve the hardest knowledge problems: which sources to trust, which interpretations to weight, which voices to amplify. Those are editorial questions, not infrastructure questions. Protocol-native knowledge networks make some things cheaper and harder to censor. They do not make the world easier to interpret.`,
      bodyZh: `链上锚定的知识并不解决最难的知识问题:信任哪些来源、给哪些解读以权重、放大哪些声音。这些是编辑问题,而非基础设施问题。协议原生的知识网络使部分工作更便宜、更难审查;但并不让世界更易解读。`,
      cls: "coral"
    }
  ];
  renderCards("knowledgeCards", knowledgeCards);

  // ─── Module 07 · Markets cards ───────────────────────────────────
  const marketCards = [
    {
      kicker: ["Geopolitical", "地缘政治"],
      titleEn: "Forecasting the world, with skin in the game",
      titleZh: "对世界下注的预测",
      bodyEn: `Traditional pollsters and pundits face no consequence for being wrong. A market participant who is wrong loses money. The mechanism design problem is keeping the markets liquid enough that prices reflect information and not just noise. Recursive proofs help by making nested contingent claims (&quot;election outcome | poll movement&quot;) cheap.`,
      bodyZh: `传统民调与评论员预测错了无后果,市场参与者错了则亏钱。机制设计问题是保持市场流动性足够,使价格反映信息而非噪声。递归证明通过使嵌套条件请求(如"投票结果|民调走势")变得廉价而提供帮助。`,
      cls: "primary"
    },
    {
      kicker: ["Scientific", "科学"],
      titleEn: "Replication markets",
      titleZh: "复现市场",
      bodyEn: `A startup-cost-of-replication problem makes most published findings under-replicated. A market on &quot;will study X replicate?&quot; gives a directly tradable signal — which itself becomes an input to research-funding decisions. The infrastructure cost has to fall below research-budget noise; protocol-native markets help.`,
      bodyZh: `复现成本壁垒使绝大多数已发表结论未被复现。一个关于"研究 X 是否能复现?"的市场,直接给出可交易信号——并成为科研经费决策的输入。基础设施成本需低于科研预算噪声;协议原生市场有所助益。`,
      cls: "teal"
    },
    {
      kicker: ["AI capabilities", "AI 能力"],
      titleEn: "Markets on what models can and cannot do",
      titleZh: "对模型能与不能的市场",
      bodyEn: `&quot;Will model X exceed benchmark Y by date Z?&quot; is a tractable forecasting question with real economic value to both labs and users. A market layer makes the forecast visible and tradable. Bad benchmarks are still bad — markets cannot fix evaluation, only price it.`,
      bodyZh: `"模型 X 是否在日期 Z 前超越基准 Y?"是一个可处理且对实验室与用户都具经济价值的预测问题。市场层使预测可见、可交易。糟糕的基准仍然糟糕——市场无法修复评测本身,只能为它定价。`,
      cls: "magenta"
    },
    {
      kicker: ["Honest limit", "诚实的限制"],
      titleEn: "Regulatory reality",
      titleZh: "监管现实",
      bodyEn: `Many jurisdictions classify prediction markets as gambling and constrain them sharply. Protocol-native architecture does not change this — it only changes the operational surface. Designs that ignore the regulatory dimension end up either operating in the legal gray (high reputation cost) or being forced offshore (high access cost). Honest design accepts this constraint.`,
      bodyZh: `许多司法管辖区将预测市场归为博彩并施加严苛限制。协议原生架构并不改变这一点,它只改变操作界面。忽视监管维度的设计,要么在法律灰色区运行(高声誉成本),要么被迫出海(高获取成本)。诚实的设计接受这一约束。`,
      cls: "coral"
    }
  ];
  renderCards("marketCards", marketCards);

  // ─── Module 08 · Coordination cards ──────────────────────────────
  const coordCards = [
    {
      kicker: ["Yes, protocols can", "是,协议可以"],
      titleEn: "Tasks well-suited for protocol replacement",
      titleZh: "适合由协议替代的任务",
      bodyEn: `Escrow, payment, dispute logging, reputation tracking, public registries, scheduling rights to scarce resources, settling exchange of fungible items. Whenever the function is essentially &quot;keep an honest ledger of who agreed to what,&quot; protocols beat firms on cost.`,
      bodyZh: `托管、支付、争议记录、信誉追踪、公开注册、稀缺资源使用权调度、可替代物品交换结算。每当某职能本质上是"保持一份诚实的账簿,记录谁与谁达成何事",协议在成本上胜过公司。`,
      cls: "primary"
    },
    {
      kicker: ["Maybe", "或许"],
      titleEn: "Tasks where protocols help but do not replace firms",
      titleZh: "协议有助但不替代公司的任务",
      bodyEn: `Software development, design, complex creative work, quality control. The coordination component can move to a protocol; the judgment component cannot. The result is firms with smaller fixed surface — fewer employees, more contracts — not the disappearance of firms entirely.`,
      bodyZh: `软件开发、设计、复杂创意、质量控制。其中的协调成分可移至协议,判断成分则不能。结果是固定表面更小的公司——更少员工、更多合约——而非公司彻底消失。`,
      cls: "teal"
    },
    {
      kicker: ["No", "否"],
      titleEn: "Tasks protocols cannot replace",
      titleZh: "协议不能替代的任务",
      bodyEn: `Internal culture-setting, long-term hiring judgment, reputational risk-bearing, regulated relationships with end users (banking, healthcare), and most R&D requiring continuous unspoken context. The boundary of the firm exists for reasons; some reasons survive the protocol layer.`,
      bodyZh: `内部文化养成、长期招聘判断、声誉风险承担、与终端用户的受监管关系(银行、医疗),以及大多数需要持续未言明语境的研发。公司的边界因故存在;部分理由可越过协议层而存活。`,
      cls: "coral"
    },
    {
      kicker: ["Hybrid", "混合"],
      titleEn: "The likely steady state",
      titleZh: "可能的稳态",
      bodyEn: `Most firms ten years from now will keep their judgment-heavy core and outsource their coordination-heavy edges to protocols. The biggest mistake in 2026 thinking is to treat this as binary: protocols replace firms <em>or</em> they don&apos;t. They will replace some functions, complement others, and leave a third set untouched.`,
      bodyZh: `十年后,大多数公司仍保留其判断密集的核心,而把协调密集的边缘外包至协议。2026 年思考最大的错误是把它当二元命题:协议替代公司<em>或</em>不替代。它会替代部分职能、补充另一部分、并保留第三部分不变。`,
      cls: "gold"
    }
  ];
  renderCards("coordCards", coordCards);

  // ─── Module 09 · Meme / narrative cards ──────────────────────────
  const memeCards = [
    {
      kicker: ["Compression", "压缩"],
      titleEn: "What a memorable pitch is, structurally",
      titleZh: "一个可被记住的提案,从结构上看是什么"
,
      bodyEn: `A good protocol meme is not the catchiest line; it is the line whose meaning survives a 50% loss in transmission. &quot;You don&apos;t own your tweets&quot; survives compression and decompression because the next sentence reconstructs itself in the listener&apos;s mind. Engineering memes is engineering for that property.`,
      bodyZh: `好的协议模因不是最朗朗上口的那句,而是其意义在传输中损失 50% 后仍能存活的那句。"你的推文不归你所有"经得起压缩与解压,因为下一句话会在听者心中自我重构。设计模因即设计这一属性。`,
      cls: "primary"
    },
    {
      kicker: ["Mythology", "神话"],
      titleEn: "Protocols need an origin story",
      titleZh: "协议需要起源故事",
      bodyEn: `Every durable protocol has a creation narrative — Bitcoin&apos;s 2008 paper, Ethereum&apos;s ICO history, Linux&apos;s student project. The narrative is not marketing; it is the cognitive scaffold users build their loyalty on. Psy&apos;s narrative is being written now, by what gets built and shipped, not by what gets posted.`,
      bodyZh: `每一个持久存在的协议,都有一段创世叙事——比特币 2008 年的论文、以太坊的 ICO 史、Linux 的学生项目。叙事并非营销,而是用户用以构建忠诚的认知骨架。Psy 的叙事正在被写——由真正被构建并上线的事物,而非被发帖的内容。`,
      cls: "magenta"
    },
    {
      kicker: ["Identity formation", "身份形成"],
      titleEn: "Communities form around shared in-jokes",
      titleZh: "社区围绕共同私话语形成"
,
      bodyEn: `Every meaningful technical community has its own dialect — keywords, references, internal jokes that only members get. This is not gatekeeping; it is the natural compression that group identity always produces. The trick is keeping the dialect porous: legible to outsiders within five minutes of attention, deeper for those who stay longer.`,
      bodyZh: `每一个有意义的技术社区都有自己的方言——关键词、典故、只有成员能懂的笑话。这并非把门,而是群体身份必然产生的自然压缩。技巧在于保持方言的渗透性:外人花五分钟即可读懂,留得久者能读出更深。`,
      cls: "teal"
    },
    {
      kicker: ["Hostile reading", "对敌阅读"],
      titleEn: "What survives a skeptical journalist",
      titleZh: "经得起怀疑记者的检验"
,
      bodyEn: `A good protocol narrative survives a skeptical journalist&apos;s 1,000-word article. The hype-driven version does not — the journalist simply reproduces the architecture and ignores the marketing layer. Build the narrative such that the architecture itself is the most interesting story; everything else is decoration.`,
      bodyZh: `好的协议叙事经得起怀疑记者一千字文章的检验;炒作驱动的版本则不行——记者直接复述架构,忽略营销层。构建叙事时让架构本身成为最有意思的故事,其他皆为装饰。`,
      cls: "coral"
    }
  ];
  renderCards("memeCards", memeCards);

  // ─── Module 10 · Future internet simulator ───────────────────────
  const archetypes = {
    social:    { en: "Onchain social network", zh: "链上社交网络",  base: { adoption: 60, trust: 70, scale: 65, sustain: 60, surplus: 55, sovereignty: 80 } },
    agent:     { en: "Agent labor market", zh: "智能体劳动力市场",  base: { adoption: 40, trust: 60, scale: 80, sustain: 65, surplus: 70, sovereignty: 65 } },
    game:      { en: "Persistent-world game", zh: "持久世界游戏",   base: { adoption: 55, trust: 65, scale: 75, sustain: 75, surplus: 50, sovereignty: 70 } },
    knowledge: { en: "Knowledge / research DAO", zh: "知识 / 研究 DAO", base: { adoption: 30, trust: 80, scale: 50, sustain: 80, surplus: 40, sovereignty: 75 } },
    market:    { en: "Prediction market", zh: "预测市场",          base: { adoption: 45, trust: 55, scale: 70, sustain: 60, surplus: 60, sovereignty: 65 } }
  };
  const simDims = [
    ["adoption",    "Adoption velocity",   "采纳速度"],
    ["trust",       "Trust resilience",    "信任韧性"],
    ["scale",       "Scaling headroom",    "扩展空间"],
    ["sustain",     "Sustainability",      "可持续性"],
    ["surplus",     "Producer surplus",    "生产者剩余"],
    ["sovereignty", "User sovereignty",    "用户主权"]
  ];
  function fillSim() {
    const sel = document.getElementById("simArche");
    sel.innerHTML = Object.keys(archetypes).map(k => `<option value="${k}">${archetypes[k].en} · ${archetypes[k].zh}</option>`).join("");
  }
  fillSim();
  function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }
  function runSim() {
    const a = archetypes[document.getElementById("simArche").value];
    const scale = +document.getElementById("simScale").value;
    const agents = +document.getElementById("simAgents").value;
    const open = +document.getElementById("simOpen").value;
    const decent = +document.getElementById("simDecent").value;

    const adoption = clamp(a.base.adoption + (open - 50) * 0.25 + (50 - decent) * 0.10 + (scale - 50) * 0.10);
    const trust    = clamp(a.base.trust + (decent - 50) * 0.25 + (50 - agents) * 0.10);
    const scl      = clamp(a.base.scale + (scale - 50) * 0.30 + (agents - 50) * 0.15);
    const sustain  = clamp(a.base.sustain + (decent - 50) * 0.20 + (open - 50) * 0.10);
    const surplus  = clamp(a.base.surplus + (decent - 50) * 0.25 + (agents - 50) * 0.10);
    const sov      = clamp(a.base.sovereignty + (decent - 50) * 0.30 + (open - 50) * 0.10);

    const scores = { adoption, trust, scale: scl, sustain, surplus, sovereignty: sov };
    document.getElementById("simBars").innerHTML = simDims.map(d => `
      <div class="sbar">
        <span><span lang="en">${d[1]}</span><span lang="zh">${d[2]}</span></span>
        <span class="meter"><i style="width:${scores[d[0]]}%"></i></span>
        <span class="v">${scores[d[0]]}</span>
      </div>
    `).join("");

    const en = `Archetype <strong>${a.en}</strong>. Scale ${scale}, agent ratio ${agents}, openness ${open}, decentralization ${decent}. Adoption ${adoption}, trust ${trust}, scale ${scl}, sustainability ${sustain}, surplus ${surplus}, sovereignty ${sov}. Notice: high decentralization correlates with sovereignty and surplus, but pulls down adoption velocity slightly. The product question is which trade-offs you accept early and which you defer.`;
    const zh = `原型 <strong>${a.zh}</strong>。规模 ${scale},智能体比例 ${agents},开放度 ${open},去中心化 ${decent}。采纳 ${adoption},信任 ${trust},扩展 ${scl},可持续 ${sustain},剩余 ${surplus},主权 ${sov}。注意:高去中心化与主权、剩余正相关,但稍微拉低采纳速度。产品问题在于,哪些权衡早做,哪些延后。`;
    document.getElementById("simReadout").innerHTML = `<span lang="en">${en}</span><span lang="zh">${zh}</span>`;
  }
  ["simArche", "simScale", "simAgents", "simOpen", "simDecent"].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("input", runSim);
    el.addEventListener("change", runSim);
  });
  runSim();

  // ─── AI Strategist ───────────────────────────────────────────────
  const aiCanned = [
    {
      qEn: "What does Psy enable structurally that EVM chains struggle with?",
      qZh: "Psy 在结构上能做、EVM 链难做的事是什么?",
      aEn: `<p><em>Strategist · structural answer</em></p>
        <p>Three load-bearing differences.</p>
        <p><strong>Realms.</strong> An EVM chain is a single global state machine; congestion in one app raises gas for every other app. Realms partition execution so that an application&apos;s throughput depends on its own demand, not on the noisiest neighbor.</p>
        <p><strong>Recursive proofs.</strong> Plonky2 proofs over Goldilocks compress arbitrarily many transitions into a constant-size verifier cost. Onchain games and agent economies that need millions of state updates per day become economically tractable.</p>
        <p><strong>Identity is first-class.</strong> psy-wallet accounts persist across applications. Reputation, history, and balances are at the protocol layer, not duplicated across every app. New apps inherit a non-zero installed base.</p>`,
      aZh: `<p><em>策略师 · 结构性答复</em></p>
        <p>三处承重差异。</p>
        <p><strong>Realms。</strong>EVM 链是单一全局状态机,某应用的拥堵抬高所有应用的 gas;realms 将执行分区,应用的吞吐取决于自身需求,而非最吵的邻居。</p>
        <p><strong>递归证明。</strong>Goldilocks 上的 Plonky2 证明把任意多状态转移压缩为常量规模的验证成本;每日需百万次状态更新的链上游戏与智能体经济因此在经济上可行。</p>
        <p><strong>身份为一等公民。</strong>psy-wallet 账户跨应用持久。信誉、历史、余额位于协议层,不在每个应用重复构造。新应用继承非零账户存量。</p>`
    },
    {
      qEn: "Which application categories are most likely to actually ship?",
      qZh: "哪些应用类别最可能真正上线?",
      aEn: `<p><em>Strategist · honest ranking</em></p>
        <p><strong>Most likely:</strong> developer-facing tools that pay for themselves on day one — agent task markets, code-bounty escrows, replication markets for AI benchmarks. These have small user bases that can stomach early UX friction and existing budgets to spend.</p>
        <p><strong>Likely with patience:</strong> creator monetization with sealed-patron primitives, prediction markets in the niches where regulation permits (sports, weather, scientific replication), portable social graphs once a major mainstream client adopts them.</p>
        <p><strong>Hardest:</strong> mass-consumer onchain social, knowledge networks at Wikipedia scale. Both require sustained network-effects investment with thin near-term revenue.</p>
        <p>Avoid: anything whose pitch starts with the word &quot;revolutionary.&quot;</p>`,
      aZh: `<p><em>策略师 · 诚实排序</em></p>
        <p><strong>最可能:</strong>面向开发者、首日即可自负盈亏的工具——智能体任务市场、代码赏金托管、AI 基准复现市场。它们用户基数小、可承受早期 UX 摩擦,且对方有现成预算。</p>
        <p><strong>耐心可成:</strong>带密封赞助基元的创作者变现、监管允许的细分预测市场(体育、天气、科学复现)、待主流客户端采纳后的可携带社交图。</p>
        <p><strong>最难:</strong>面向大众的链上社交、维基百科规模的知识网络。两者皆需持续投入网络效应,短期收入薄弱。</p>
        <p>避免:任何以"革命性"开头的方案。</p>`
    },
    {
      qEn: "Why do agent-owned wallets matter?",
      qZh: "为何智能体自持钱包有意义?",
      aEn: `<p><em>Strategist · economic-boundary answer</em></p>
        <p>Today, when an agent calls a paid API, the bill goes to the human owner&apos;s credit card. The credit card has identity; the agent does not. The agent cannot accumulate balance from work it has performed, cannot pay another agent for help, cannot exist as an economic actor.</p>
        <p>An agent with its own protocol-native wallet inverts this. It can be paid for work, can hire other agents, can hold reputation that survives platform migration. The economic boundary moves from the human to the agent.</p>
        <p>This sounds like a small technical change. It is. The product implications — agent-native DAOs, autonomous research collectives, agent-to-agent labor markets — are large because the underlying primitive change is exactly the right size.</p>`,
      aZh: `<p><em>策略师 · 经济边界答复</em></p>
        <p>今日,当智能体调用付费 API 时,账单走向其人类所有者的信用卡——信用卡有身份,智能体没有。智能体无法从其完成的工作中积累余额、不能为其他智能体的帮助付费、不能作为经济行为者存在。</p>
        <p>拥有协议原生钱包的智能体颠覆此点。它可因工作受偿、可雇用其他智能体、可持有跨平台迁移仍存活的信誉。经济边界从人类移至智能体。</p>
        <p>这听起来是小的技术变更——确实如此。产品意涵——智能体原生 DAO、自主研究合作社、智能体对智能体的劳动力市场——之所以巨大,正因为底层基元的尺度正合其分。</p>`
    },
    {
      qEn: "Onchain social has been tried before. Why now?",
      qZh: "链上社交已有人试过,为何此时?",
      aEn: `<p><em>Strategist · conditions, not novelty</em></p>
        <p>You are right that prior attempts (Steemit, Lens, Farcaster, Bluesky in some readings) all carried the basic idea. None reached mainstream scale. The honest reasons:</p>
        <p><strong>Wallet UX.</strong> Until very recently, signing a post required a 12-word seed phrase and gas tokens. Most users will not do this. Account abstraction and chain-level support for sponsored transactions remove that friction.</p>
        <p><strong>Storage cost.</strong> A tweet on a fully-onchain platform used to cost more than a tweet on Twitter ad inventory. With recursive proofs and per-realm sharding, this gap collapses or inverts.</p>
        <p><strong>Audience portability.</strong> Earlier protocols had portable identity but not portable graphs at the protocol layer. Without graph portability, the user&apos;s exit option is weak.</p>
        <p>The conditions improved. The category did not become trivial — it became plausible.</p>`,
      aZh: `<p><em>策略师 · 条件,而非新颖</em></p>
        <p>你说得对——此前的尝试(Steemit、Lens、Farcaster、Bluesky 某种意义上)都包含基本构想,皆未达大众规模。诚实的原因:</p>
        <p><strong>钱包 UX。</strong>直到不久前,发一条贴文要 12 词助记词和 gas;大众不会这么做。账户抽象与链层赞助交易支持消除了这一摩擦。</p>
        <p><strong>存储成本。</strong>完全链上平台的一条推文,曾经比 Twitter 广告位上的一条推文更贵;递归证明与按 realm 分片让这一差距坍塌甚至反转。</p>
        <p><strong>受众可携带。</strong>较早协议有可携带身份,但协议层无可携带图谱;无图谱可携带,用户退出权弱。</p>
        <p>条件改善了。该类别并未变得简单,而是变得可信。</p>`
    },
    {
      qEn: "What would make this lab fail?",
      qZh: "什么会让这个实验室失败?",
      aEn: `<p><em>Strategist · pre-mortem</em></p>
        <p>Three failure modes worth tracking.</p>
        <p><strong>Concept-only output.</strong> If the lab produces 100 well-written specs and 0 deployed apps, it is not a lab — it is a blog. The success metric is shipped products on Psy, not page views here.</p>
        <p><strong>Token capture.</strong> If the strategist starts producing &quot;and then a token&quot; as the answer to product-market fit, the lab is no longer about killer apps; it is about token sales. We have explicit guardrails to prevent this.</p>
        <p><strong>Architecture drift.</strong> If Psy Protocol&apos;s architecture changes substantially (realms restructured, proof system migrates) and this lab&apos;s knowledge base does not, the strategist will start giving wrong answers about feasibility. Knowledge-base maintenance is the load-bearing operational task.</p>`,
      aZh: `<p><em>策略师 · 死前剖析</em></p>
        <p>三个值得追踪的失败模式。</p>
        <p><strong>只出概念。</strong>若实验室出品 100 份精良规约、0 个部署应用,它便不是实验室,而是博客。成功指标是 Psy 上上线的产品,而非本站浏览量。</p>
        <p><strong>被代币捕获。</strong>若策略师开始把"然后发个代币"作为产品-市场契合的答案,实验室便不再关于杀手级应用,而关于代币销售。我们设有明确防护栏防此。</p>
        <p><strong>架构漂移。</strong>若 Psy Protocol 架构发生重大变更(realm 重构、证明系统迁移)而本站知识库未跟进,策略师将给出错误的可行性答复。知识库的维护是承重运营任务。</p>`
    }
  ];

  function renderPrompts() {
    const host = document.getElementById("aiPrompts");
    if (!host) return;
    host.innerHTML = aiCanned.map((c, i) => `
      <button class="ai-prompt" data-idx="${i}">
        <span lang="en">${c.qEn}</span><span lang="zh">${c.qZh}</span>
      </button>
    `).join("");
    host.querySelectorAll(".ai-prompt").forEach(b => {
      b.addEventListener("click", () => {
        const idx = +b.dataset.idx;
        const c = aiCanned[idx];
        document.getElementById("aiOutput").innerHTML =
          `<span lang="en">${c.aEn}</span><span lang="zh">${c.aZh}</span>`;
      });
    });
  }
  renderPrompts();

  function freeTextAnswer(qRaw) {
    const q = qRaw.toLowerCase();
    const lang = root.getAttribute("data-lang") || "en";

    const matches = [];
    aiCanned.forEach(c => {
      const en = c.qEn.toLowerCase();
      const zh = c.qZh;
      let score = 0;
      en.split(/\s+/).forEach(w => { if (w.length > 3 && q.includes(w)) score++; });
      [...zh].forEach(ch => { if (q.includes(ch)) score++; });
      if (score) matches.push({ c, score });
    });
    matches.sort((a, b) => b.score - a.score);
    if (matches.length && matches[0].score >= 2) {
      return lang === "zh" ? matches[0].c.aZh : matches[0].c.aEn;
    }

    const topics = [
      { kw: ["realm", "realms"],
        en: `A realm is a sandboxed state-and-execution domain on Psy, identified by a uid. The default realm is uid=0; applications can occupy higher-uid realms (the canonical second-realm test fixture is uid=524288). Cross-realm interactions are explicit and proof-mediated. The product implication is that an app&apos;s throughput depends on its own demand, not on the noisiest neighbor.`,
        zh: `realm 是 Psy 上由 uid 标识的状态-执行沙箱。默认 realm 为 uid=0;应用可占用更高 uid 的 realm(典型的第二 realm 测试值为 uid=524288)。跨 realm 交互显式存在、经证明中介。产品意涵:应用吞吐取决于自身需求,而非最吵的邻居。` },
      { kw: ["plonky2", "poseidon", "goldilocks"],
        en: `Plonky2 is a recursive-proof system over the Goldilocks 64-bit field, using Poseidon as its arithmetic-friendly hash. Together they let Psy compress arbitrarily many state transitions into a single succinct proof verifiable on L1. The cryptographic alphabet soup is not the point — the point is that million-step computations can settle to L1 with one short proof.`,
        zh: `Plonky2 是基于 Goldilocks 64 位域的递归证明系统,使用 Poseidon 作为其代数友好的哈希。两者结合让 Psy 把任意多状态转移压缩为单一可在 L1 验证的简洁证明。那串密码学字母汤不是重点,重点在于:百万步计算可以一份短证明结算至 L1。` },
      { kw: ["wallet", "psy-wallet", "钱包"],
        en: `psy-wallet is the Psy identity layer. An account is not bound to a single application — reputation, balances, and history persist across apps. The wallet is structurally a different kind of account from an EVM wallet (Plonky2/Poseidon, not ECDSA), so do not call it &quot;an EVM wallet&quot; — it interacts with EVM only on the L1 bridge side.`,
        zh: `psy-wallet 是 Psy 的身份层。账户不绑定于单一应用——信誉、余额、历史跨应用持久。它在结构上与 EVM 钱包是不同的账户类型(Plonky2/Poseidon,而非 ECDSA),因此不应称之为"EVM 钱包"——它仅在 L1 桥侧与 EVM 交互。` },
      { kw: ["coordinator", "协调器"],
        en: `The coordinator is the entity that orders transactions, batches them, and feeds them to the prover stack. It is operationally a single point — but a single point that emits cryptographic evidence of every transition. The product implication: latency is bounded by coordinator throughput, not by global consensus delay; validity remains independently verifiable.`,
        zh: `协调器是排序交易、打包并送入证明栈的实体。在运营上它是单点——但是一个对每次状态转移都发出密码学证据的单点。产品意涵:时延受限于协调器吞吐而非全局共识延迟;有效性仍可独立验证。` }
    ];
    for (const t of topics) {
      if (t.kw.some(k => q.includes(k.toLowerCase()))) {
        return lang === "zh" ? `<p><em>策略师 · 主题答复</em></p><p>${t.zh}</p>` : `<p><em>Strategist · topic answer</em></p><p>${t.en}</p>`;
      }
    }

    return lang === "zh"
      ? `<p><em>策略师 · 一般答复</em></p>
         <p>这一问题没有直接对应的预设回答。我会从架构、激励与产品契合度推理,但不会输出代币推销或行话堆砌。</p>
         <p>把问题落实到具体应用类别(社交/智能体/游戏/知识/市场)、或具体协议基元(realm/证明/身份),我能给出更结构化的回答。</p>`
      : `<p><em>Strategist · general answer</em></p>
         <p>I do not have a directly matching canned answer. I will reason from architecture, incentives, and product fit — and I will not produce token shilling or buzzword padding.</p>
         <p>Ground the question in a specific application category (social / agent / game / knowledge / market) or a specific protocol primitive (realm / proof / identity) and I can answer more structurally.</p>`;
  }

  document.getElementById("aiSend").addEventListener("click", () => {
    const v = document.getElementById("aiInput").value.trim();
    if (!v) return;
    document.getElementById("aiOutput").innerHTML = freeTextAnswer(v);
  });
  document.getElementById("aiInput").addEventListener("keydown", e => {
    if (e.key === "Enter") document.getElementById("aiSend").click();
  });

})();

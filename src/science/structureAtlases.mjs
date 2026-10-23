// Curated concept atlases and verified label positions.
export const structureAtlases = {
  "tape-measure": {
    "id": "tape-measure",
    "name": "卷尺",
    "file": "science/structures/tape-measure.webp",
    "alt": "卷尺的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "平面卷簧回卷式钢卷尺；侧盖移开，卷簧仓作展示性剖开。",
    "review": "核对了尺带、卷簧、锁止件与外壳；未将卷簧误画为螺旋压簧。图中局部接头为概念造型，回卷关系以原理互动为准。",
    "sources": [
      [
        "回卷式卷尺专利",
        "https://patents.google.com/patent/US5210956A/en"
      ]
    ],
    "parts": [
      {
        "name": "平面卷簧",
        "x": 45,
        "y": 36,
        "short": "弹性变形储能，释放时带动回卷。",
        "detail": "卷簧是卷成平面螺旋的薄钢带，一端连接固定轴，另一端随卷盘。拉尺时增加储能，不靠电机或齿轮驱动。"
      },
      {
        "name": "钢尺带",
        "x": 75,
        "y": 69,
        "short": "卷在卷盘上，从出口拉出。",
        "detail": "黄色尺带与回卷弹簧是不同零件；尺带的弧形横截面有助于伸出时保持挺直。"
      },
      {
        "name": "锁止机构",
        "x": 71,
        "y": 30,
        "short": "按下后限制尺带滑动。",
        "detail": "典型锁止件靠压紧或卡住尺带保持长度，不会使卷簧的储能消失。"
      },
      {
        "name": "尺钩",
        "x": 95,
        "y": 78,
        "short": "搭住被测物边缘。",
        "detail": "尺钩用于定位起点，部分卷尺的尺钩允许小幅滑移以补偿自身厚度。"
      }
    ],
    "thumbnail": "science/structures/tape-measure-thumb.webp"
  },
  "ballpoint": {
    "id": "ballpoint",
    "name": "圆珠笔笔尖",
    "file": "science/structures/ballpoint.webp",
    "alt": "圆珠笔笔尖的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "普通球珠供墨笔尖的放大剖面；墨层与间隙为便于观察而放大。",
    "review": "核对单颗球珠、笔座、供墨通道及纸面接触位置；图中墨迹厚度和气泡不代表正常出墨量。",
    "sources": [
      [
        "PILOT · 圆珠笔工作方式",
        "https://www.pilot.co.jp/support/ballpen/1120630707879.html"
      ]
    ],
    "parts": [
      {
        "name": "储墨管",
        "x": 22,
        "y": 42,
        "short": "储存书写使用的油墨。",
        "detail": "储墨空间通过细通道向球珠背面供墨。不同墨水类型的黏度和供墨设计不同。"
      },
      {
        "name": "供墨通道",
        "x": 64,
        "y": 53,
        "short": "把油墨送到球珠背面。",
        "detail": "通道与球珠周围微小间隙相连，图中为可见性而放大；不是一根大管直接向纸上喷水。"
      },
      {
        "name": "球珠与笔座",
        "x": 84,
        "y": 57,
        "short": "球珠滚动，把表面油墨转移到纸上。",
        "detail": "金属笔座保持球珠位置，允许它转动。书写时球珠接触纸面，背面补墨，表面带墨。"
      },
      {
        "name": "纸面墨迹",
        "x": 92,
        "y": 69,
        "short": "油墨从球面转移到纸纤维上。",
        "detail": "图中蓝色层强调转移位置。真实字迹通常比示意更薄，笔尖也并非必须水平使用。"
      }
    ],
    "thumbnail": "science/structures/ballpoint-thumb.webp"
  },
  "thermos": {
    "id": "thermos",
    "name": "保温杯",
    "file": "science/structures/thermos.webp",
    "alt": "保温杯的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "双层不锈钢真空保温杯；杯盖上移以显示密封部位。",
    "review": "核对了两层金属壁、壁间空隙及内腔，水只在内胆中。真空层不是泡沫；杯口仍有固体导热路径。",
    "sources": [
      [
        "Thermos · 真空隔热原理",
        "https://thermos.com/blogs/news/how-vacuum-insulation-works-the-science-behind-thermos%C2%AE-products"
      ]
    ],
    "parts": [
      {
        "name": "杯盖与密封圈",
        "x": 49,
        "y": 12,
        "short": "减少杯口的空气交换和漏水。",
        "detail": "杯盖封住内胆开口，密封圈改善密封。热量仍能通过杯盖材料和杯口传递。"
      },
      {
        "name": "内胆",
        "x": 42,
        "y": 40,
        "short": "容纳饮品，与外壳分开。",
        "detail": "内胆本身是金属容器；靠双层结构和低气压夹层减缓热量交换，并非金属不导热。"
      },
      {
        "name": "真空夹层",
        "x": 58.5,
        "y": 52,
        "short": "减少气体导热和对流。",
        "detail": "夹层中的气体被大量抽走。真空不能阻断热辐射，反射性表面另有降低辐射换热的作用。"
      },
      {
        "name": "外壳",
        "x": 59.5,
        "y": 76,
        "short": "保护内胆和低压夹层。",
        "detail": "外壳提供机械保护；杯口连接、少量支撑及辐射仍使热量缓慢传递，所以保温有时间限制。"
      }
    ],
    "thumbnail": "science/structures/thermos-thumb.webp"
  },
  "faucet": {
    "id": "faucet",
    "name": "陶瓷阀芯",
    "file": "science/structures/faucet.webp",
    "alt": "陶瓷阀芯的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "单柄混水龙头陶瓷阀芯的分解示意；不同型号孔形不同。",
    "review": "核对上下两片陶瓷、驱动杆和底部密封。上片为展示水道翻面呈现；实际装配时光滑配合面贴合，图示间距不代表工作状态。",
    "sources": [
      [
        "GROHE · 陶瓷阀芯技术资料",
        "https://www.grohe.co.jp/pdf/GROHE-Reference-Book_Vol-5.pdf"
      ]
    ],
    "parts": [
      {
        "name": "驱动杆",
        "x": 50,
        "y": 12,
        "short": "把手柄动作传给活动陶瓷片。",
        "detail": "抬起和转动手柄会改变活动片位置，从而调节开口面积及冷热水混合比例。"
      },
      {
        "name": "活动陶瓷片",
        "x": 50,
        "y": 43,
        "short": "移动后改变水道连通范围。",
        "detail": "图中为便于看清凹槽而展示了水道面。实际与固定片紧密接触，不能按悬空状态理解。"
      },
      {
        "name": "固定陶瓷片",
        "x": 50,
        "y": 59,
        "short": "提供进水和混合水通道。",
        "detail": "图示三个通道对应冷热进水与出水，红蓝仅作识别；孔形和排列因型号而异。"
      },
      {
        "name": "底部密封件",
        "x": 50,
        "y": 74,
        "short": "限制接口处漏水和串流。",
        "detail": "底部弹性密封件围住对应水口。外壳保持各层位置，陶瓷片的贴合面承担重要密封作用。"
      }
    ],
    "thumbnail": "science/structures/faucet-thumb.webp"
  },
  "hairdryer": {
    "id": "hairdryer",
    "name": "吹风机",
    "file": "science/structures/hairdryer.webp",
    "alt": "吹风机的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "电机风扇位于后部、发热丝位于前部的典型吹风机。",
    "review": "核对空气从进风侧经过风机再到发热区的顺序；电路与温控件未完整展示，不作为维修接线依据。",
    "sources": [
      [
        "吹风机结构专利",
        "https://patents.google.com/patent/US9149105B2/en"
      ]
    ],
    "parts": [
      {
        "name": "进风口与叶轮",
        "x": 17,
        "y": 24,
        "short": "叶轮推动空气穿过机身。",
        "detail": "后部格栅供空气进入，旋转叶轮建立空气流动；不能把空气仅靠受热膨胀当作风源。"
      },
      {
        "name": "电机",
        "x": 33,
        "y": 26,
        "short": "把电能转化为叶轮转动。",
        "detail": "电机与叶轮连接。冷风模式仍可让电机转动，而关闭或降低加热。"
      },
      {
        "name": "发热丝与绝缘支架",
        "x": 66,
        "y": 26,
        "short": "给流过的空气传热。",
        "detail": "电流使电阻丝发热，绝缘耐热支架保持位置。气流带走热量，发热丝不需要产生明火。"
      },
      {
        "name": "出风口",
        "x": 91,
        "y": 28,
        "short": "将加热或未加热的空气送出。",
        "detail": "空气温度取决于加热功率、风量和环境。喷嘴改变出风形状，不凭空增加热量。"
      }
    ],
    "thumbnail": "science/structures/hairdryer-thumb.webp"
  },
  "pressure-cooker": {
    "id": "pressure-cooker",
    "name": "高压锅",
    "file": "science/structures/pressure-cooker.webp",
    "alt": "高压锅的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "带限压装置和独立安全泄压结构的炉灶式压力锅示意。 水蒸气本身不可见；白色雾状效果只提示流动，不表示锅内充满可见白汽。",
    "review": "核对锅体、密封圈、调压与安全泄压部件彼此独立。白色雾气仅表示汽化过程，不代表水蒸气本身有白色。阀件细节因型号不同。",
    "sources": [
      [
        "Presto · 压力锅部件说明",
        "https://www.gopresto.com/parts.php?product_id=10563"
      ]
    ],
    "parts": [
      {
        "name": "密封圈",
        "x": 22,
        "y": 32,
        "short": "帮助维持锅内压力。",
        "detail": "密封圈夹在锅盖与锅口之间，减少无控制的漏气。结构示意不替代具体产品的使用说明。"
      },
      {
        "name": "限压装置",
        "x": 50,
        "y": 11,
        "short": "达到工作压力后调节排汽。",
        "detail": "阀的受力决定何时允许蒸气排出，图中以常见顶置调压结构表达；不是把锅永久完全封死。"
      },
      {
        "name": "独立安全泄压件",
        "x": 67,
        "y": 18,
        "short": "异常压力下提供额外泄压路径。",
        "detail": "安全件与正常调压件承担不同作用，实际开启方式与压力按产品设计，不能由插画判断。"
      },
      {
        "name": "水与食物",
        "x": 49,
        "y": 76,
        "short": "较高压力使沸腾温度升高。",
        "detail": "蒸气增加锅内压力，水可以在更高温度沸腾，因此许多食物更快熟软；不是压力直接把食物压熟。"
      }
    ],
    "thumbnail": "science/structures/pressure-cooker-thumb.webp"
  },
  "eye": {
    "id": "eye",
    "name": "眼球",
    "file": "science/structures/eye.webp",
    "alt": "眼球的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "人眼矢状剖面的教学模型；颜色与组织厚度作了增强。",
    "review": "核对角膜在前、晶状体位于虹膜后、视网膜沿后壁、视神经从后部离开的关系。黑色瞳孔是开口的视觉表现，不是黑色实体。",
    "sources": [
      [
        "NEI · 眼睛如何工作",
        "https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work"
      ]
    ],
    "parts": [
      {
        "name": "角膜",
        "x": 13,
        "y": 45,
        "short": "透明前表面，让光进入并发生折射。",
        "detail": "角膜与晶状体共同帮助成像，不能把全部聚焦作用都归给晶状体。"
      },
      {
        "name": "晶状体",
        "x": 35,
        "y": 45,
        "short": "调节形状，帮助看清不同距离。",
        "detail": "晶状体位于虹膜之后，由周围组织调节曲率；不是通过前后移动一整块镜片完成日常调焦。"
      },
      {
        "name": "视网膜",
        "x": 72,
        "y": 65,
        "short": "感光细胞将光刺激转为神经信号。",
        "detail": "视网膜是眼球内壁的薄层，图中用橙色增强。真正的感光结构远比此图细小。"
      },
      {
        "name": "视神经",
        "x": 87,
        "y": 54,
        "short": "把视觉相关信号传向大脑。",
        "detail": "眼睛形成光学像，感知世界还需要大脑处理；视神经不是把光束原样送入脑内。"
      }
    ],
    "thumbnail": "science/structures/eye-thumb.webp"
  },
  "ear": {
    "id": "ear",
    "name": "耳朵",
    "file": "science/structures/ear.webp",
    "alt": "耳朵的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "外耳、中耳与内耳的非等比例剖面；听小骨作放大展示。",
    "review": "核对鼓膜—听小骨—耳蜗的连接顺序。上方半规管主要参与平衡，不能把它标作声音的主要感受部位。",
    "sources": [
      [
        "NIDCD · 听觉过程",
        "https://www.nidcd.nih.gov/health/how-do-we-hear"
      ]
    ],
    "parts": [
      {
        "name": "外耳道",
        "x": 33,
        "y": 46,
        "short": "把声波引向鼓膜。",
        "detail": "外耳收集声波，耳道内空气压力变化传至鼓膜，而不是空气直接进入耳蜗。"
      },
      {
        "name": "鼓膜",
        "x": 48,
        "y": 48,
        "short": "随声波产生微小振动。",
        "detail": "鼓膜是外耳道与中耳之间的薄膜，将空气振动传给与它相连的锤骨。"
      },
      {
        "name": "听小骨链",
        "x": 56,
        "y": 38,
        "short": "把振动传向内耳。",
        "detail": "锤骨、砧骨和镫骨依次传递振动，镫骨作用于卵圆窗；图中为了辨认而放大。"
      },
      {
        "name": "耳蜗",
        "x": 77,
        "y": 55,
        "short": "将机械振动转换为听觉信号。",
        "detail": "耳蜗内液体和基底膜运动影响毛细胞，再经听神经传出信号。螺旋外形不表示声音绕圈行走。"
      }
    ],
    "thumbnail": "science/structures/ear-thumb.webp"
  },
  "lungs": {
    "id": "lungs",
    "name": "肺与呼吸",
    "file": "science/structures/lungs.webp",
    "alt": "肺与呼吸的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "胸腔正面结构示意；心脏和部分胸壁省略，支气管末端的肺泡需在原理互动中进一步放大。",
    "review": "核对气管分叉、左右肺和下方膈肌；呼吸来自胸腔容积变化，肺没有主动抽气的肌肉。",
    "sources": [
      [
        "NHLBI · 肺如何工作",
        "https://www.nhlbi.nih.gov/health/lungs"
      ]
    ],
    "parts": [
      {
        "name": "气管",
        "x": 50,
        "y": 15,
        "short": "把空气送入胸腔。",
        "detail": "气管以软骨维持通道开放，随后分成左右主支气管。"
      },
      {
        "name": "支气管",
        "x": 45,
        "y": 32,
        "short": "在肺内逐级分支。",
        "detail": "空气经过越来越细的分支到达呼吸区，气体交换主要发生在肺泡。"
      },
      {
        "name": "肺",
        "x": 32,
        "y": 46,
        "short": "内含大量肺泡及毛细血管。",
        "detail": "人的右肺通常三叶、左肺两叶；肺泡薄壁便于氧气和二氧化碳交换。"
      },
      {
        "name": "膈肌",
        "x": 50,
        "y": 78,
        "short": "收缩下降，帮助吸气。",
        "detail": "膈肌收缩使胸腔容积增大、肺内压力下降；放松时与其他结构共同参与呼气。"
      }
    ],
    "thumbnail": "science/structures/lungs-thumb.webp"
  },
  "muscles": {
    "id": "muscles",
    "name": "肌肉与关节",
    "file": "science/structures/muscles.webp",
    "alt": "肌肉与关节的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "屈肘肌群的局部结构示意；只展示主要位置，不代表完整肌群或精确附着面积。",
    "review": "核对肌肉—肌腱—骨的连接及肘部位置；肌肉主动收缩产生拉力，不主动推骨。",
    "sources": [
      [
        "OpenStax · 骨骼肌配合",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/11-1-interactions-of-skeletal-muscles-their-fascicle-arrangement-and-their-lever-systems"
      ]
    ],
    "parts": [
      {
        "name": "肱二头肌",
        "x": 39,
        "y": 29,
        "short": "收缩时参与屈肘。",
        "detail": "肱二头肌通过肌腱连接骨，屈肘还需要肱肌等肌群共同参与。"
      },
      {
        "name": "肱三头肌",
        "x": 21,
        "y": 29,
        "short": "参与把肘关节伸直。",
        "detail": "它与屈肌群在动作中配合，并不是所有时候只有一块肌肉工作。"
      },
      {
        "name": "肌腱",
        "x": 50,
        "y": 64,
        "short": "把肌肉拉力传给骨。",
        "detail": "白色结缔组织把肌肉连接到骨上，图中宽度和附着范围经过简化。"
      },
      {
        "name": "肘关节",
        "x": 35,
        "y": 72,
        "short": "提供骨之间的活动连接。",
        "detail": "关节面、韧带等限制并引导活动方向，不是任意转动的球形铰链。"
      }
    ],
    "thumbnail": "science/structures/muscles-thumb.webp"
  },
  "washer": {
    "id": "washer",
    "name": "滚筒洗衣机",
    "file": "science/structures/washer.webp",
    "alt": "滚筒洗衣机的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "皮带传动式前开门滚筒洗衣机；其他机型可能采用直接驱动。",
    "review": "核对内筒、外筒、皮带与排水泵位置；脱水利用旋转使水穿过筒孔，排水泵再把水送走。",
    "sources": [
      [
        "Bosch · 洗衣机说明书",
        "https://media3.bosch-home.com/Documents/9001034699_A.pdf"
      ]
    ],
    "parts": [
      {
        "name": "带孔内筒",
        "x": 45,
        "y": 30,
        "short": "带动衣物翻滚，孔洞让水通过。",
        "detail": "洗涤时衣物被提升后落下；高速脱水时衣物贴近筒壁，水穿过孔洞进入外筒。"
      },
      {
        "name": "外筒",
        "x": 63,
        "y": 28,
        "short": "盛水并包围旋转内筒。",
        "detail": "内筒转动，外筒通过弹簧和减振器支承；二者不是同一个盛水容器。"
      },
      {
        "name": "皮带传动",
        "x": 78,
        "y": 52,
        "short": "把电机转动传给滚筒。",
        "detail": "电机通过皮带和大带轮改变转速；本图不代表直驱洗衣机。"
      },
      {
        "name": "排水泵",
        "x": 56,
        "y": 80,
        "short": "把外筒中的水排出。",
        "detail": "甩出的水仍需排水系统送出机器，不能仅靠内筒转动排到房间外。"
      }
    ],
    "thumbnail": "science/structures/washer-thumb.webp"
  },
  "air-filter": {
    "id": "air-filter",
    "name": "空气净化滤层",
    "file": "science/structures/air-filter.webp",
    "alt": "空气净化滤层的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "一种多级过滤结构的拆解图，滤层顺序因产品而异；图示厚度放大。",
    "review": "区分预滤、颗粒过滤、气体吸附与风机；HEPA不是只拦截大于某一孔径的颗粒。",
    "sources": [
      [
        "EPA · HEPA过滤",
        "https://www.epa.gov/indoor-air-quality-iaq/what-hepa-filter"
      ]
    ],
    "parts": [
      {
        "name": "预过滤网",
        "x": 28,
        "y": 45,
        "short": "先拦住毛发等较大颗粒。",
        "detail": "预滤层减少后续精细滤层的负担，实际可清洁性以产品说明为准。"
      },
      {
        "name": "折叠纤维滤层",
        "x": 45,
        "y": 45,
        "short": "利用纤维网络捕集颗粒。",
        "detail": "拦截、惯性碰撞与扩散等共同作用；折叠增加过滤面积。"
      },
      {
        "name": "活性炭层",
        "x": 62,
        "y": 45,
        "short": "吸附部分气态物质。",
        "detail": "吸附能力有限，并不能永久去除所有气体，也不等同于颗粒过滤。"
      },
      {
        "name": "风机",
        "x": 80,
        "y": 42,
        "short": "推动空气穿过滤层。",
        "detail": "必须有实际气流经过滤材才能持续净化；风量、阻力和密封都会影响效果。"
      }
    ],
    "thumbnail": "science/structures/air-filter-thumb.webp"
  },
  "wind-turbine": {
    "id": "wind-turbine",
    "name": "齿轮传动风电机组",
    "file": "science/structures/wind-turbine.webp",
    "alt": "齿轮传动风电机组的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "齿轮传动型机舱局部剖面；另有不使用增速齿轮箱的直驱机型。",
    "review": "核对主轴—齿轮箱—发电机的先后关系，偏航支承位于机舱下方；未把齿轮箱说成所有风机的必需件。",
    "sources": [
      [
        "美国能源部 · 风机结构",
        "https://www.energy.gov/cmei/systems/how-do-wind-turbines-work"
      ]
    ],
    "parts": [
      {
        "name": "叶轮与主轴",
        "x": 29,
        "y": 41,
        "short": "接收风作用产生的转矩。",
        "detail": "叶片气动受力带动叶轮转动，主轴把机械能传入机舱。"
      },
      {
        "name": "齿轮箱",
        "x": 53,
        "y": 42,
        "short": "匹配叶轮与发电机转速。",
        "detail": "这类机组用齿轮传动增速；直驱机组采用不同结构。"
      },
      {
        "name": "发电机",
        "x": 84,
        "y": 43,
        "short": "把机械能转换成电能。",
        "detail": "转子与磁场、绕组相互作用产生电能，还需电力电子等系统接入电网。"
      },
      {
        "name": "偏航支承",
        "x": 52,
        "y": 75,
        "short": "让机舱能够调整朝向。",
        "detail": "偏航系统使叶轮朝向合适风向，转动的是整个机舱，并非仅改变叶片自身角度。"
      }
    ],
    "thumbnail": "science/structures/wind-turbine-thumb.webp"
  },
  "groundwater": {
    "id": "groundwater",
    "name": "地下含水层",
    "file": "science/structures/groundwater.webp",
    "alt": "地下含水层的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "松散沉积物中的孔隙含水层示意；蓝色用于突出饱和区，不代表地下有一整块空水槽。",
    "review": "核对水位上下差别及井筛位置；地下水主要占据孔隙和裂隙，岩溶洞穴是特殊情况。",
    "sources": [
      [
        "USGS · 地下水",
        "https://www.usgs.gov/special-topics/water-science-school/science/groundwater-what-groundwater"
      ]
    ],
    "parts": [
      {
        "name": "非饱和带",
        "x": 61,
        "y": 30,
        "short": "孔隙中同时有空气和水。",
        "detail": "地面以下不一定全部充满水；雨水可以继续向下渗入。"
      },
      {
        "name": "饱和含水层",
        "x": 61,
        "y": 54,
        "short": "连通孔隙被水充满。",
        "detail": "颗粒间的空间储水，孔隙是否连通决定水能否较容易流动。"
      },
      {
        "name": "低渗透岩层",
        "x": 48,
        "y": 80,
        "short": "阻碍水向下快速通过。",
        "detail": "图中深色岩层代表较低渗透层，不表示任何岩石都完全不透水。"
      },
      {
        "name": "井与滤水段",
        "x": 83,
        "y": 56,
        "short": "连通含水层中的水。",
        "detail": "井底部带孔滤水段允许水进入井内，抽水会改变附近水位。"
      }
    ],
    "thumbnail": "science/structures/groundwater-thumb.webp"
  },
  "volcano": {
    "id": "volcano",
    "name": "火山内部",
    "file": "science/structures/volcano.webp",
    "alt": "火山内部的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "层状火山概念剖面；储存区、通道和晶体显著放大，真实地下系统更复杂。",
    "review": "核对火山口、通道、岩脉及含晶体的岩浆储存区；地下并非一片全球连通的液态岩浆海。",
    "sources": [
      [
        "USGS · 岩浆储存区与晶粥",
        "https://www.usgs.gov/observatories/yvo/news/yellowstones-mushy-past"
      ]
    ],
    "parts": [
      {
        "name": "火山口",
        "x": 50,
        "y": 7,
        "short": "喷出物到达地表的出口区域。",
        "detail": "喷发方式取决于岩浆性质、气体和通道条件；并非每次都流出平静熔岩。"
      },
      {
        "name": "主通道",
        "x": 50,
        "y": 37,
        "short": "连接深部与地表。",
        "detail": "岩浆可沿裂隙和通道上升，图中的直立通道是简化表达。"
      },
      {
        "name": "岩脉",
        "x": 42,
        "y": 43,
        "short": "沿裂缝侵入周围岩石。",
        "detail": "侵入岩浆不一定到达地表，也可能在地下冷却凝固。"
      },
      {
        "name": "岩浆储存区",
        "x": 49,
        "y": 72,
        "short": "熔体、晶体和气体共存。",
        "detail": "真实储存区可能是多个相互连通的区域，通常不是一个空洞装满纯液体。"
      }
    ],
    "thumbnail": "science/structures/volcano-thumb.webp"
  },
  "flower-fruit": {
    "id": "flower-fruit",
    "name": "花的生殖结构",
    "file": "science/structures/flower-fruit.webp",
    "alt": "花的生殖结构的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "具上位子房的两性花结构示意；不是桃、樱或梨的物种鉴别照片。",
    "review": "核对花药与柱头不同、胚珠位于子房内部；多数被子植物受精后胚珠发育为种子，子房参与形成果实。",
    "sources": [
      [
        "OpenStax · 传粉与受精",
        "https://openstax.org/books/biology-2e/pages/32-2-pollination-and-fertilization"
      ]
    ],
    "parts": [
      {
        "name": "花药",
        "x": 62,
        "y": 24,
        "short": "形成并释放花粉。",
        "detail": "花药位于雄蕊顶端，花粉的到达不等于已经完成受精。"
      },
      {
        "name": "柱头与花柱",
        "x": 50,
        "y": 20,
        "short": "接受花粉，提供花粉管路径。",
        "detail": "适合的花粉可在柱头上萌发，花粉管沿花柱向胚珠方向生长。"
      },
      {
        "name": "子房",
        "x": 55,
        "y": 72,
        "short": "包围并保护胚珠。",
        "detail": "受精后，子房通常参与发育成果实；一些果实还有其他花部参与。"
      },
      {
        "name": "胚珠",
        "x": 46,
        "y": 64,
        "short": "受精后通常发育为种子。",
        "detail": "胚珠内部包含雌配子体；不能把图中的胚珠直接称为已经成熟的种子。"
      }
    ],
    "thumbnail": "science/structures/flower-fruit-thumb.webp"
  },
  "cactus": {
    "id": "cactus",
    "name": "仙人掌的耐旱结构",
    "file": "science/structures/cactus.webp",
    "alt": "仙人掌的耐旱结构的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "球形仙人掌的概念剖面；细胞尺度放大，不作为具体种的鉴定图。",
    "review": "核对绿色茎、储水组织、刺座及浅根；内部水分主要储存在细胞中，不是空腔水袋。",
    "sources": [
      [
        "美国国家公园管理局 · 仙人掌",
        "https://www.nps.gov/arch/learn/nature/cacti.htm"
      ]
    ],
    "parts": [
      {
        "name": "绿色茎表面",
        "x": 42,
        "y": 39,
        "short": "承担光合作用并减少失水。",
        "detail": "许多仙人掌的叶退化为刺，绿色茎成为主要光合器官；表面保护层有助于节水。"
      },
      {
        "name": "储水组织",
        "x": 58,
        "y": 40,
        "short": "细胞储存水分。",
        "detail": "厚茎内含大量储水组织，降雨后吸水、干旱时逐渐消耗。"
      },
      {
        "name": "刺与刺座",
        "x": 33,
        "y": 31,
        "short": "提供防护及一定遮蔽。",
        "detail": "刺从刺座生出；刺并不是吸收地下水的管道。"
      },
      {
        "name": "浅层根系",
        "x": 47,
        "y": 73,
        "short": "快速吸收表层降水。",
        "detail": "图示广展根系有利于利用短暂降雨，不代表所有仙人掌根形完全相同。"
      }
    ],
    "thumbnail": "science/structures/cactus-thumb.webp"
  },
  "cat-eyes": {
    "id": "cat-eyes",
    "name": "猫眼的暗光适应",
    "file": "science/structures/cat-eyes.webp",
    "alt": "猫眼的暗光适应的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "猫眼概念剖面，反光层以绿色突出；颜色和层厚为教学增强。",
    "review": "核对瞳孔、晶状体、视网膜与其后方反光层；猫需要光才能看见，眼睛不会自行照明。",
    "sources": [
      [
        "Cornell · 猫的视觉",
        "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feline-vision-problems-host-possible-causes"
      ]
    ],
    "parts": [
      {
        "name": "瞳孔",
        "x": 25,
        "y": 46,
        "short": "改变进入眼睛的光量。",
        "detail": "瞳孔是虹膜中央的开口。明亮时猫的瞳孔可呈狭缝，暗处会扩大。"
      },
      {
        "name": "晶状体",
        "x": 38,
        "y": 48,
        "short": "与角膜共同聚焦。",
        "detail": "透明晶状体把光线聚向视网膜，不负责主动发光。"
      },
      {
        "name": "视网膜",
        "x": 70,
        "y": 68,
        "short": "感受光并形成神经信号。",
        "detail": "感光细胞帮助猫在较暗环境中观察；完全无光时仍无法仅靠视觉看清。"
      },
      {
        "name": "反光层",
        "x": 65,
        "y": 17,
        "short": "把部分光反射回感光层。",
        "detail": "位于视网膜后方的反光组织提高光的利用机会，夜间被照射时可出现眼睛反光。"
      }
    ],
    "thumbnail": "science/structures/cat-eyes-thumb.webp"
  },
  "penguins": {
    "id": "penguins",
    "name": "企鹅的保温层",
    "file": "science/structures/penguins.webp",
    "alt": "企鹅的保温层的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "羽毛覆盖区域的局部放大示意，层厚和羽毛间隙不按比例；不同企鹅和身体部位有差异。",
    "review": "核对外层羽毛、蓬松羽毛与空气、皮肤和皮下脂肪的层次；空气不是一个密封气囊。",
    "sources": [
      [
        "澳大利亚南极局 · 帝企鹅保温适应",
        "https://www.antarctica.gov.au/about-antarctica/animals/penguins/emperor-penguin/"
      ]
    ],
    "parts": [
      {
        "name": "外层羽毛",
        "x": 67,
        "y": 19,
        "short": "密集覆盖，减少水和风侵入。",
        "detail": "相互覆盖的羽毛有助于形成保护层，保温还依赖羽毛下的结构。"
      },
      {
        "name": "蓬松羽毛与空气",
        "x": 49,
        "y": 37,
        "short": "保留空气，减慢热量传递。",
        "detail": "细小羽枝间保留的空气提高保温能力，不是羽毛直接产生热量。"
      },
      {
        "name": "皮肤",
        "x": 52,
        "y": 51,
        "short": "包围并保护身体组织。",
        "detail": "皮肤和血液循环也参与体温调节，图中仅展示结构位置。"
      },
      {
        "name": "皮下脂肪",
        "x": 49,
        "y": 63,
        "short": "隔热并储存能量。",
        "detail": "脂肪和羽毛共同保温，不能用单一厚度解释所有企鹅的耐寒能力。"
      }
    ],
    "thumbnail": "science/structures/penguins-thumb.webp"
  },
  "popcorn": {
    "id": "popcorn",
    "name": "爆裂玉米粒",
    "file": "science/structures/popcorn.webp",
    "alt": "爆裂玉米粒的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "爆裂型玉米粒纵剖面；组织纹理放大，水分分布于组织中而非中央水池。",
    "review": "核对果皮、胚乳和胚的位置；加热使内部水汽压力升高，外壳破裂后淀粉膨胀。",
    "sources": [
      [
        "ACS · 爆米花中的科学",
        "https://www.acs.org/education/whatischemistry/adventures-in-chemistry/secret-science-stuff/popcorn.html"
      ]
    ],
    "parts": [
      {
        "name": "坚韧果皮",
        "x": 66,
        "y": 30,
        "short": "在受热初期约束内部压力。",
        "detail": "完整而较坚韧的外层是爆裂的重要条件，普通甜玉米不能简单得到同样效果。"
      },
      {
        "name": "胚乳",
        "x": 49,
        "y": 36,
        "short": "含有大量淀粉。",
        "detail": "含水淀粉受热变化，压力释放时迅速膨胀形成泡沫状结构。"
      },
      {
        "name": "胚",
        "x": 59,
        "y": 68,
        "short": "原本可发育成新植株。",
        "detail": "胚与富含淀粉的胚乳是不同结构，爆米花的白色膨大部分主要来自胚乳。"
      },
      {
        "name": "基部连接处",
        "x": 50,
        "y": 93,
        "short": "原先与玉米穗相连。",
        "detail": "玉米粒不是一个塑料密闭罐；图示是生物组织剖面，实际爆裂受水分、温度及外壳状态共同影响。"
      }
    ],
    "thumbnail": "science/structures/popcorn-thumb.webp"
  },
  "hook-loop": {
    "id": "hook-loop",
    "name": "钩环搭扣",
    "file": "science/structures/hook-loop.webp",
    "alt": "钩环搭扣的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "典型钩面与环面的局部放大；不是胶水粘合，其他搭扣可能采用蘑菇头结构。",
    "review": "核对钩子开口和纤维环的机械扣合，剥离时逐个脱开；未将所有钩环画成不可分离闭环。",
    "sources": [
      [
        "VELCRO · 钩环工作方式",
        "https://www.velcro.com/news-and-blog/2023/02/how-do-velcro-brand-fasteners-work/"
      ]
    ],
    "parts": [
      {
        "name": "钩面",
        "x": 69,
        "y": 30,
        "short": "细小钩子抓住纤维环。",
        "detail": "钩子的形状、密度和材料影响扣合强度与耐用性。"
      },
      {
        "name": "环面",
        "x": 70,
        "y": 70,
        "short": "提供可被钩住的纤维环。",
        "detail": "环面是一片纤维结构，不需要在每次使用时重新涂胶。"
      },
      {
        "name": "扣合区域",
        "x": 25,
        "y": 62,
        "short": "许多小连接共同承受拉力。",
        "detail": "按压使钩子进入环面，多个连接共同发挥作用。"
      },
      {
        "name": "剥离边缘",
        "x": 47,
        "y": 55,
        "short": "从边缘逐步解开连接。",
        "detail": "剥开时连接依次脱开，因而通常比同时垂直拉开整个面积容易。"
      }
    ],
    "thumbnail": "science/structures/hook-loop-thumb.webp"
  },
  "vacuum": {
    "id": "vacuum",
    "name": "袋式吸尘器",
    "file": "science/structures/vacuum-v2.webp",
    "alt": "袋式吸尘器的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "袋式卧式吸尘器的部件示意，内部风道和密封连接简化；不代表旋风分离式。",
    "review": "重画了电机和风机的同轴关系，区分集尘袋与电机前滤层；气路以原理互动为准。",
    "sources": [
      [
        "Miele · 袋式吸尘器过滤",
        "https://www.miele.co.uk/support/customer-assistance/bagged_or_bagless_vacuum_cleaner-1246/all/cleaning_performance_is_reduced_with_vacuum_cleaner_bag-92265764619"
      ]
    ],
    "parts": [
      {
        "name": "吸气接口",
        "x": 18,
        "y": 45,
        "short": "连接软管，接收含尘空气。",
        "detail": "风机造成压力差，外界空气携带灰尘进入软管；机器并没有从远处直接拉住灰尘。"
      },
      {
        "name": "集尘袋",
        "x": 40,
        "y": 49,
        "short": "留住灰尘，让空气继续通过。",
        "detail": "集尘袋也是过滤结构，堵塞会增大阻力、降低气流。"
      },
      {
        "name": "电机前滤层",
        "x": 60,
        "y": 46,
        "short": "减少颗粒进入动力组件。",
        "detail": "过滤后空气进入后部风机组件；部分产品还有独立排气滤层。"
      },
      {
        "name": "电机与离心风机",
        "x": 79,
        "y": 49,
        "short": "电机驱动叶轮形成持续气流。",
        "detail": "离心叶轮在壳体内转动，图中风道为简化布局，不用于拆装识别。"
      }
    ],
    "thumbnail": "science/structures/vacuum-v2-thumb.webp"
  },
  "fridge": {
    "id": "fridge",
    "name": "冰箱",
    "file": "science/structures/fridge-v2.webp",
    "alt": "冰箱的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "直冷式冰箱主要部件定位图；连接管路与节流元件省略，循环路径在原理互动中查看。",
    "review": "去除了初稿错误连接的管路，核对蒸发器在箱内吸热、冷凝器向室内放热。",
    "sources": [
      [
        "Danfoss · 冰箱如何工作",
        "https://www.danfoss.com/en/about-danfoss/our-businesses/cooling/the-fridge-how-it-works"
      ]
    ],
    "parts": [
      {
        "name": "蒸发器",
        "x": 50,
        "y": 20,
        "short": "制冷剂在这里吸收箱内热量。",
        "detail": "内部低温表面帮助降低箱内温度；风冷冰箱的蒸发器和送风布局不同。"
      },
      {
        "name": "保温层",
        "x": 63,
        "y": 48,
        "short": "减慢外界热量传入。",
        "detail": "保温层减少持续制冷的负担，门封也影响隔热效果。"
      },
      {
        "name": "冷凝器",
        "x": 78,
        "y": 36,
        "short": "把热量释放到房间。",
        "detail": "放出的热量包含从食物等处搬来的热量，以及压缩机做功转化的能量。"
      },
      {
        "name": "压缩机",
        "x": 73,
        "y": 78,
        "short": "压缩并推动制冷剂循环。",
        "detail": "循环依次经过压缩、冷凝、节流和蒸发，不能把压缩机直接接到蒸发器当作完整循环。"
      }
    ],
    "thumbnail": "science/structures/fridge-v2-thumb.webp"
  },
  "escalator": {
    "id": "escalator",
    "name": "自动扶梯",
    "file": "science/structures/escalator-v2.webp",
    "alt": "自动扶梯的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "梯级循环侧剖示意；轨道、梯级间距和端部过渡简化，不按工程尺寸。",
    "review": "重画了与上行段平行的斜向回程，核对倒置梯级回到下端；扶手带和梯级不是同一条带。",
    "sources": [
      [
        "TK Elevator · 扶梯规划指南",
        "https://www.tkelevator.com/media/usa_canada/products_4/product_brochures/escalator_movingwalk_planningguide.pdf"
      ]
    ],
    "parts": [
      {
        "name": "承载梯级",
        "x": 55,
        "y": 43,
        "short": "沿轨道形成连续台阶。",
        "detail": "梯级整体循环，单个台阶不会消失进楼板后变成新台阶。"
      },
      {
        "name": "梯级链与端部链轮",
        "x": 92,
        "y": 24,
        "short": "带动梯级绕端部转向。",
        "detail": "链条和驱动装置带动整组梯级，轨道控制踏面的姿态。"
      },
      {
        "name": "下方回程",
        "x": 63,
        "y": 61,
        "short": "倒置的梯级返回起点。",
        "detail": "回程隐藏在扶梯外壳中，沿斜向返回下端后再次进入承载段。"
      },
      {
        "name": "扶手带",
        "x": 44,
        "y": 30,
        "short": "随乘客移动提供扶持。",
        "detail": "扶手带有独立的循环与驱动关系，速度应与梯级协调。"
      }
    ],
    "thumbnail": "science/structures/escalator-v2-thumb.webp"
  },
  "lock": {
    "id": "lock",
    "name": "弹子锁",
    "file": "science/structures/lock.webp",
    "alt": "弹子锁的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "典型单排弹子锁的剖面；钥匙牙高作简化，图示匹配状态，不涉及开锁技巧。 弹子等高与钥匙轮廓经过简化，仅示分界对齐；实际钥匙的齿高差异请看原理互动。",
    "review": "核对上弹子、下弹子、弹簧和锁芯分界；正确钥匙让弹子交界对齐剪切面。",
    "sources": [
      [
        "ASSA · 锁具技术资料",
        "https://s3.amazonaws.com/s3-absupply-net/pdf/assaabloy/assa-2016-product-catalog-and-technical-manual.pdf"
      ]
    ],
    "parts": [
      {
        "name": "钥匙",
        "x": 24,
        "y": 53,
        "short": "不同牙高顶起对应弹子。",
        "detail": "钥匙轮廓必须与锁内弹子组合匹配，外形能插入并不一定能转动。"
      },
      {
        "name": "下弹子",
        "x": 49,
        "y": 44,
        "short": "与钥匙接触并随牙高移动。",
        "detail": "下弹子的高度和钥匙牙形共同决定上下弹子交界位置。"
      },
      {
        "name": "上弹子与弹簧",
        "x": 58,
        "y": 28,
        "short": "使弹子保持向钥匙方向的压力。",
        "detail": "不匹配时弹子会跨过锁芯与外壳分界，阻止正常转动。"
      },
      {
        "name": "锁芯",
        "x": 60,
        "y": 64,
        "short": "匹配后可在外壳中转动。",
        "detail": "图中各弹子交界与锁芯上沿的剪切面对应；复杂锁具可能还有其他机构。"
      }
    ],
    "thumbnail": "science/structures/lock-thumb.webp"
  },
  "submarine": {
    "id": "submarine",
    "name": "潜艇",
    "file": "science/structures/submarine.webp",
    "alt": "潜艇的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "研究潜艇概念剖面；重点展示耐压舱与外侧压载舱，动力和其他系统省略。",
    "review": "核对压载水位于人员耐压舱之外；下潜调整整体质量和浮力平衡，不是给人员舱灌水。",
    "sources": [
      [
        "OpenStax · 浮力",
        "https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy"
      ]
    ],
    "parts": [
      {
        "name": "压载舱",
        "x": 17,
        "y": 56,
        "short": "进排水改变整体平均密度。",
        "detail": "压载舱容纳水或空气，改变其中的水量可以调整艇的浮沉状态。"
      },
      {
        "name": "耐压舱",
        "x": 45,
        "y": 57,
        "short": "提供干燥的人员与设备空间。",
        "detail": "耐压结构承受外部水压；图中蓝色水没有进入人员生活空间。"
      },
      {
        "name": "外部艇壳",
        "x": 47,
        "y": 68,
        "short": "形成流线外形。",
        "detail": "外形减少运动阻力，外壳与内部耐压结构不必重合。"
      },
      {
        "name": "螺旋桨",
        "x": 96,
        "y": 56,
        "short": "推动水，获得前进推力。",
        "detail": "推进与浮力调节是不同功能，不能只靠向下吹水解释静态下潜。"
      }
    ],
    "thumbnail": "science/structures/submarine-thumb.webp"
  },
  "spacesuit": {
    "id": "spacesuit",
    "name": "舱外航天服",
    "file": "science/structures/spacesuit.webp",
    "alt": "舱外航天服的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "典型舱外服系统拆解示意；层数和管路经过简化，不对应某一代服装的制造图。",
    "review": "核对压力服、隔热防护层、液冷服和背包的不同职责；不是仅靠一层厚布抵御太空环境。",
    "sources": [
      [
        "NASA · 舱外服结构",
        "https://www.nasa.gov/centers-and-facilities/johnson/spacewalk-spacesuit-basics/"
      ]
    ],
    "parts": [
      {
        "name": "头盔与面罩",
        "x": 49,
        "y": 11,
        "short": "维持头部环境并保护视线。",
        "detail": "面罩兼顾观察与防护，压力环境由整套密封系统共同维持。"
      },
      {
        "name": "多层压力与防护服",
        "x": 23,
        "y": 30,
        "short": "分别承担密封、约束与隔热。",
        "detail": "不同层作用不同，图中展开距离是为了辨认，并非穿着时存在这么大的空隙。"
      },
      {
        "name": "液冷服管路",
        "x": 44,
        "y": 34,
        "short": "循环水带走身体多余热量。",
        "detail": "冷却是热管理的一部分，图中蓝管为便于观察而放大。"
      },
      {
        "name": "生命保障背包",
        "x": 75,
        "y": 25,
        "short": "支持供氧、循环和温度调节。",
        "detail": "背包还承担去除呼出二氧化碳等任务，不是一个单纯的氧气瓶。"
      }
    ],
    "thumbnail": "science/structures/spacesuit-thumb.webp"
  },
  "reentry": {
    "id": "reentry",
    "name": "返回舱",
    "file": "science/structures/reentry.webp",
    "alt": "返回舱的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "钝头返回舱的概念剖面；座椅、降落伞布置及防热层厚度均作教学简化。",
    "review": "核对外侧防热结构与内部乘员舱的隔离；再入加热来自高速气流的能量转换，不能只理解为表面擦出火花。",
    "sources": [
      [
        "NASA · 再入热防护",
        "https://www.nasa.gov/ames/entry-systems-and-technology-division/thermophysics-facilities-faq/"
      ]
    ],
    "parts": [
      {
        "name": "底部防热层",
        "x": 50,
        "y": 83,
        "short": "隔热，并可通过烧蚀带走能量。",
        "detail": "部分返回舱使用烧蚀材料，其表面在再入时发生受控变化来保护内部。"
      },
      {
        "name": "乘员舱",
        "x": 49,
        "y": 46,
        "short": "提供受保护的内部空间。",
        "detail": "外部高温不意味着乘员直接处在同样的温度中，热防护和舱体共同隔离。"
      },
      {
        "name": "降落伞舱",
        "x": 50,
        "y": 13,
        "short": "在合适阶段部署减速装置。",
        "detail": "降落伞用于较后阶段；不能在最高速、最热的阶段直接承担全部减速。"
      },
      {
        "name": "侧壁防护",
        "x": 78,
        "y": 54,
        "short": "保护迎流程度不同的舱体区域。",
        "detail": "不同部位热流条件不同，防护结构并非全舱等厚。"
      }
    ],
    "thumbnail": "science/structures/reentry-thumb.webp"
  },
  "touchscreen": {
    "id": "touchscreen",
    "name": "电容触摸屏",
    "file": "science/structures/touchscreen.webp",
    "alt": "电容触摸屏的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "投射电容触控层的拆解概念图；电极线加粗可见，实际通常透明且存在多种排布。",
    "review": "核对盖板、互相绝缘的两组电极与显示层；触控检测和发光显示不是同一过程。",
    "sources": [
      [
        "Microchip · 电容触控技术",
        "https://ww1.microchip.com/downloads/en/DeviceDoc/Article_AC9_Capacitive-Touch-Technology.pdf"
      ]
    ],
    "parts": [
      {
        "name": "盖板玻璃",
        "x": 48,
        "y": 18,
        "short": "保护内部结构并接受触摸。",
        "detail": "手指不需要直接接触金属电极，电场可以受到盖板上方手指影响。"
      },
      {
        "name": "一组触控电极",
        "x": 49,
        "y": 38,
        "short": "与另一组形成检测网络。",
        "detail": "控制电路依次测量电容相关信号，图中的线宽和颜色仅为示意。"
      },
      {
        "name": "另一组触控电极",
        "x": 49,
        "y": 57,
        "short": "与前一组绝缘交错。",
        "detail": "两组电极并非在交叉处直接短接；透明绝缘层隔开它们。"
      },
      {
        "name": "显示层",
        "x": 48,
        "y": 76,
        "short": "形成我们看到的图像。",
        "detail": "显示层负责画面，触控电路负责位置检测；两者配合才形成操作反馈。"
      }
    ],
    "thumbnail": "science/structures/touchscreen-thumb.webp"
  },
  "solar-cell": {
    "id": "solar-cell",
    "name": "光伏组件",
    "file": "science/structures/solar-cell.webp",
    "alt": "光伏组件的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "晶硅光伏组件层叠示意；展示组件封装，不是半导体结的微观剖面。",
    "review": "核对玻璃—封装—电池片—背板的层次；电池片把光能转为电能，不在这里储存电量。",
    "sources": [
      [
        "美国能源部 · 光伏原理",
        "https://www.energy.gov/cmei/systems/how-does-solar-work"
      ]
    ],
    "parts": [
      {
        "name": "保护玻璃",
        "x": 46,
        "y": 21,
        "short": "透光并保护下面的电池片。",
        "detail": "玻璃本身不是主要发电材料，透光性能和表面状态会影响光照进入。"
      },
      {
        "name": "封装层",
        "x": 37,
        "y": 39,
        "short": "固定电池片并提供环境保护。",
        "detail": "实际层叠紧密贴合，图中分开是为了看清每一层。"
      },
      {
        "name": "硅电池片",
        "x": 28,
        "y": 49,
        "short": "吸收光并产生电输出。",
        "detail": "光激发电荷载流子，内部电场帮助分离电荷，金属电极收集电流。"
      },
      {
        "name": "背板与边框",
        "x": 71,
        "y": 76,
        "short": "支撑、绝缘并保护组件。",
        "detail": "不同组件可能使用双玻璃等结构，图中是带背板和金属边框的一种形式。"
      }
    ],
    "thumbnail": "science/structures/solar-cell-thumb.webp"
  },
  "microwave": {
    "id": "microwave",
    "name": "微波炉",
    "file": "science/structures/microwave.webp",
    "alt": "微波炉的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "传统磁控管式微波炉部件剖面；炉门保持关闭，电路仅用于结构认识。",
    "review": "核对磁控管、波导、金属炉腔及门窗网孔；微波为非电离电磁波，加热不使食物变成放射性物质。",
    "sources": [
      [
        "FDA · 微波炉",
        "https://www.fda.gov/radiation-emitting-products/resources-you-radiation-emitting-products/microwave-ovens"
      ]
    ],
    "parts": [
      {
        "name": "磁控管",
        "x": 82,
        "y": 30,
        "short": "产生加热所用的微波。",
        "detail": "电源驱动磁控管，微波通过波导进入炉腔；它不是直接吹热风的风扇。"
      },
      {
        "name": "波导",
        "x": 66,
        "y": 25,
        "short": "把微波引入金属炉腔。",
        "detail": "短金属通道连接微波源和炉腔，实际结构随机型变化。"
      },
      {
        "name": "炉腔与转盘",
        "x": 53,
        "y": 59,
        "short": "容纳食物，改善受热分布。",
        "detail": "转盘转动让食物经过不同场强区域，但不保证每一点瞬间同温。"
      },
      {
        "name": "门窗屏蔽网",
        "x": 24,
        "y": 43,
        "short": "允许观察并帮助限制微波外泄。",
        "detail": "金属网孔与门体屏蔽设计共同工作，不能把普通透明玻璃当作全部屏蔽。"
      }
    ],
    "thumbnail": "science/structures/microwave-thumb.webp"
  },
  "induction": {
    "id": "induction",
    "name": "电磁炉",
    "file": "science/structures/induction.webp",
    "alt": "电磁炉的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "平面线圈式电磁炉的层次拆解；锅与面板在实际使用时贴合。",
    "review": "核对锅底、面板、线圈和磁性材料的位置；主要热量在适配锅具中产生。",
    "sources": [
      [
        "美国能源部 · 电磁炉",
        "https://www.energy.gov/articles/making-switch-induction-stoves-or-cooktops"
      ]
    ],
    "parts": [
      {
        "name": "适配锅底",
        "x": 46,
        "y": 18,
        "short": "在交变磁场作用下发热。",
        "detail": "常见电磁炉需要合适的导磁锅底，不能仅凭锅是金属就认定可用。"
      },
      {
        "name": "玻璃陶瓷面板",
        "x": 48,
        "y": 32,
        "short": "支撑锅具并隔离内部。",
        "detail": "面板也会被热锅传热而变烫，不应理解为工作后始终冰凉。"
      },
      {
        "name": "感应线圈",
        "x": 46,
        "y": 45,
        "short": "通交变电流产生变化磁场。",
        "detail": "线圈与锅不直接电接触，能量通过电磁作用传入锅底。"
      },
      {
        "name": "磁性条与控制电路",
        "x": 47,
        "y": 59,
        "short": "引导磁场并控制供电。",
        "detail": "下方磁性材料帮助组织磁场，电路控制频率和功率，图中布线已省略。"
      }
    ],
    "thumbnail": "science/structures/induction-thumb.webp"
  },
  "elevator": {
    "id": "elevator",
    "name": "曳引电梯",
    "file": "science/structures/elevator.webp",
    "alt": "曳引电梯的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "1:1曳引系统的简化井道剖面；安全钳、限速器、门系统等未全部展示。",
    "review": "核对轿厢—曳引轮—对重的悬挂关系；图中单根绳代表绳组，不表示真实只使用一根绳。",
    "sources": [
      [
        "Otis · 电梯基本结构",
        "https://www.otis.com/en/uk/w/the-basic-workings-of-a-lift"
      ]
    ],
    "parts": [
      {
        "name": "曳引机与曳引轮",
        "x": 54,
        "y": 8,
        "short": "通过绳轮接触驱动升降。",
        "detail": "电机带动曳引轮，悬挂绳与轮之间的摩擦传递运动。"
      },
      {
        "name": "轿厢",
        "x": 44,
        "y": 49,
        "short": "承载乘客并沿导轨移动。",
        "detail": "导轨限制横向摆动，轿厢不是只靠一根绳自由悬荡。"
      },
      {
        "name": "对重",
        "x": 57,
        "y": 65,
        "short": "平衡一部分轿厢与载荷。",
        "detail": "对重与轿厢通常反向运动，减少驱动所需的能量和力矩。"
      },
      {
        "name": "底坑缓冲器",
        "x": 44,
        "y": 88,
        "short": "作为异常行程的最后缓冲。",
        "detail": "日常停层依赖控制和制动，缓冲器不是每次到站都要压缩的装置。"
      }
    ],
    "thumbnail": "science/structures/elevator-thumb.webp"
  },
  "battery": {
    "id": "battery",
    "name": "锂离子软包电芯",
    "file": "science/structures/battery.webp",
    "alt": "锂离子软包电芯的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "石墨负极锂离子软包电芯的层叠拆解；间隙和颗粒放大，不代表单层就是完整电池。 电解液浸润电极与隔膜孔隙；分解图中的空隙不代表工作时存在空气夹层。",
    "review": "核对电极、隔膜及集流体；隔膜让离子通过并阻隔直接电子通路，电子经外电路流动。",
    "sources": [
      [
        "美国能源部 · 电池",
        "https://www.energy.gov/science/doe-explainsbatteries"
      ]
    ],
    "parts": [
      {
        "name": "石墨负极与铜集流体",
        "x": 40,
        "y": 36,
        "short": "参与储存锂离子并收集电流。",
        "detail": "充电和放电时电极反应方向改变，不能把电池理解为装着电子的空水箱。"
      },
      {
        "name": "隔膜",
        "x": 44,
        "y": 53,
        "short": "隔开两极，允许离子迁移。",
        "detail": "多孔隔膜浸润电解液；它不是电子从一极直接走到另一极的导线。"
      },
      {
        "name": "正极与铝集流体",
        "x": 46,
        "y": 67,
        "short": "与负极配合完成电化学变化。",
        "detail": "正极材料类型有多种，图中深色颗粒只是形态示意。"
      },
      {
        "name": "软包外壳",
        "x": 52,
        "y": 18,
        "short": "密封内部材料。",
        "detail": "电解液浸润内部多孔结构，图中没有画成一池自由流动的水。"
      }
    ],
    "thumbnail": "science/structures/battery-thumb.webp"
  },
  "digestion": {
    "id": "digestion",
    "name": "消化系统",
    "file": "science/structures/digestion.webp",
    "alt": "消化系统的写实教学剖面或拆解图，标注结构可逐项查看",
    "scope": "人体腹部消化器官正面概念图；观察者左边对应身体右侧，组织位置有个体差异。",
    "review": "核对食管接胃、胃接小肠以及大肠环绕的位置；食物不需要进入肝脏内部才继续消化。",
    "sources": [
      [
        "NIDDK · 消化系统",
        "https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works"
      ]
    ],
    "parts": [
      {
        "name": "胃",
        "x": 59,
        "y": 23,
        "short": "暂存并混合食物与消化液。",
        "detail": "胃的肌肉活动与酸、酶共同参与消化，随后把内容物逐步送入小肠。"
      },
      {
        "name": "小肠",
        "x": 49,
        "y": 58,
        "short": "完成大量消化和营养吸收。",
        "detail": "小肠壁把分解后的营养物质送入血液或淋巴，不是完整食物直接穿过肠壁。"
      },
      {
        "name": "大肠",
        "x": 66,
        "y": 54,
        "short": "吸收水分并形成粪便。",
        "detail": "大肠围在小肠外侧，图中从身体右侧上行再横过腹部，随后下行。"
      },
      {
        "name": "肝脏",
        "x": 39,
        "y": 18,
        "short": "产生胆汁并参与营养处理。",
        "detail": "胆汁经胆道进入消化道；肝脏不属于食物直接穿行的管腔。"
      }
    ],
    "thumbnail": "science/structures/digestion-thumb.webp"
  },
  "zipper": {
    "id": "zipper",
    "name": "拉链",
    "file": "science/structures/zipper-v3.webp",
    "alt": "拉链的写实教学结构图，标注可逐项查看",
    "scope": "金属链齿式拉链的结构近景；滑块内部用原理互动说明，写实图保留完整盖板。",
    "review": "弃用两版通道形状不可信的剖图，改用外观结构辨认；核对两排链齿进入滑块、单排啮合链从下端离开。",
    "sources": [
      [
        "YKK · 拉链结构",
        "https://www.ykk.com.hk/html/en/products_zipper1.htm"
      ]
    ],
    "parts": [
      {
        "name": "滑块",
        "x": 48,
        "y": 41,
        "short": "引导两排链齿靠拢或分开。",
        "detail": "内部通道约束链齿运动；具体通道形状请看原理示意，不从盖板外观推断。"
      },
      {
        "name": "链齿",
        "x": 59,
        "y": 16,
        "short": "相邻齿彼此扣合。",
        "detail": "滑块通过时改变两排链齿的相对位置，扣合后形成连接。"
      },
      {
        "name": "布带",
        "x": 36,
        "y": 55,
        "short": "把链齿固定在衣物边缘。",
        "detail": "布带将拉链连接到服装或包袋，承受的拉力由多颗链齿共同传递。"
      },
      {
        "name": "拉片",
        "x": 72,
        "y": 60,
        "short": "便于手指带动滑块。",
        "detail": "拉片不是把链齿直接钩住的零件，它通过连接点移动整个滑块。"
      }
    ],
    "thumbnail": "science/structures/zipper-v3-thumb.webp"
  },
  "umbrella": {
    "id": "umbrella",
    "name": "手动雨伞",
    "file": "science/structures/umbrella-v2.webp",
    "alt": "手动雨伞的写实教学结构图，标注可逐项查看",
    "scope": "直杆手动伞的半去布结构图；省略部分背侧杆件，保留主要连杆关系。",
    "review": "去掉了初稿多余的伞尖连线，核对滑套、撑杆和长伞骨的连接；不是齿轮驱动。",
    "sources": [
      [
        "雨伞结构专利",
        "https://patents.google.com/patent/US743476"
      ]
    ],
    "parts": [
      {
        "name": "伞面",
        "x": 30,
        "y": 29,
        "short": "挡雨并由伞骨撑成曲面。",
        "detail": "防水来自织物及表面处理；去掉一半伞面是为了显示骨架。"
      },
      {
        "name": "长伞骨",
        "x": 82,
        "y": 23,
        "short": "从伞顶向边缘展开。",
        "detail": "长伞骨与伞面相连，径向支撑雨伞外形。"
      },
      {
        "name": "撑杆",
        "x": 60,
        "y": 18,
        "short": "把滑套运动传给伞骨。",
        "detail": "较短撑杆的两端可转动，滑套上移时推动伞骨张开。"
      },
      {
        "name": "滑套",
        "x": 50,
        "y": 30,
        "short": "沿中央伞杆移动。",
        "detail": "滑套控制开合位置，锁止件使打开的伞保持稳定。"
      }
    ],
    "thumbnail": "science/structures/umbrella-v2-thumb.webp"
  },
  "watch": {
    "id": "watch",
    "name": "机械表机芯",
    "file": "science/structures/watch-v2.webp",
    "alt": "机械表机芯的写实教学结构图，标注可逐项查看",
    "scope": "手动机械表的功能部件陈列；零件已分离，不按图中直线位置实际装配。 零件被分开排列；大齿轮并非如图排队直接相接，传动通过各轮轴上的齿轴配合。",
    "review": "移除初稿把多个齿轮串在同一长轴上的错误结构；核对发条、轮系、擒纵和摆轮游丝的职责。",
    "sources": [
      [
        "SEIKO · 机械表原理",
        "https://support.seiko.in/portal/en/kb/articles/mechanical-watches-automatic-and-winding"
      ]
    ],
    "parts": [
      {
        "name": "发条盒",
        "x": 13,
        "y": 43,
        "short": "储存上弦输入的机械能。",
        "detail": "发条逐渐释放弹性势能驱动轮系，机械表不依赖电池为这套机构供能。"
      },
      {
        "name": "传动轮系",
        "x": 41,
        "y": 53,
        "short": "把转动传到后续机构。",
        "detail": "实际机芯中大轮与相邻小齿轴啮合，图中分开展示不表示共用一根轴。"
      },
      {
        "name": "擒纵机构",
        "x": 74,
        "y": 65,
        "short": "有节奏地释放轮系运动。",
        "detail": "擒纵轮和叉与振荡系统配合，同时给摆轮补充少量能量。"
      },
      {
        "name": "摆轮与游丝",
        "x": 90,
        "y": 62,
        "short": "往复摆动，提供节拍。",
        "detail": "游丝产生回复力矩，摆轮来回摆动；它不同于持续单向转动的普通齿轮。"
      }
    ],
    "thumbnail": "science/structures/watch-v2-thumb.webp"
  },
  "lighter": {
    "id": "lighter",
    "name": "火石轮式丁烷打火机",
    "file": "science/structures/lighter-v2.webp",
    "alt": "火石轮式丁烷打火机的写实教学结构图，标注可逐项查看",
    "scope": "火石轮点火、丁烷供气型的概念剖面；供气细路和比例简化，不作为拆装图。",
    "review": "重画了朝上的喷口，核对火石与弹簧、气阀和储气空间；没有混入压电点火器或液体燃料灯芯。",
    "sources": [
      [
        "BIC · 打火机结构",
        "https://www.bicgraphic.com/ie/bic-lighters-techniques-and-safety.html"
      ]
    ],
    "parts": [
      {
        "name": "火石轮",
        "x": 42,
        "y": 11,
        "short": "摩擦火石产生炽热颗粒。",
        "detail": "轮的齿面与火石接触，转动时形成用于引燃的火花。"
      },
      {
        "name": "火石与弹簧",
        "x": 42,
        "y": 36,
        "short": "让火石持续接触轮面。",
        "detail": "弹簧补偿火石磨损，图中干燥通道与燃料储存空间分开。"
      },
      {
        "name": "气阀与喷口",
        "x": 54,
        "y": 19,
        "short": "控制燃料向上释放。",
        "detail": "按压控制件打开供气路径，松开后关闭；燃烧还需要空气中的氧。"
      },
      {
        "name": "燃料储存空间",
        "x": 52,
        "y": 73,
        "short": "存放液化丁烷及其蒸气。",
        "detail": "部分燃料在压力下保持液态，释放后气化；透明壳体是观察性表达。"
      }
    ],
    "thumbnail": "science/structures/lighter-v2-thumb.webp"
  },
  "high-speed-rail": {
    "id": "high-speed-rail",
    "name": "电力列车转向架",
    "file": "science/structures/high-speed-rail-v2.webp",
    "alt": "电力列车转向架的写实教学结构图，标注可逐项查看",
    "scope": "转向架功能模块拆解；省略齿轮箱、制动及部分悬挂件，不对应具体高铁车型。 图中省略了电机至车轴的齿轮传动等连接件，不能作为完整动力线路。",
    "review": "重绘了轮轴关系，移除初稿轨道与轴线方向冲突；每个轮对由同轴两轮组成，各模块分开陈列。",
    "sources": [
      [
        "Alstom · 列车部件",
        "https://www.alstom.com/solutions/components"
      ]
    ],
    "parts": [
      {
        "name": "构架",
        "x": 40,
        "y": 25,
        "short": "支撑并连接主要部件。",
        "detail": "构架把轮对、悬挂等组织在一起，承接车体传来的载荷。"
      },
      {
        "name": "轮对",
        "x": 48,
        "y": 56,
        "short": "两只车轮与一根车轴构成整体。",
        "detail": "轮轨接触传递牵引与制动力，实际轮缘和踏面有专门的几何设计。"
      },
      {
        "name": "牵引电机",
        "x": 16,
        "y": 67,
        "short": "把电能转换为机械转动。",
        "detail": "电机经传动系统驱动车轮，图中并未把电机直接当成整根车轴。"
      },
      {
        "name": "弹簧与减振器",
        "x": 86,
        "y": 27,
        "short": "缓冲并抑制振动。",
        "detail": "弹簧储存弹性能，减振器耗散振动能量，二者作用不同。"
      }
    ],
    "thumbnail": "science/structures/high-speed-rail-v2-thumb.webp"
  },
  "rice-cooker": {
    "id": "rice-cooker",
    "name": "传统电饭锅",
    "file": "science/structures/rice-cooker-v2.webp",
    "alt": "传统电饭锅的写实教学结构图，标注可逐项查看",
    "scope": "电热盘加热、机械温控型电饭锅剖面；现代电饭锅可能采用传感器和电子控制。",
    "review": "修正内锅与热盘之间的悬空间隙，核对感温件接触锅底；温控判断温度变化，不会直接识别米饭口感。",
    "sources": [
      [
        "电饭锅温控专利",
        "https://patents.justia.com/patent/5111026"
      ]
    ],
    "parts": [
      {
        "name": "内锅",
        "x": 48,
        "y": 42,
        "short": "容纳米水并接收热量。",
        "detail": "内锅底部与加热盘贴合有助于传热，图中剖开是为看清接触面。"
      },
      {
        "name": "电热盘",
        "x": 38,
        "y": 64,
        "short": "把电能转为热量。",
        "detail": "热量通过锅底传入米水；此处不是电磁炉式线圈。"
      },
      {
        "name": "锅底感温组件",
        "x": 50,
        "y": 63,
        "short": "感受锅底温度变化。",
        "detail": "水分减少后温度更易升高，传统温控机构据此改变加热状态。"
      },
      {
        "name": "控制连杆",
        "x": 78,
        "y": 72,
        "short": "联动加热开关。",
        "detail": "机械型通过温控与开关配合切换工作状态，不代表所有电饭锅都使用同一机构。"
      }
    ],
    "thumbnail": "science/structures/rice-cooker-v2-thumb.webp"
  },
  "airplane": {
    "id": "airplane",
    "name": "喷气客机",
    "file": "science/structures/airplane-v2.webp",
    "alt": "喷气客机的写实教学结构图，标注可逐项查看",
    "scope": "喷气客机主要系统的剖切示意；发动机细部与机翼内部尺寸不按制造比例。",
    "review": "去掉机翼内不合理的独立方盒，保留翼梁和翼肋；核对机翼主要提供升力、发动机主要提供推力。",
    "sources": [
      [
        "NASA · 升力与动量",
        "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/bernoulli-and-newton/"
      ]
    ],
    "parts": [
      {
        "name": "驾驶舱",
        "x": 12,
        "y": 43,
        "short": "飞行员监控并操纵飞机。",
        "detail": "操纵指令通过控制系统作用于舵面和发动机等，图中没有展示完整线路。"
      },
      {
        "name": "机翼结构",
        "x": 70,
        "y": 62,
        "short": "保持翼形并传递气动力载荷。",
        "detail": "翼梁和翼肋支撑机翼；运动中的机翼改变周围气流并受到升力。"
      },
      {
        "name": "涡扇发动机",
        "x": 47,
        "y": 74,
        "short": "使空气获得向后的动量。",
        "detail": "气流动量变化对应飞机受到的推力；推力帮助飞机保持产生升力所需的运动。"
      },
      {
        "name": "尾翼",
        "x": 87,
        "y": 26,
        "short": "帮助稳定姿态并控制方向。",
        "detail": "垂直尾翼和水平尾翼承担不同操纵与稳定作用，不是装饰性尾巴。"
      }
    ],
    "thumbnail": "science/structures/airplane-v2-thumb.webp"
  },
  "brakes": {
    "id": "brakes",
    "name": "盘式制动器",
    "file": "science/structures/brakes-v2.webp",
    "alt": "盘式制动器的写实教学结构图，标注可逐项查看",
    "scope": "单活塞浮动钳式制动器的拆解概念图；一块摩擦片翻面展示，实际两片工作面朝向制动盘。",
    "review": "删除初稿多出的一块制动片，核对盘两侧各一片及液压活塞位置；制动液不喷到摩擦面。",
    "sources": [
      [
        "Brembo · 固定与浮动制动钳",
        "https://asia.bremboparts.com/america/en/support/car/insights/brake-caliper-technology-and-operation-324333"
      ]
    ],
    "parts": [
      {
        "name": "制动盘",
        "x": 42,
        "y": 48,
        "short": "随车轮旋转并承受摩擦。",
        "detail": "车辆动能在制动时主要转化为热，盘内通风结构有助于散热。"
      },
      {
        "name": "两侧制动片",
        "x": 60,
        "y": 48,
        "short": "夹紧盘面产生摩擦力。",
        "detail": "两片分居盘两侧，图左一片翻面用于看清材料，装配时摩擦面相向。"
      },
      {
        "name": "液压活塞",
        "x": 77,
        "y": 47,
        "short": "将液体压力转为推力。",
        "detail": "压力推动活塞，使制动片压向盘面，摩擦所需夹紧力由制动钳承受。"
      },
      {
        "name": "制动钳",
        "x": 85,
        "y": 72,
        "short": "承载并引导夹紧组件。",
        "detail": "浮动钳通过自身移动使另一侧制动片也压向盘面。"
      }
    ],
    "thumbnail": "science/structures/brakes-v2-thumb.webp"
  },
  "circulation": {
    "id": "circulation",
    "name": "心脏的四个腔",
    "file": "science/structures/circulation-v2.webp",
    "alt": "心脏的四个腔的写实教学结构图，标注可逐项查看",
    "scope": "四腔心结构剖面；大血管与流出道省略，完整循环在原理互动中查看。红蓝表示含氧差异，血液本身不是蓝色。",
    "review": "弃用初稿错误的大血管连接，重绘为四腔结构；核对左右隔开、房室瓣位置及左心室壁较厚。",
    "sources": [
      [
        "OpenStax · 心脏解剖",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy"
      ]
    ],
    "parts": [
      {
        "name": "右心房",
        "x": 37,
        "y": 21,
        "short": "接收体循环回来的血液。",
        "detail": "图中身体右侧在观察者左侧，右心房通过房室瓣把血送到右心室。"
      },
      {
        "name": "右心室",
        "x": 40,
        "y": 61,
        "short": "把血送往肺循环。",
        "detail": "流出道在本图省略；正常情况下不会直接穿过室间隔进入左心室。"
      },
      {
        "name": "左心房",
        "x": 62,
        "y": 22,
        "short": "接收肺循环回来的血液。",
        "detail": "肺部完成气体交换的血液返回左心房，再进入左心室。"
      },
      {
        "name": "左心室",
        "x": 63,
        "y": 66,
        "short": "向全身循环泵血。",
        "detail": "左心室壁较厚，产生推动体循环所需的压力；瓣膜帮助限制逆流。"
      }
    ],
    "thumbnail": "science/structures/circulation-v2-thumb.webp"
  },
  "toilet": {
    "id": "toilet",
    "name": "虹吸式坐便器",
    "file": "science/structures/toilet-v2.webp",
    "alt": "虹吸式坐便器的写实教学结构图，标注可逐项查看",
    "scope": "重力水箱、虹吸式坐便器剖面，蓝色表示冲洗中已充水的通道；不是静止水位图。 图示冲洗过程中的充水状态；静止时不会让整个下降排污管一直充满水。",
    "review": "去除满管内错误的自由液面线，核对水箱通向盆沿和连续弯管；静止水封与冲洗满管属于不同状态。",
    "sources": [
      [
        "Kohler · 冲水原理",
        "https://assist.kohler.com/en/toilets-and-seats/How-a-Toilet-Flushes"
      ]
    ],
    "parts": [
      {
        "name": "水箱与排水阀",
        "x": 74,
        "y": 26,
        "short": "储水并在冲洗时快速放水。",
        "detail": "排水阀开启后，水经独立冲洗通道进入便器。"
      },
      {
        "name": "盆沿冲洗水道",
        "x": 33,
        "y": 45,
        "short": "把水分配到便器内壁。",
        "detail": "冲洗水清洗内壁并补充盆内水量，实际产品还可能有喷射孔等结构。"
      },
      {
        "name": "存水弯通道",
        "x": 55,
        "y": 74,
        "short": "保留水封，并参与虹吸排放。",
        "detail": "图中是通道已充水的冲洗阶段。停止后只留下部分存水，阻隔下水道气体。"
      },
      {
        "name": "排污出口",
        "x": 72,
        "y": 90,
        "short": "连接下游排水管。",
        "detail": "弯管中的流动把内容物带向出口；不同类型坐便器不一定以相同方式形成虹吸。"
      }
    ],
    "thumbnail": "science/structures/toilet-v2-thumb.webp"
  }
};

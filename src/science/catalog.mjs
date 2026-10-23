// Lightweight directory shared by the browser and community service. No scenes here.
export const categories = [
  ["weather", "天空与天气", "从抬头看到的现象开始"],
  ["earth", "江海与大地", "理解脚下的世界"],
  ["plants", "花草树木", "让散步变成自然观察"],
  ["animals", "动物与生态", "观察生命的不同办法"],
  ["body", "身体与感觉", "认识自己的身体"],
  ["kitchen", "厨房与食物", "从一顿饭理解科学"],
  ["objects", "日用物件与机械", "拆开熟悉的小东西"],
  ["home", "家电与居家", "理解身边的设备"],
  ["transport", "交通与建筑", "理解城市中的大机器"],
  ["space", "宇宙与航天", "从地面走向太空"],
  ["signals", "光声与数字生活", "理解每天接触的信息世界"],
  ["materials", "材料、能源与环境", "理解物质如何被利用"],
].map(([id, name, description]) => ({ id, name, description }));
export const templates = {
  cutaway: "标注剖面",
  assembly: "分解装配",
  process: "过程演示",
  compare: "变量对照",
  identify: "实物辨识",
  scale: "尺度与层级",
  path: "路径追踪",
};
const rows = `sky-blue|天空为什么是蓝色的？|compare|散射 阳光 大气
sunset|日出和日落为什么偏红？|compare|太阳 光程 傍晚
rainbow|彩虹为什么是弯的？|path|折射 水滴 反射
clouds|白云为什么白，乌云为什么暗？|compare|云层 光照
raindrops|雨滴真的是水滴形的吗？|compare|表面张力 空气
fog-dew-frost|雾、露和霜有什么区别？|identify|水汽 凝结 凝华
snowflakes|雪花为什么常有六个角？|scale|冰晶 六角
thunder|为什么先看到闪电，再听到雷声？|compare|传播 光速 声速
wind|风是从哪里来的？|path|气压 海陆风
mountain-cold|为什么山越高，通常越冷？|process|气团 对流层
sea-blue|海水为什么是蓝色的？|compare|海洋 水色 吸收 反射
salty-sea|海水为什么咸，河水却不太咸？|path|盐 水循环
tides|海边为什么会涨潮退潮？|process|引力 月球 潮汐
waves|海浪向前走，海水也一直向前走吗？|process|波浪 漂浮
meanders|河流为什么会弯弯曲曲？|compare|侵蚀 沉积
pebbles|沙滩和鹅卵石是怎样形成的？|process|风化 搬运
groundwater|地下水藏在地下的大洞里吗？|cutaway|含水层 孔隙
caves|溶洞和钟乳石是怎样长出来的？|process|石灰岩 沉积
volcano|火山内部是什么样的？|cutaway|岩浆 喷发
earthquakes|地震为什么会让地面摇晃？|process|断层 地震波
spring-flowers|桃花、樱花、梨花怎么区分？|identify|春天的花 花梗 花序
roses|月季、玫瑰、蔷薇有什么区别？|identify|花叶 枝刺
yellow-flowers|迎春和连翘为什么容易认错？|identify|黄花 花瓣
conifers|松树、杉树、柏树怎么辨认？|identify|针叶 球果
autumn-leaves|秋天的叶子为什么会变色？|compare|叶绿素 色素
lotus-leaf|荷叶为什么不容易被水打湿？|scale|润湿 微结构
seed-travel|植物的种子怎样去远方？|identify|风 动物 传播
germination|一粒种子怎样变成幼苗？|process|胚 萌发
flower-fruit|一朵花怎样变成果实？|cutaway|传粉 受精 子房
cactus|仙人掌为什么能耐旱？|cutaway|储水 蒸腾
moths|蝴蝶和飞蛾怎么区分？|identify|触角 鳞翅目
honeycomb|蜂巢为什么有许多六边形？|compare|铺排 蜂蜡
bat-echo|蝙蝠怎样在黑暗中找路？|path|回声 定位 超声
cat-eyes|猫为什么在暗处也能看得较清楚？|cutaway|瞳孔 反光层
bird-flight|鸟为什么能够飞起来？|process|翼 气流 扑翼
fish-gills|鱼在水里怎么呼吸？|path|鳃 氧气
whales|鲸和海豚为什么不是鱼？|identify|哺乳动物 肺
penguins|企鹅怎样在寒冷环境中保温？|cutaway|羽毛 脂肪
ants|蚂蚁怎样找到回家的路？|path|信息素 导航
gecko|壁虎为什么能爬墙？|scale|刚毛 接触
eye|眼睛怎样把世界看清楚？|cutaway|角膜 晶状体 视网膜
ear|声音怎样从耳朵传到大脑？|path|鼓膜 耳蜗
flavour|鼻子堵住时，为什么吃东西不香？|compare|味觉 嗅觉
sweat|出汗为什么能帮助散热？|compare|蒸发 湿度
hiccups|人为什么会打嗝？|process|膈肌 呃逆
muscles|肌肉怎样拉动骨头？|assembly|肌腱 关节
lungs|肺为什么能够吸进和呼出空气？|cutaway|呼吸 压力
circulation|血液怎样在身体里循环？|path|心脏 瓣膜
digestion|吃下去的食物去了哪里？|path|消化 吸收
healing|小伤口为什么能够慢慢愈合？|process|止血 皮肤
popcorn|玉米粒为什么会变成爆米花？|cutaway|淀粉 压力
bread|面包和馒头为什么会变蓬松？|process|酵母 发酵
egg|鸡蛋加热后为什么会凝固？|scale|蛋白质 变性
apple|切开的苹果为什么会变褐？|compare|酶 氧气
milk-foam|牛奶为什么能打出细腻泡沫？|scale|蛋白质 气泡
detergent|洗洁精为什么能洗掉油？|scale|表面活性剂 油水
pressure-cooker|高压锅为什么能更快煮熟食物？|cutaway|沸点 蒸汽
floating-ice|冰为什么浮在水上？|scale|密度 氢键
soda|汽水打开后为什么不停冒泡？|compare|二氧化碳 压力
straw|用吸管喝水时，水怎样升上来？|path|气压 压力差
tape-measure|卷尺为什么能自动收回？|cutaway|卷簧 锁止
zipper|拉链怎样把两排齿合起来？|assembly|滑块 链齿
ballpoint|圆珠笔的小圆珠怎样写出字？|cutaway|油墨 球珠
scissors|剪刀怎样把东西剪断？|compare|杠杆 剪切
umbrella|雨伞怎样撑开、收拢和挡雨？|assembly|连杆 伞骨
lock|正确的钥匙为什么能打开锁？|cutaway|弹子 锁芯
watch|机械手表不用电池，怎么走时？|assembly|发条 擒纵
faucet|水龙头怎样控制水流？|cutaway|陶瓷 阀芯
lighter|打火机怎样产生火焰？|cutaway|点火 燃料
toilet|马桶怎样冲走污物，又隔住气味？|path|水封 虹吸
air-conditioner|空调怎样把房间变凉？|path|制冷 热量 制冷剂
fridge|冰箱怎样持续保持低温？|cutaway|隔热 制冷
rice-cooker|电饭锅怎么知道饭快煮好了？|process|温控 水分
microwave|微波炉怎样加热食物？|process|电磁场 介质
induction|电磁炉为什么挑锅？|compare|电磁感应 锅具
washer|洗衣机怎样洗净衣服、甩出水？|process|滚筒 脱水
vacuum|吸尘器怎样把灰尘吸进去？|path|气流 压力差
air-filter|空气净化器怎样把颗粒拦下来？|scale|滤芯 扩散
thermos|保温杯为什么能保温也能保冷？|cutaway|真空 辐射
hairdryer|吹风机怎样同时吹风和加热？|cutaway|电机 发热丝
airplane|飞机那么重，为什么能飞？|path|机翼 升力 推力
high-speed-rail|高铁怎样获得动力并保持稳定？|cutaway|牵引 转向架
bicycle|自行车变速为什么会改变蹬踏感？|compare|齿轮 力矩
brakes|汽车踩下刹车后发生了什么？|path|液压 摩擦
ship|钢铁造的大船为什么能浮起来？|compare|排水 浮力
submarine|潜艇怎样下潜和上浮？|cutaway|压载舱 浮力
elevator|电梯怎样把人送上楼？|path|对重 制动
escalator|自动扶梯的台阶去了哪里？|process|梯级 轨道
bridges|桥为什么能跨过那么宽的河？|compare|梁 拱 索
expansion|桥梁和轨道为什么要处理伸缩？|compare|热胀冷缩 接缝
rocket|火箭内部有什么，怎样把东西送上天？|assembly|贮箱 发动机 分级
satellite|卫星为什么能一直绕着地球飞？|compare|轨道 引力 速度
weightlessness|空间站里的宇航员为什么会飘起来？|process|自由落体 失重
spacesuit|航天服怎样保护宇航员？|cutaway|供氧 压力 温控
reentry|返回舱回地球时为什么会发热？|cutaway|气动加热 防热
moon-phases|月亮为什么有圆有缺？|compare|月相 日地月
eclipses|日食和月食是怎样发生的？|compare|影子 轨道
seasons|为什么会有四季？|compare|地轴 昼长
meteors|流星、陨石和小行星有什么区别？|identify|大气 天体
solar-system|太阳系到底有多大？|scale|距离 直径 比例
mirror|镜子里的世界为什么看起来反了？|compare|反射 空间
refraction|筷子插进水里为什么像折断了？|path|折射 视位置
soap-bubble|肥皂泡为什么五颜六色？|compare|薄膜 干涉
glasses|眼镜怎样帮助人看清东西？|path|镜片 成像
sound|声音怎样穿过空气传到耳朵？|process|压力 振动
noise-cancelling|降噪耳机怎样让噪声变小？|compare|叠加 相位
touchscreen|手机屏幕怎么知道手指点在哪里？|cutaway|电容 触控
qr-code|二维码怎样装下信息？|scale|定位 编码 纠错
wifi|Wi-Fi怎样把信息送进手机？|path|无线 数据 路由器
navigation|手机导航怎么知道我们在哪里？|compare|卫星 测距 定位
rust|铁为什么会生锈？|compare|腐蚀 水 氧气
stainless-steel|不锈钢为什么比较耐腐蚀？|scale|铬 钝化膜
tempered-glass|钢化玻璃为什么会碎成许多小块？|cutaway|应力 裂纹
eraser|橡皮为什么能擦掉铅笔字？|scale|石墨 纸纤维
hook-loop|魔术贴为什么能反复粘住？|assembly|钩 环
plastics|塑料为什么有那么多种？|identify|聚合物 树脂 标识
battery|充电电池怎样存电、放电？|path|离子 电子 电极
solar-cell|太阳能电池板怎样把光变成电？|cutaway|光伏 半导体
wind-turbine|风力发电机里面有什么？|assembly|叶片 齿轮 发电机
tap-water|自来水怎样来到家里，污水又去了哪里？|path|净水 污水 水厂`;
const enhanced = new Set([
  1, 3, 11, 19, 21, 29, 32, 33, 41, 42, 51, 56, 61, 62, 71, 76, 81, 88, 91, 92,
  103, 108, 117, 119,
]);
const spatial = new Set([19, 29, 41, 61, 71, 81, 91, 119]);
export const scienceTopics = rows.split("\n").map((row, index) => {
  const [id, title, template, keywords] = row.split("|");
  const number = index + 1;
  return {
    id,
    number,
    title,
    category: categories[Math.floor(index / 10)].id,
    template,
    keywords,
    enhanced: enhanced.has(number),
    spatial: spatial.has(number),
    minutes: enhanced.has(number) ? 8 : 5,
    // Publication is deliberately controlled by completed content, not by directory size.
    status: "draft",
    related: [],
  };
});
export const scienceById = Object.fromEntries(
  scienceTopics.map((t) => [t.id, t]),
);
export const scienceCommunityTopics = scienceTopics.map((t) => ({
  id: `science:${t.id}`,
  title: `科普馆 · ${t.title}`,
  subject: "science",
  members: [`science:${t.id}`],
}));

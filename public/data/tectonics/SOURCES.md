# PB2002 板块边界数据

- 原作者：Peter Bird，An updated digital model of plate boundaries，2003，doi:10.1029/2001GC000252。
- GIS 转换：Hugo Ahlenius / Nordpil；GeoJSON 转换由 fraxen/tectonicplates 项目提供。
- 来源：https://github.com/fraxen/tectonicplates
- 下载：https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json
- 获取日期：2026-10-11。保留原始 241 个 LineString 和所有属性，未简化、未改动坐标。
- 许可：Open Data Commons Attribution 1.0，原仓库声明见 LICENSE.md；https://opendatacommons.org/licenses/by/1-0/ 。界面附署名及来源链接。
- 本地以经纬度投影为球面线段。Type=subduction 用橙色，其余类型为空的数据用青色，不据此推断张裂/碰撞/转换边界；不是地震或火山目录。

## USGS 2025 年地震目录快照

- 来源：[USGS FDSN Event Web Service](https://earthquake.usgs.gov/fdsnws/event/1/)。获取日期 2026-10-11，发布文件 usgs-2025-m55.json。
- 查询：`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-01-01T00:00:00&endtime=2025-12-31T23:59:59.999&minmagnitude=5.5&eventtype=earthquake&orderby=magnitude`。
- 此次快照共 513 条，范围为 2025 年 UTC、M≥5.5；不是实时目录，不代表全部地震。USGS 后续修订可能改变同一查询结果。
- 原始响应 SHA256：2931b648cf6836f3bc52865a0ec2ddfdbcbb37090de08be8d679a10b7f14b0b4。导入时间、查询和哈希也保存在发布 JSON 中。
- 运行 `node scripts/import-earthquake-catalog.mjs` 获取并验证；也可使用 `--input` 指定原始 GeoJSON。全量验证事件类型、UTC 时间、震级、坐标、唯一 ID 与数量后才替换发布文件。
- 保留原始地点名称、震级类型和深度；将经纬度绘制为球面震中，深度仅在详情显示。点大小不代表震级或影响范围，每条记录链接回 USGS 原始事件页。

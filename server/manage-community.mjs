import { openStore, statuses } from "./community.mjs";
import { writeFileSync } from "node:fs";
const db = openStore();
try {
  const [command, id, status, response] = process.argv.slice(2);
  if (command === "export") {
    if (!id)
      throw new Error("用法：npm run community -- export <输出文件.json>");
    writeFileSync(
      id,
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          likes: db
            .prepare(
              "SELECT topic,count(*) count FROM likes GROUP BY topic ORDER BY count DESC",
            )
            .all(),
          entries: db
            .prepare(
              "SELECT id,kind,topic,title,requirements,effect,author,status,response,created,updated FROM entries ORDER BY created DESC",
            )
            .all(),
        },
        null,
        2,
      ),
      { flag: "wx" },
    );
    console.log(`已导出到 ${id}`);
  } else if (command === "status") {
    if (!statuses.includes(status) || !response?.trim())
      throw new Error(
        `用法：npm run community -- status <编号> <${statuses.join("|")}> <处理说明>`,
      );
    const result = db
      .prepare("UPDATE entries SET status=?,response=?,updated=? WHERE id=?")
      .run(status, response.trim(), new Date().toISOString(), id);
    if (!result.changes) throw new Error("没有找到该记录");
    console.log("处理状态和说明已保存");
  } else
    console.log(
      JSON.stringify(
        db
          .prepare(
            "SELECT id,kind,topic,title,requirements,effect,status,response,created FROM entries ORDER BY created DESC",
          )
          .all(),
        null,
        2,
      ),
    );
} finally {
  db.close();
}

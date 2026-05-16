import pymysql, ssl, re, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

conn = pymysql.connect(
    host='gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port=4000, user='Vyv4YX5KryKacqS.root',
    password='qxlE9MQcxkqkN8LF', ssl=ctx, autocommit=True
)
cur = conn.cursor()
cur.execute("DROP DATABASE IF EXISTS vibesync")
cur.execute("CREATE DATABASE vibesync")
cur.execute("USE vibesync")
cur.execute("SET FOREIGN_KEY_CHECKS=0")
print("DB recreated, FK checks off")

with open('vibesync_cloud.sql', 'r', encoding='utf-8-sig') as f:
    content = f.read()

# Strip MySQL dump directives
content = re.sub(r'/\*!.*?\*/', '', content, flags=re.DOTALL)
content = re.sub(r'LOCK TABLES.*?;', '', content)
content = re.sub(r'UNLOCK TABLES;', '', content)
content = re.sub(r'SET @saved_cs_client.*?;', '', content)
content = re.sub(r'SET character_set_client\s*=\s*@saved_cs_client\s*;', '', content)
content = re.sub(r'SET @saved_cs_results.*?;', '', content)
content = re.sub(r'SET @saved_col_connection.*?;', '', content)

stmts = content.split(';')
ok = fail = 0
for s in stmts:
    s = s.strip()
    if not s or s.startswith('--') or len(s) < 10:
        continue
    try:
        cur.execute(s)
        ok += 1
    except Exception as e:
        fail += 1
        err = str(e)[:120].encode('ascii','replace').decode()
        print(f"FAIL: {err}")

cur.execute("SET FOREIGN_KEY_CHECKS=1")
print(f"\nDone! OK={ok} FAIL={fail}")
cur.execute("SHOW TABLES")
for t in cur.fetchall():
    cur.execute(f"SELECT COUNT(*) FROM `{t[0]}`")
    cnt = cur.fetchone()[0]
    print(f"  {t[0]}: {cnt} rows")
conn.close()

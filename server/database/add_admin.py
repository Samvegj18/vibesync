import pymysql, ssl, sys
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

conn = pymysql.connect(
    host='gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port=4000, user='Vyv4YX5KryKacqS.root',
    password='qxlE9MQcxkqkN8LF', ssl=ctx, autocommit=True,
    database='vibesync'
)
cur = conn.cursor()

# Add is_admin column
try:
    cur.execute("ALTER TABLE users ADD COLUMN is_admin TINYINT DEFAULT 0")
    print("Added is_admin column")
except Exception as e:
    print(f"Column may already exist: {e}")

# Set samj18 as admin
cur.execute("UPDATE users SET is_admin = 1 WHERE username = 'samj18'")
print(f"Rows updated: {cur.rowcount}")

cur.execute("SELECT user_id, username, is_admin FROM users")
for r in cur.fetchall():
    print(f"  {r[1]}: is_admin={r[2]}")

conn.close()

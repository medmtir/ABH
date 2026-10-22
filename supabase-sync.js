const fs = require('fs');

async function run() {
  try {
    const op = process.argv[2];
    const url = process.argv[3];
    const key = process.argv[4];

    if (op === 'upload') {
      const file = process.argv[5];
      const data = fs.readFileSync(file);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + key,
          'apikey': key,
          'Content-Type': 'application/json',
          'x-upsert': 'true',
        },
        body: data,
      });
      process.stdout.write(await res.text());
    } else if (op === 'download') {
      const res = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + key,
          'apikey': key,
        },
      });
      process.stdout.write(await res.text());
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

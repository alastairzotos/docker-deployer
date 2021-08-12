const http = require('http');
const fs = require('fs');
const child_process = require('child_process');
const path = require('path');

const readEnv = () => new Promise((resolve, reject) => {
  const envPath = path.resolve(__dirname, '.env');
  fs.access(envPath, fs.F_OK, err => {
    if (err) {
      return reject('No .env file found')
    }

    fs.readFile(envPath, (err, data) => {
      if (err) {
        return reject(err);
      }

      const items = data.toString()
        .split('\n')
        .map(line => line.split('='))
        .reduce((acc, item) => ({
          ...acc,
          [item[0]]: item[1]
        }), {});

      resolve(items);
    })
  })
});

const getOptions = async () => {
  const env = await readEnv();

  return {
    port: env.PORT ? parseInt(env.PORT, 10) : 4042,
    key: env.DOCKER_DEPLOYER_KEY
  }
};

const parseBody = req => new Promise(resolve => {
  let body = '';
  req.on('data', (data) => body += data);
  req.on('end', () => resolve(JSON.parse(body)));
})

const authenticate = (headers, key) =>
  headers &&
  !!headers.authorization &&
  !!headers.authorization.startsWith('Bearer ') &&
  headers.authorization.split(' ')[1] === key;

const spawnProcess = async (command, args, logs) =>
  new Promise((resolve, reject) => {
    const proc = child_process.spawn(command, args);

    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr);

    if (logs) {
      proc.stdout.on('data', data => logs.push(data.toString()));
      proc.stderr.on('data', data => logs.push(data.toString()));
    }

    proc.on('exit', () => resolve());
    proc.on('error', error => reject(error));
  });

const handleRequest = async (body) => {
  const { image, ports } = body;

  let logs = [];

  await spawnProcess('docker', ['pull', image], logs);
  await spawnProcess('docker', ['run', '-d', '-p', ports, image], logs);

  return logs.join('\n');
}

const start = async () => {
  try {
    const options = await getOptions();

    if (!options.key) {
      console.error('Expected DOCKER_DEPLOYER_KEY in .env file')
      process.exit(1);
    }

    const server = http.createServer(async (req, res) => {
      if (req.method === 'POST' && req.url === '/deploy') {
        if (authenticate(req.headers, options.key)) {
          return res.writeHead(200).end(await handleRequest(await parseBody(req)));
        } else {
          return res.writeHead(401).end('Unauthorized');
        }
      } else {
        res.writeHead(400).end('Requests expected at POST /deploy');
      }
    });

    server.listen(options.port, () => console.log(`Listening on http://localhost:${options.port}`));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

start();

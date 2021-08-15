export const promisifyStream = (stream: any, log: (data: string) => void) =>
  new Promise((resolve, reject) => {
    stream.on('data', data => {
      const strData = data.toString() as string;

      // Docker api sometimes returns multiple lines of json
      const lines = strData.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      lines.forEach(line => {
        try {
          const json = JSON.parse(line);
          if (json) {
            if (json.status) {
              log(json.status);
            } else {
              log(line);
            }
          } else {
            log(line);
          }
        } catch {
          log(line);
        }
      })
    })

    stream.on('end', resolve)
    stream.on('error', reject)
  });

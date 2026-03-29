const https = require('https');

https.get('https://api.github.com/repos/DavidHDev/react-bits/git/trees/main?recursive=1', { headers: { 'User-Agent': 'Node' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.tree) {
        console.log(json.tree.filter(t => /FloatingLines/i.test(t.path)).map(t => t.path));
      } else {
        console.log(json);
      }
    } catch (e) { console.error(e); }
  });
});

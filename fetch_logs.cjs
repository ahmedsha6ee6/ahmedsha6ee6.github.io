const https = require('https');
const fs = require('fs');
const zlib = require('zlib');

https.get({
  hostname: 'api.github.com',
  path: '/repos/ahmedsha6ee6/ahmedsha6ee6.github.io/actions/runs',
  headers: { 'User-Agent': 'Node.js' }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const runs = JSON.parse(data);
    const latestRun = runs.workflow_runs[0];
    
    https.get({
      hostname: 'api.github.com',
      path: `/repos/ahmedsha6ee6/ahmedsha6ee6.github.io/actions/runs/${latestRun.id}/jobs`,
      headers: { 'User-Agent': 'Node.js' }
    }, (res2) => {
      let data2 = '';
      res2.on('data', d => data2 += d);
      res2.on('end', () => {
        const jobs = JSON.parse(data2);
        const failedJob = jobs.jobs.find(j => j.conclusion === 'failure');
        
        console.log(`Failed job ID: ${failedJob.id}`);
        // GitHub API for logs redirects to an AWS S3 URL which requires following redirects
        // but it requires authentication. Public repo logs CAN be downloaded if we don't auth, 
        // wait, we can just view the workflow file to see if I made a typo!
      });
    });
  });
});

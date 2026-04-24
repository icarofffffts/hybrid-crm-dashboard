const { Client } = require('pg');

const client = new Client({
  host: '143.198.167.219',
  port: 6543,
  user: 'postgres',
  password: 'NqdvWvWOg88jD9hNrTgUkRSigPqH2mE4Oc+zot3EWw0=',
  database: 'postgres',
});

client.connect()
  .then(() => {
    console.log('Connected successfully');
    return client.query('SELECT 1');
  })
  .then(res => {
    console.log('Query result:', res.rows);
    return client.end();
  })
  .catch(err => {
    console.error('Connection error:', err.stack);
    process.exit(1);
  });

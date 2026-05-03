const { runFullAudit } = require('./src/tests/GameSimulationBot');

console.log('--- VETO SYSTEM AUDIT START ---');
runFullAudit().then(() => {
  console.log('--- VETO SYSTEM AUDIT COMPLETED ---');
}).catch(err => {
  console.error('Audit Failed:', err);
});

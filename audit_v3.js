const fs = require('fs');
const path = require('path');

// Mocking the engine logic since we can't easily import TS files directly in this environment without transpilation
// But wait, I can just read the JSON scenarios and simulate the logic here!
// This is even better for a pure "logic test"

const scenarios = [
  ...JSON.parse(fs.readFileSync('./scenarios/initial_batch.json', 'utf8')),
  ...JSON.parse(fs.readFileSync('./scenarios/fase_15_1.json', 'utf8')),
  ...JSON.parse(fs.readFileSync('./scenarios/fase_15_5.json', 'utf8')),
  ...JSON.parse(fs.readFileSync('./scenarios/fase_15_9.json', 'utf8')),
  ...JSON.parse(fs.readFileSync('./scenarios/fase_15_13.json', 'utf8'))
];

class SimpleSimBot {
  constructor(strategy) {
    this.strategy = strategy;
    this.state = {
      day: 1,
      stats: { law: 50, humanity: 50, order: 50, budget: 50 },
      history: [],
      activeFlags: [],
      profile: 'Pemimpin Transisional'
    };
  }

  run() {
    while (this.state.day <= 720) {
      // 1. Pick Scenario
      let scenario = this.pickScenario();
      if (!scenario) {
        // Routine generation simulation
        this.state.day += 1;
        continue;
      }

      // 2. Pick Choice
      const choice = this.pickChoice(scenario.options);
      
      // 3. Apply Choice
      this.applyImpact(choice.impact);
      if (choice.trigger_flags) {
        this.state.activeFlags.push(...choice.trigger_flags);
      }
      this.state.history.push(scenario.id);
      
      // 4. Update Profile (Simple Mock)
      this.updateProfile();

      this.state.day += 10; // Fast forward for simulation speed
    }

    return this.evaluateEnding();
  }

  pickScenario() {
    // Basic filtering logic
    return scenarios.find(s => {
      if (this.state.history.includes(s.id)) return false;
      if (s.required_flags && !s.required_flags.every(f => this.state.activeFlags.includes(f))) return false;
      if (s.required_archetypes && !s.required_archetypes.includes(this.state.profile)) return false;
      return true;
    });
  }

  pickChoice(options) {
    if (this.strategy === 'RANDOM') return options[Math.floor(Math.random() * options.length)];
    return options.sort((a, b) => b.impact[this.strategy.toLowerCase()] - a.impact[this.strategy.toLowerCase()])[0];
  }

  applyImpact(impact) {
    for (let key in impact) {
      this.state.stats[key] = Math.max(0, Math.min(100, this.state.stats[key] + impact[key]));
    }
  }

  updateProfile() {
    const { law, humanity, order } = this.state.stats;
    if (law > 70 && humanity > 70) this.state.profile = 'Sang Penjaga Konstitusi';
    else if (order > 70) this.state.profile = 'Arsitek Stabilitas';
    else if (humanity > 70) this.state.profile = 'Populis Filantropis';
  }

  evaluateEnding() {
    const { stats, activeFlags } = this.state;
    if (activeFlags.includes('TYRANT_SEED') || stats.order > 75) return 'Sang Tirani Besi';
    if (activeFlags.includes('MARTYR_SEED') || stats.humanity > 75) return 'Martir Kemanusiaan';
    if (stats.law > 75) return 'Sang Pembaharu Visioner';
    return 'Sang Penjaga Status Quo';
  }
}

const strategies = ['LAW', 'HUMANITY', 'ORDER', 'RANDOM'];
console.log('=== VETO LOGIC STRESS TEST ===');
strategies.forEach(s => {
  const bot = new SimpleSimBot(s);
  const ending = bot.run();
  console.log(`Bot [${s}] -> Ending: ${ending} | Stats: ${JSON.stringify(bot.state.stats)}`);
});
console.log('==============================');

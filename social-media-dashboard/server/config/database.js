const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'dashboard.db');
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let db = null;

// Wrapper to make sql.js API compatible with better-sqlite3 style
class DatabaseWrapper {
  constructor(sqlDb) {
    this._db = sqlDb;
  }

  prepare(sql) {
    const self = this;
    return {
      run(...params) {
        self._db.run(sql, params);
        self._save();
      },
      get(...params) {
        const stmt = self._db.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
          const result = stmt.getAsObject();
          stmt.free();
          return result;
        }
        stmt.free();
        return undefined;
      },
      all(...params) {
        const results = [];
        const stmt = self._db.prepare(sql);
        stmt.bind(params);
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      }
    };
  }

  exec(sql) {
    this._db.exec(sql);
    this._save();
  }

  transaction(fn) {
    return (...args) => {
      this._db.run('BEGIN TRANSACTION');
      try {
        fn(...args);
        this._db.run('COMMIT');
        this._save();
      } catch (e) {
        this._db.run('ROLLBACK');
        throw e;
      }
    };
  }

  _save() {
    try {
      const data = this._db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    } catch (e) {
      // silent save errors in some environments
    }
  }
}

// Synchronous initialization using require pattern
let _dbInstance = null;

function getDb() {
  if (_dbInstance) return _dbInstance;
  throw new Error('Database not initialized yet. Call initDatabase() first.');
}

async function initDatabase() {
  if (_dbInstance) return _dbInstance;

  const SQL = await initSqlJs();

  let sqlDb;
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    sqlDb = new SQL.Database(buffer);
  } else {
    sqlDb = new SQL.Database();
  }

  _dbInstance = new DatabaseWrapper(sqlDb);

  // Initialize tables
  _dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      platforms TEXT NOT NULL,
      image_url TEXT,
      image_type TEXT DEFAULT 'none',
      status TEXT DEFAULT 'draft',
      scheduled_at TEXT,
      published_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS post_platform_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      platform_post_id TEXT,
      error_message TEXT,
      published_at TEXT,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      shares INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      reach INTEGER DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      engagement_rate REAL DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      saves INTEGER DEFAULT 0,
      fetched_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      scheduled_time TEXT NOT NULL,
      recurrence TEXT DEFAULT 'once',
      status TEXT DEFAULT 'pending',
      cron_expression TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS content_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      template_text TEXT NOT NULL,
      hashtags TEXT,
      platform TEXT DEFAULT 'all',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS community_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      followers INTEGER DEFAULT 0,
      following INTEGER DEFAULT 0,
      total_posts INTEGER DEFAULT 0,
      avg_engagement_rate REAL DEFAULT 0,
      growth_rate REAL DEFAULT 0,
      recorded_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS api_credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT UNIQUE NOT NULL,
      credentials TEXT NOT NULL,
      is_connected INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed content templates
  const templateCount = _dbInstance.prepare('SELECT COUNT(*) as count FROM content_templates').get();
  if (templateCount.count === 0) {
    const templates = [
      ['tpl_gl_1', 'Gold Loan - Quick Disbursal', 'asset_products', 'gold_loan',
        'Need funds fast? Get instant cash with Dhanam Gold Loan! ✨ Low interest rates, minimal documentation, and quick disbursal within minutes. Your gold works for you! 💰\n\n📞 Call 1800 2025 180\n🏢 50+ branches across Tamil Nadu',
        '#GoldLoan #DhanamFinance #InstantLoan #TamilNadu #FinancialFreedom #QuickLoan', 'all'],
      ['tpl_gl_2', 'Gold Loan - Festival Special', 'asset_products', 'gold_loan',
        '🎉 Festival season is here! Unlock the value of your gold with Dhanam Finance. Special festival rates available now!\n\n✅ Up to 75% of gold value\n✅ No hidden charges\n✅ Flexible repayment\n\nVisit your nearest Dhanam branch today!',
        '#FestivalOffer #GoldLoan #DhanamFinance #SpecialRates #Celebration', 'all'],
      ['tpl_ml_1', 'Mortgage Loan - Dream Home', 'asset_products', 'mortgage_loan',
        '🏠 Turn your property into possibilities! Dhanam Mortgage Loan offers up to 15 years repayment with attractive interest rates.\n\n✅ Loan against property\n✅ Flexible tenure\n✅ Quick processing\n\nEmpowering people. Enabling progress.',
        '#MortgageLoan #PropertyLoan #DhanamFinance #HomeLoan #RealEstate', 'all'],
      ['tpl_sme_1', 'SME Loan - Business Growth', 'asset_products', 'sme_loan',
        '📈 Power your business growth with Dhanam SME Loan! Whether it\'s working capital, supply chain financing, or expansion - we\'ve got you covered.\n\n✅ Customized solutions\n✅ Quick approval\n✅ Dedicated support',
        '#SMELoan #BusinessFinance #DhanamFinance #MSME #WorkingCapital', 'all'],
      ['tpl_fl_1', 'Financial Literacy - Saving Tips', 'financial_literacy', 'saving_tips',
        '💡 Financial Tip of the Day!\n\nThe 50/30/20 Rule:\n📌 50% - Needs (rent, food, bills)\n📌 30% - Wants (entertainment, dining)\n📌 20% - Savings & investments\n\nStart your financial journey with Dhanam Finance! 🌟',
        '#FinancialLiteracy #MoneyTips #SavingTips #DhanamFinance #PersonalFinance', 'all'],
      ['tpl_fl_2', 'Financial Literacy - Investment Basics', 'financial_literacy', 'investment',
        '🎯 Start Investing Early!\n\nDid you know? If you invest ₹5,000/month starting at age 25, you could have ₹1 Crore+ by retirement!\n\nThe power of compound interest is real. Let Dhanam Finance guide your financial journey.',
        '#Investment #CompoundInterest #FinancialPlanning #DhanamFinance #WealthCreation', 'all'],
      ['tpl_fl_3', 'Financial Literacy - Gold Investment', 'financial_literacy', 'gold_investment',
        '✨ Why Gold is a Smart Investment:\n\n1️⃣ Hedge against inflation\n2️⃣ High liquidity\n3️⃣ No counterparty risk\n4️⃣ Portfolio diversification\n5️⃣ Cultural significance\n\nAnd with Dhanam Gold Loan, your gold works even harder for you! 💰',
        '#GoldInvestment #FinancialLiteracy #DhanamFinance #SmartInvesting', 'all'],
      ['tpl_eng_1', 'Customer Testimonial', 'custom', 'testimonial',
        '⭐ "Dhanam Finance processed my gold loan in just 15 minutes! The staff was incredibly helpful and the interest rate was the best I found." - Happy Customer\n\n10+ years of trust | 5L+ happy customers',
        '#CustomerReview #Testimonial #DhanamFinance #TrustedNBFC', 'all'],
      ['tpl_eng_2', 'Branch Opening', 'custom', 'announcement',
        '🎊 Exciting News! Dhanam Finance opens a new branch in [CITY]!\n\nNow serving you closer to home with:\n🏆 Gold Loans\n🏠 Mortgage Loans\n💼 SME Loans\n\nVisit us today! 📍 [ADDRESS]\n📞 1800 2025 180',
        '#NewBranch #DhanamFinance #GrandOpening #TamilNadu', 'all'],
    ];

    for (const t of templates) {
      _dbInstance.prepare(
        'INSERT INTO content_templates (id, name, category, subcategory, template_text, hashtags, platform) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(...t);
    }
  }

  return _dbInstance;
}

// Module exports: initDatabase for async init, getDb for sync access
module.exports = { initDatabase, getDb };

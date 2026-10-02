import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { connectToDatabase } from './mongoose';
import { PaymentPlanModel, MonthlyStatusModel } from './models';

const SEED_DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function getDbPath() {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), 'db.json');
  }
  return SEED_DB_PATH;
}

const DB_PATH = getDbPath();

const INITIAL_DB = {
  paymentPlans: [],
  monthlyStatuses: {}
};

async function ensureDbExists() {
  try {
    await fs.access(DB_PATH);
  } catch {
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });
    
    try {
      const seedContent = await fs.readFile(SEED_DB_PATH, 'utf-8');
      await fs.writeFile(DB_PATH, seedContent, 'utf-8');
    } catch {
      await fs.writeFile(DB_PATH, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
    }
  }
}

export async function getLocalDb() {
  await ensureDbExists();
  try {
    const content = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read db.json:', error);
    return INITIAL_DB;
  }
}

export async function saveLocalDb(data) {
  try {
    await ensureDbExists();
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Local DB write error:", err);
  }
}

// --- PAYMENT PLANS API ---

export async function getPaymentPlans() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const plans = await PaymentPlanModel.find({}).lean();
      return plans.map(p => {
        const { _id, __v, ...rest } = p;
        return rest;
      });
    }
  } catch (err) {
    console.error("MongoDB fetch error for payment plans:", err);
  }

  // Fallback to local JSON
  const db = await getLocalDb();
  return db.paymentPlans || [];
}

export async function savePaymentPlan(plan) {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await PaymentPlanModel.findOneAndUpdate(
        { id: plan.id },
        plan,
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.error("MongoDB save error for payment plan:", err);
  }

  // Also sync to local JSON
  const db = await getLocalDb();
  db.paymentPlans = db.paymentPlans || [];
  db.paymentPlans = [...db.paymentPlans.filter(p => p.id !== plan.id), plan];
  await saveLocalDb(db);
  return plan;
}

export async function updatePaymentPlan(updatedPlan) {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await PaymentPlanModel.findOneAndUpdate(
        { id: updatedPlan.id },
        updatedPlan,
        { new: true }
      );
    }
  } catch (err) {
    console.error("MongoDB update error for payment plan:", err);
  }

  const db = await getLocalDb();
  db.paymentPlans = (db.paymentPlans || []).map((p) =>
    p.id === updatedPlan.id ? { ...p, ...updatedPlan } : p
  );
  await saveLocalDb(db);
  return updatedPlan;
}

export async function deletePaymentPlan(paymentId) {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await PaymentPlanModel.deleteOne({ id: paymentId });
    }
  } catch (err) {
    console.error("MongoDB delete error for payment plan:", err);
  }

  const db = await getLocalDb();
  db.paymentPlans = (db.paymentPlans || []).filter((p) => p.id !== paymentId);
  await saveLocalDb(db);
  return true;
}

// --- MONTHLY STATUSES API ---

export async function getMonthlyStatuses() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const records = await MonthlyStatusModel.find({}).lean();
      const result = {};
      records.forEach(r => {
        result[r.monthStr] = r.statuses;
      });
      return result;
    }
  } catch (err) {
    console.error("MongoDB fetch error for monthly statuses:", err);
  }

  const db = await getLocalDb();
  return db.monthlyStatuses || {};
}

export async function saveMonthlyStatuses(statuses) {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      for (const [monthStr, monthData] of Object.entries(statuses)) {
        await MonthlyStatusModel.findOneAndUpdate(
          { monthStr },
          { monthStr, statuses: monthData },
          { upsert: true }
        );
      }
    }
  } catch (err) {
    console.error("MongoDB save error for monthly statuses:", err);
  }

  const db = await getLocalDb();
  db.monthlyStatuses = statuses;
  await saveLocalDb(db);
  return statuses;
}

export async function clearAllData() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await PaymentPlanModel.deleteMany({});
      await MonthlyStatusModel.deleteMany({});
    }
  } catch (err) {
    console.error("MongoDB clear data error:", err);
  }

  await saveLocalDb(INITIAL_DB);
  return true;
}

import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

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
    await fs.writeFile(DB_PATH, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
  }
}

export async function getDb() {
  await ensureDbExists();
  try {
    const content = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read db.json:', error);
    return INITIAL_DB;
  }
}

export async function saveDb(data) {
  await ensureDbExists();
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getPaymentPlans() {
  const db = await getDb();
  return db.paymentPlans || [];
}

export async function savePaymentPlan(plan) {
  const db = await getDb();
  db.paymentPlans = db.paymentPlans || [];
  db.paymentPlans.push(plan);
  await saveDb(db);
  return plan;
}

export async function deletePaymentPlan(paymentId) {
  const db = await getDb();
  db.paymentPlans = (db.paymentPlans || []).filter((p) => p.id !== paymentId);
  await saveDb(db);
  return true;
}

export async function getMonthlyStatuses() {
  const db = await getDb();
  return db.monthlyStatuses || {};
}

export async function saveMonthlyStatuses(statuses) {
  const db = await getDb();
  db.monthlyStatuses = statuses;
  await saveDb(db);
  return statuses;
}

export async function clearAllData() {
  await saveDb(INITIAL_DB);
  return true;
}

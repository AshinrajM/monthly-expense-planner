import { getPaymentPlans, getMonthlyStatuses, saveMonthlyStatuses, deletePaymentPlanApi } from './storage';
import { isMonthInRange } from './dateUtils';

export const getPaymentsForMonth = async (monthStr) => {
  const plans = await getPaymentPlans();
  const statuses = await getMonthlyStatuses();
  const monthStatuses = statuses[monthStr] || {};
  let statusUpdated = false;

  const activePayments = (plans || []).filter(plan => isMonthInRange(monthStr, plan.startMonth, plan.durationMonths));

  const result = activePayments.map(plan => {
    let paid = false;
    if (monthStatuses[plan.id]) {
      paid = monthStatuses[plan.id].paid;
    } else {
      // Initialize if not present
      monthStatuses[plan.id] = { paid: false };
      statusUpdated = true;
    }
    
    return {
      ...plan,
      paid,
    };
  });

  if (statusUpdated) {
    statuses[monthStr] = monthStatuses;
    await saveMonthlyStatuses(statuses);
  }

  return result;
};

export const togglePaymentStatus = async (monthStr, paymentId, isPaid) => {
  const statuses = await getMonthlyStatuses();
  if (!statuses[monthStr]) {
    statuses[monthStr] = {};
  }
  statuses[monthStr][paymentId] = { paid: isPaid, paidAt: isPaid ? new Date().toISOString() : null };
  await saveMonthlyStatuses(statuses);
};

export const calculateMonthStats = (payments = []) => {
  const totalAmount = payments.reduce((sum, p) => sum + p.monthlyAmount, 0);
  const paidAmount = payments.reduce((sum, p) => p.paid ? sum + p.monthlyAmount : sum, 0);
  const remainingAmount = totalAmount - paidAmount;
  const completedCount = payments.filter(p => p.paid).length;
  const pendingCount = payments.length - completedCount;
  const progress = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  return { totalAmount, paidAmount, remainingAmount, completedCount, pendingCount, progress };
};

export const deletePaymentPlan = async (paymentId) => {
  await deletePaymentPlanApi(paymentId);
};

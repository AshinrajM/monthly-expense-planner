import { getPaymentPlans, getMonthlyStatuses, saveMonthlyStatuses, deletePaymentPlanApi, updatePaymentPlanApi } from './storage';
import { isMonthInRange } from './dateUtils';

export const getAllData = async () => {
  const [plans, statuses] = await Promise.all([
    getPaymentPlans(),
    getMonthlyStatuses(),
  ]);
  return { plans: plans || [], statuses: statuses || {} };
};

export const getPaymentsForMonthFromData = (plans = [], statuses = {}, monthStr) => {
  const monthStatuses = statuses[monthStr] || {};
  const activePayments = plans.filter(plan => isMonthInRange(monthStr, plan.startMonth, plan.durationMonths));

  return activePayments.map(plan => ({
    ...plan,
    paid: monthStatuses[plan.id]?.paid ?? false,
  }));
};

export const getPaymentsForMonth = async (monthStr) => {
  const { plans, statuses } = await getAllData();
  return getPaymentsForMonthFromData(plans, statuses, monthStr);
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

export const updatePaymentPlan = async (updatedPlan) => {
  await updatePaymentPlanApi(updatedPlan);
};

export const deletePaymentPlan = async (paymentId) => {
  await deletePaymentPlanApi(paymentId);
};

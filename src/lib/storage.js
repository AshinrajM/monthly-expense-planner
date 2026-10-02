// LocalStorage keys for browser fallback persistence
const PLANS_STORAGE_KEY = 'monthly_payment_plans_v2';
const STATUSES_STORAGE_KEY = 'monthly_payment_statuses_v2';

export const getAuthStatus = async () => {
  try {
    const res = await fetch('/api/auth/session', { cache: 'no-store' });
    const data = await res.json();
    return !!data.isAuthenticated;
  } catch (error) {
    return false;
  }
};

export const loginUser = async (username, password) => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: 'Network error during login' };
  }
};

export const logout = async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getPaymentPlans = async () => {
  try {
    const res = await fetch('/api/payments', { cache: 'no-store' });
    if (res.ok) {
      const apiPlans = await res.json();
      if (Array.isArray(apiPlans)) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(apiPlans));
          } catch (e) {}
        }
        return apiPlans;
      }
    }
  } catch (error) {
    console.error('API fetch error for plans, using localStorage fallback:', error);
  }

  // Offline or network error fallback
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(PLANS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading localStorage plans:', e);
    }
  }

  return [];
};

const savePaymentPlanApi = async (plan) => {
  try {
    await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
  } catch (e) {}
};

export const savePaymentPlan = async (plan) => {
  // 1. Save to LocalStorage immediately
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem(PLANS_STORAGE_KEY) || '[]');
      const updated = [...existing.filter(p => p.id !== plan.id), plan];
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }

  // 2. Save to Server API
  try {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to save payment plan to server:', error);
  }
};

export const updatePaymentPlanApi = async (updatedPlan) => {
  // 1. Update LocalStorage immediately
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem(PLANS_STORAGE_KEY) || '[]');
      const updated = existing.map(p => p.id === updatedPlan.id ? { ...p, ...updatedPlan } : p);
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage update error:', e);
    }
  }

  // 2. Update Server API
  try {
    const res = await fetch(`/api/payments/${updatedPlan.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPlan),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to update payment plan on server:', error);
  }
};

export const deletePaymentPlanApi = async (paymentId) => {
  // 1. Delete from LocalStorage immediately
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem(PLANS_STORAGE_KEY) || '[]');
      const updated = existing.filter(p => p.id !== paymentId);
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage delete error:', e);
    }
  }

  // 2. Delete from Server API
  try {
    await fetch(`/api/payments/${paymentId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete payment plan on server:', error);
  }
};

export const getMonthlyStatuses = async () => {
  try {
    const res = await fetch('/api/statuses', { cache: 'no-store' });
    if (res.ok) {
      const apiStatuses = await res.json();
      if (apiStatuses && typeof apiStatuses === 'object') {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STATUSES_STORAGE_KEY, JSON.stringify(apiStatuses));
          } catch (e) {}
        }
        return apiStatuses;
      }
    }
  } catch (error) {
    console.error('API fetch error for statuses, using localStorage fallback:', error);
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STATUSES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
  }

  return {};
};

const saveMonthlyStatusesApi = async (statuses) => {
  try {
    await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statuses),
    });
  } catch (e) {}
};

export const saveMonthlyStatuses = async (statuses) => {
  // 1. Save to LocalStorage immediately
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STATUSES_STORAGE_KEY, JSON.stringify(statuses));
    } catch (e) {}
  }

  // 2. Save to Server API
  try {
    const res = await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statuses),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to save monthly statuses to server:', error);
  }
};

export const clearAllData = async () => {
  // Clear LocalStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(PLANS_STORAGE_KEY);
      localStorage.removeItem(STATUSES_STORAGE_KEY);
    } catch (e) {}
  }

  // Clear Server API
  try {
    await fetch('/api/reset', { method: 'POST' });
  } catch (error) {
    console.error('Failed to clear data on server:', error);
  }
};
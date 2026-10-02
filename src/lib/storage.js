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

// --- PAYMENT PLANS WITH LOCALSTORAGE BACKUP ---

export const getPaymentPlans = async () => {
  let localPlans = [];
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(PLANS_STORAGE_KEY);
      if (saved) localPlans = JSON.parse(saved);
    } catch (e) {
      console.error('Error reading localStorage plans:', e);
    }
  }

  try {
    const res = await fetch('/api/payments', { cache: 'no-store' });
    if (res.ok) {
      const apiPlans = await res.json();
      
      // If server has data, merge and sync with localStorage
      if (Array.isArray(apiPlans) && apiPlans.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(apiPlans));
        }
        return apiPlans;
      } 
      // If server returned empty array but local storage has plans (e.g. after serverless restart), sync local to server
      else if (localPlans.length > 0) {
        for (const plan of localPlans) {
          await savePaymentPlanApi(plan);
        }
        return localPlans;
      }
    }
  } catch (error) {
    console.error('API fetch error for plans, using localStorage:', error);
  }

  return localPlans;
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

// --- MONTHLY STATUSES WITH LOCALSTORAGE BACKUP ---

export const getMonthlyStatuses = async () => {
  let localStatuses = {};
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STATUSES_STORAGE_KEY);
      if (saved) localStatuses = JSON.parse(saved);
    } catch (e) {}
  }

  try {
    const res = await fetch('/api/statuses', { cache: 'no-store' });
    if (res.ok) {
      const apiStatuses = await res.json();
      if (apiStatuses && Object.keys(apiStatuses).length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STATUSES_STORAGE_KEY, JSON.stringify(apiStatuses));
        }
        return apiStatuses;
      } else if (Object.keys(localStatuses).length > 0) {
        await saveMonthlyStatusesApi(localStatuses);
        return localStatuses;
      }
    }
  } catch (error) {
    console.error('API fetch error for statuses, using localStorage:', error);
  }

  return localStatuses;
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
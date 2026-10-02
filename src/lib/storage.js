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
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
};

export const savePaymentPlan = async (plan) => {
  try {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to save payment plan:', error);
  }
};

export const deletePaymentPlanApi = async (paymentId) => {
  try {
    await fetch(`/api/payments/${paymentId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete payment plan:', error);
  }
};

export const getMonthlyStatuses = async () => {
  try {
    const res = await fetch('/api/statuses', { cache: 'no-store' });
    if (!res.ok) return {};
    return await res.json();
  } catch (error) {
    return {};
  }
};

export const saveMonthlyStatuses = async (statuses) => {
  try {
    const res = await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statuses),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to save monthly statuses:', error);
  }
};

export const clearAllData = async () => {
  try {
    await fetch('/api/reset', { method: 'POST' });
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
};
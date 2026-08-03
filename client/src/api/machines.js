const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const NETWORK_ERROR_MESSAGE = 'Unable to reach the server. Please check your connection and try again.';

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function extractErrorMessage(data, fallback) {
  if (Array.isArray(data?.details) && data.details.length > 0) {
    return data.details.join(' ');
  }
  return data?.error || fallback;
}

export async function registerMachine(payload) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/machines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, 'Failed to register the machine sale.'));
  }

  return data;
}

export async function fetchMachineByUniqueId(uniqueId) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/machines/${encodeURIComponent(uniqueId)}`);
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (response.status === 404) {
    return null;
  }

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, 'Failed to fetch machine details.'));
  }

  return data;
}

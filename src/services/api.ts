const BASE_URL = 'http://localhost:5000/api';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
    auth: {
        login: async (email, password) => {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                // Store user info if needed
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        },
        register: async (email, password, role = 'user') => {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });
            if (!response.ok) throw new Error('Registration failed');
            return response.json();
        },
        googleLogin: async (token: string) => {
            const response = await fetch(`${BASE_URL}/auth/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            if (!response.ok) {
                throw new Error('Google login failed');
            }
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
    data: {
        getColleges: async () => {
            const response = await fetch(`${BASE_URL}/data/colleges`, {
                headers: { ...getAuthHeader() }
            });
            if (!response.ok) throw new Error('Failed to fetch colleges');
            return response.json();
        },
        getConnections: async () => {
            const response = await fetch(`${BASE_URL}/data/connections`, {
                headers: { ...getAuthHeader() }
            });
            if (!response.ok) throw new Error('Failed to fetch connections');
            return response.json();
        },
        // Admin only
        createCollege: async (data: any) => {
            const response = await fetch(`${BASE_URL}/data/colleges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create college');
            return response.json();
        },
        createBuilding: async (data: any) => {
            const response = await fetch(`${BASE_URL}/data/buildings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create building');
            return response.json();
        },
        createFloor: async (data: any) => {
            const response = await fetch(`${BASE_URL}/data/floors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create floor');
            return response.json();
        },
        createPlace: async (data: any) => {
            const response = await fetch(`${BASE_URL}/data/rooms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create place');
            return response.json();
        }
    }
};

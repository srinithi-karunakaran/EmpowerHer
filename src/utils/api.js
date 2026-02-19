const API_URL = 'http://localhost:5000/api';

export const analyzePitchApi = async (pitchText, firebaseId) => {
    const response = await fetch(`${API_URL}/pitch/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pitchText, firebaseId }),
    });
    if (!response.ok) throw new Error('AI analysis failed');
    return response.json();
};

export const createRazorpayOrder = async (amount) => {
    const response = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
};

export const scanReceiptApi = async (formData) => {
    // formData would contain the image file + firebaseId if needed
    const response = await fetch(`${API_URL}/ocr/scan`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('OCR scan failed');
    return response.json();
};

export const getUserProfileApi = async (firebaseId) => {
    const response = await fetch(`${API_URL}/users/${firebaseId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
};

export const createUserApi = async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
};

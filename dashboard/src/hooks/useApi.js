import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useApi = (endpoint, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('API Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, options]);

    return { data, loading, error };
};

export const useMetrics = () => {
    return useApi('/metrics');
};

export const useAnalytics = () => {
    return useApi('/analytics');
};

export const useCameraStatus = () => {
    return useApi('/api/camera/status');
};

export const useUploadFile = () => {
    const upload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });
            return await response.json();
        } catch (err) {
            console.error('Upload Error:', err);
            throw err;
        }
    };

    return { upload, loading: false, error: null };
};

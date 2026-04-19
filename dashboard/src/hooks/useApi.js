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

export const useRecords = () => {
    return useApi('/api/records');
};

export const useInsights = () => {
    return useApi('/api/insights');
};

export const useCsvSummary = () => {
    return useApi('/api/csv/summary');
};

export const useSpeedVariance = () => {
    return useApi('/api/csv/speed-variance');
};

export const useCongestion = () => {
    return useApi('/api/csv/congestion');
};

export const useTimeSlots = () => {
    return useApi('/api/csv/time-slots');
};

export const useCsvData = (limit: number = 100) => {
    return useApi(`/api/csv/data?limit=${limit}`);
};

export const useIntegrationStatus = () => {
    return useApi('/api/integration/status');
};

export const useUploadFile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const upload = async (file) => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { upload, loading, error };
};

export const useGenerateReport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generate = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/generate-report`);
            if (!response.ok) {
                throw new Error('Report generation failed');
            }
            const result = await response.json();
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { generate, loading, error };
};

export const useCameraControl = () => {
    const start = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/camera/start`, {
                method: 'POST',
            });
            return await response.json();
        } catch (err) {
            console.error('Camera start error:', err);
            throw err;
        }
    };

    const stop = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/camera/stop`, {
                method: 'POST',
            });
            return await response.json();
        } catch (err) {
            console.error('Camera stop error:', err);
            throw err;
        }
    };

    return { start, stop };
};

export const useCameraStream = () => {
    const [streamUrl, setStreamUrl] = useState(null);

    useEffect(() => {
        setStreamUrl(`${API_BASE_URL}/api/camera/stream`);
    }, []);

    return { streamUrl };
};

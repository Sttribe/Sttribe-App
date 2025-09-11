import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const STORAGE_KEY = 'OPENAI_API_KEY'; // fixed key name

// Store your API key securely
export const storeApiKey = async (key) => {
    await SecureStore.setItemAsync(STORAGE_KEY, key);
};

export const getApiKey = async () => {
    return await SecureStore.getItemAsync(STORAGE_KEY);
};

export const chatWithOpenAI = async (messages, apiKey) => {
    try {
        const response = await axios.post(
            API_URL,
            {
                model: "gpt-3.5-turbo",
                messages,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );
        return response.data.choices[0].message;
    } catch (error) {
        console.error('OpenAI API error:', error.response?.data || error.message);
        throw error;
    }
};

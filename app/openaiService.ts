import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://api.openai.com/v1/chat/completions';

// https://api-s2onatgxwq-uc.a.run.app

const apiKey = process.env.OPENAI_API_KEY;
console.log('api key : ', apiKey);

// Store your API key securely
export const storeApiKey = async (key) => {
    await SecureStore.setItemAsync(apiKey, key);
};

export const getApiKey = async () => {
    return await SecureStore.getItemAsync(apiKey);
};

export const chatWithOpenAI = async (messages, apiKey) => {
    try {
        const response = await axios.post(
            API_URL,
            {
                model: "gpt-3.5-turbo",
                messages: messages,
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
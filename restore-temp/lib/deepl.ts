import axios from 'axios';

const DEEPL_API_KEY = '3a52f5c8-1967-43a4-b037-790934c51c82:fx';
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

interface TranslationResponse {
  translations: {
    text: string;
    detected_source_language: string;
  }[];
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  // Skip empty strings or undefined values
  if (!text || text.trim() === '') {
    console.log('Skipping empty text');
    return text;
  }
  
  try {
    console.log(`Translating: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}" to ${targetLang}`);
    
    const response = await axios.post<TranslationResponse>(
      DEEPL_API_URL,
      {
        text: [text],
        target_lang: targetLang.toUpperCase(),
      },
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const result = response.data.translations[0].text;
    console.log(`Translation result: "${result.substring(0, 30)}${result.length > 30 ? '...' : ''}"`);
    return result;
  } catch (error) {
    console.error('DeepL translation error:', error);
    if (axios.isAxiosError(error)) {
      console.error('DeepL API error details:', error.response?.data);
    }
    return text; // Return original text on error
  }
}

export async function translateObject(obj: any, targetLang: string): Promise<any> {
  if (!obj) return obj;
  
  try {
    // If object is a string, translate it directly
    if (typeof obj === 'string') {
      return await translateText(obj, targetLang);
    }
    
    // If object is an array, translate each item
    if (Array.isArray(obj)) {
      const results = [];
      for (const item of obj) {
        results.push(await translateObject(item, targetLang));
      }
      return results;
    }
    
    // If object is a complex object, translate each property
    if (typeof obj === 'object') {
      const result: any = {};
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = await translateObject(obj[key], targetLang);
        }
      }
      
      return result;
    }
    
    // Return non-translatable types as-is
    return obj;
  } catch (error) {
    console.error('Error in translateObject:', error);
    return obj; // Return original object on error
  }
} 
import { uploadFileAsync } from "./storage";
import { supabase } from "~/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// To get the current session JWT
const getSessionJWT = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    const jwt = session.access_token;
    return jwt;
  }
  
  return null;
};

// To get the current user ID
const getUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    const userId = session.user.id;
    return userId;
  }
  
  return null;
};

// Cache keys
const CACHE_KEY_PREFIX = 'meals_cache_';
const CACHE_TIMESTAMP_KEY_PREFIX = 'meals_cache_timestamp_';
const CACHE_EXPIRY_HOURS = 4;

// Helper to get today's date string in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  // Convert to local timezone
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return localDate.toISOString().split('T')[0];
};

// Helper to convert local date range to UTC
const getUTCDateRange = (localDate: string) => {
  // Create date objects for start and end of local day
  const localStart = new Date(`${localDate}T00:00:00`);
  const localEnd = new Date(`${localDate}T23:59:59`);
  
  // Convert to UTC
  const utcStart = new Date(localStart.getTime() + localStart.getTimezoneOffset() * 60000);
  const utcEnd = new Date(localEnd.getTime() + localEnd.getTimezoneOffset() * 60000);
  
  return {
    start: utcStart.toISOString(),
    end: utcEnd.toISOString()
  };
};

// Helper to check if cache is stale
const isCacheStale = async (date: string) => {
  const timestampKey = `${CACHE_TIMESTAMP_KEY_PREFIX}${date}`;
  const timestamp = await AsyncStorage.getItem(timestampKey);
  
  if (!timestamp) return true;
  
  const cacheTime = new Date(timestamp);
  const now = new Date();
  const hoursDiff = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60);
  
  return hoursDiff >= CACHE_EXPIRY_HOURS;
};

// Fetch meals for a specific date
export const fetchMealsForDate = async (date: string = getTodayDateString()) => {
  const userId = await getUserId();
  if (!userId) throw new Error('User not authenticated');

  const cacheKey = `${CACHE_KEY_PREFIX}${date}`;
  const timestampKey = `${CACHE_TIMESTAMP_KEY_PREFIX}${date}`;

  // Check cache first
  const cachedData = await AsyncStorage.getItem(cacheKey);
  const isStale = await isCacheStale(date);

  if (cachedData && !isStale) {
    console.log(`[Cache] HIT - Using cached meals for ${date}`);
    return JSON.parse(cachedData);
  }

  console.log(`[Cache] MISS - Fetching fresh meals for ${date} from database`);
  
  // Get UTC date range for the local date
  const { start, end } = getUTCDateRange(date);
  console.log(`[Database] Querying UTC range: ${start} to ${end}`);
  
  // First fetch meals
  const { data: meals, error: mealsError } = await supabase
    .from('meals')
    .select(`
      id,
      name,
      description,
      created_at,
      current_estimate_id
    `)
    .eq('user_id', userId)
    .gte('created_at', start)
    .lte('created_at', end)
    .order('created_at', { ascending: false });

  if (mealsError) {
    console.error('[Database] Meals query error:', mealsError);
    throw mealsError;
  }

  console.log('[Database] Found meals:', meals);

  if (!meals || meals.length === 0) {
    console.log('[Database] No meals found for date');
    return [];
  }

  // Get all current_estimate_ids
  const estimateIds = meals
    .map(meal => meal.current_estimate_id)
    .filter((id): id is string => id !== null);

  console.log('[Database] Fetching estimates for IDs:', estimateIds);

  // Fetch estimates for these meals
  const { data: estimates, error: estimatesError } = await supabase
    .from('estimates')
    .select(`
      id,
      name,
      calories,
      serving_size,
      servings_present
    `)
    .in('id', estimateIds);

  if (estimatesError) {
    console.error('[Database] Estimates query error:', estimatesError);
    throw estimatesError;
  }

  console.log('[Database] Found estimates:', estimates);

  // Create a map of estimate_id to estimate for easy lookup
  const estimatesMap = new Map(estimates?.map(est => [est.id, est]) ?? []);

  console.log('[Database] Estimates map:', estimatesMap);

  // Combine meals with their estimates
  const combinedData = meals.map(meal => ({
    meal_id: meal.id,
    meal_name: meal.name,
    description: meal.description,
    meal_created_at: meal.created_at,
    ...(meal.current_estimate_id ? estimatesMap.get(meal.current_estimate_id) : {}),
    estimate_name: meal.current_estimate_id ? estimatesMap.get(meal.current_estimate_id)?.name : null
  }));

  console.log('[Database] Combined data:', combinedData);

  // Update cache
  await AsyncStorage.setItem(cacheKey, JSON.stringify(combinedData));
  await AsyncStorage.setItem(timestampKey, new Date().toISOString());
  console.log(`[Cache] UPDATED - Cached ${combinedData.length} meals for ${date}`);

  return combinedData;
};

// Calculate total calories for a date
export const calculateTotalCalories = async (date: string = getTodayDateString()) => {
  const meals = await fetchMealsForDate(date);
  const total = meals.reduce((total: number, meal: any) => {
    const calories = meal.calories || 0;
    console.log(`[Calories] Meal ${meal.id}:`, {
      name: meal.meal_name ?? meal.estimate_name,
      description: meal.description,
      calories: calories,
      serving_size: meal.serving_size,
      servings_present: meal.servings_present
    });
    return total + calories;
  }, 0);
  console.log(`[Calories] Total for ${date}: ${total}`);
  return total;
};

// Mark cache as stale for a date
export const markCacheStale = async (date: string = getTodayDateString()) => {
  const timestampKey = `${CACHE_TIMESTAMP_KEY_PREFIX}${date}`;
  await AsyncStorage.removeItem(timestampKey);
};

export async function handleMealSubmission(photoUri: string, name: string, description: string) {
    const uploadResult = await uploadFileAsync(photoUri);

    if (uploadResult == undefined) {
        throw new Error('Failed to upload photo');
    }

    console.log("File uploaded successfully");
    console.log(`id: ${uploadResult.id}, path: ${uploadResult.path}, fullPath: ${uploadResult.fullPath}`);

    const userId = await getUserId();
    if (userId == null) {
        throw new Error('Failed to get user ID');
    }
    console.log(`userId: ${userId}`);

    // Invoke the Edge Function
    try {
        const response = await fetch('https://ebvqgkelaqaouhhhrrto.supabase.co/functions/v1/gemini-calorie-estimation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getSessionJWT()}`
            },
            body: JSON.stringify({ imagePath: uploadResult.path, userId: userId, name: name, description: description })
        });
    
        const data = await response.json();
    
        console.log("Edge Function response received");
        console.log(data);

        // Mark cache as stale since we added a new meal
        await markCacheStale();
        
        return data;
    } catch (error) {
        console.error('Error invoking Edge Function:', error);
        throw error;
    }
}
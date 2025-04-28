import { uploadFileAsync } from "./storage";
import { supabase } from "~/lib/supabase";

// To get the current session JWT
const getSessionJWT = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    const jwt = session.access_token;
    return jwt;
  }
  
  return null;
};

export async function handleMealSubmission(photoUri: string, name: string, description: string) {
    const uploadResult = await uploadFileAsync(photoUri);

    if (uploadResult == undefined) {
        throw new Error('Failed to upload photo');
    }

    console.log("File uploaded successfully");
    console.log(`id: ${uploadResult.id}, path: ${uploadResult.path}, fullPath: ${uploadResult.fullPath}`);

    // Invoke the Edge Function
    try {
        const response = await fetch('https://ebvqgkelaqaouhhhrrto.supabase.co/functions/v1/gemini-calorie-estimation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getSessionJWT()}`
            },
            body: JSON.stringify({ imagePath: uploadResult.path, name: name, description: description })
        });
    
        const data = await response.json();
    
        console.log("Edge Function response received");
        console.log(data);
    } catch (error) {
        console.error('Error invoking Edge Function:', error);
        throw error;
    }

    // TODO: Insert into the database
}
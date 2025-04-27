import { uploadFileAsync } from "./storage";

export async function handleMealSubmission(photoUri: string, name: string, description: string) {
    const uploadResult = await uploadFileAsync(photoUri);

    if (uploadResult == undefined) {
        throw new Error('Failed to upload photo');
    }

    console.log(`id: ${uploadResult.id}, path: ${uploadResult.path}, fullPath: ${uploadResult.fullPath}`);

    // Invoke the Edge Function
    try {
        const response = await fetch('https://ebvqgkelaqaouhhhrrto.supabase.co/functions/v1/gemini-calorie-estimation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imagePath: uploadResult.fullPath, name: name, description: description })
        });
    
        const data = await response.json();
    
        console.log(data);
    } catch (error) {
        console.error('Error invoking Edge Function:', error);
        throw error;
    }

    // TODO: Insert into the database
}
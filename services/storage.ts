import { supabase } from '~/lib/supabase'

// Upload file using standard upload
export async function uploadFile(file: File) {
    try {
        const { data, error } = await supabase.storage.from('meals').upload(generateFilePath(file.type), file)
        if (error) {
            console.error('Error uploading image:', error);
        }

        return data;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

export function generateFilePath(fileExtension: string = 'jpg'): string {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomString}.${fileExtension}`;
  }
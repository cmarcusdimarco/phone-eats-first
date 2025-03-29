import { supabase } from '~/lib/supabase';
import { Image } from 'react-native-compressor';

// Upload file using standard upload
export async function uploadFile(uri: string) {
    try {
        const { data, error } = await supabase.storage.from('meals')
            .upload(await generateFilePathWithUserId(getFileExtension(uri)), await compressImage(uri));
        if (error) {
            console.error('Error uploading image:', error);
        }

        console.log('Uploaded image:', data);
        return data;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

async function compressImage(uri: string): Promise<string> {;
    return await Image.compress(uri);
}

function getFileExtension(uri: string): string {
    return uri.split('.').pop()?.toLowerCase() || 'jpg';
}

export async function generateFilePathWithUserId(fileExtension: string = 'jpg'): Promise<string> {
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
        throw new Error('Session not found - please try signing in again');
    }

    const timestamp = new Date().toLocaleString('en-GB', {
      year: '2-digit',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/[^\d]/g, '').replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$3$2$1$4$5');
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${userId}/${timestamp}-${randomString}.${fileExtension}`;
  }
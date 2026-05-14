import type { MediaItem } from '~/store/post';

interface UploadResult {
    url: string;
    key: string;
    type: 'image' | 'video';
    mimeType: string;
}

export async function uploadMediaFile(
    item: MediaItem,
    createUploadUrl: (input: {
        fileName: string;
        contentType: string;
        fileType: 'image' | 'video';
    }) => Promise<{ uploadUrl: string; key: string; fileType: string }>,
): Promise<UploadResult> {
    // Step 1: Get the presigned URL from our backend
    const { uploadUrl, key } = await createUploadUrl({
        fileName: item.file.name,
        contentType: item.file.type,
        fileType: item.type,
    });

    // Step 2: Upload the file directly to R2
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: item.file,
        headers: {
            'Content-Type': item.file.type,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to upload ${item.file.name}: ${response.statusText}`);
    }

    // Step 3: Return metadata for DB storage
    return {
        url: uploadUrl.split('?')[0]!, // public URL (strip presigned query params)
        key,
        type: item.type,
        mimeType: item.file.type,
    };
}

export async function uploadAllMedia(
    items: MediaItem[],
    createUploadUrl: (input: {
        fileName: string;
        contentType: string;
        fileType: 'image' | 'video';
    }) => Promise<{ uploadUrl: string; key: string; fileType: string }>,
): Promise<UploadResult[]> {
    if (items.length === 0) return [];

    const results = await Promise.all(
        items.map(item => uploadMediaFile(item, createUploadUrl))
    );

    return results;
}

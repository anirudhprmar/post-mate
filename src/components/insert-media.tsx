import InsertMediaUpload from './insert-media-upload';

async function uploadImageToR2(file: File): Promise<void> {
    // "use server";
    // TODO: generate presigned URL and upload to R2
}

async function uploadVideoToR2(file: File): Promise<void> {
    // "use server";
    // TODO: generate presigned URL and upload to R2
}

export default function InsertMedia() {
    return (
        <InsertMediaUpload
            onImageSelected={uploadImageToR2}
            onVideoSelected={uploadVideoToR2}
        />
    );
}


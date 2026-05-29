"use client";

import InsertMediaUpload from './insert-media-upload';
import { usePostStore } from '~/store/post';

export default function InsertMedia() {
    const addMedia = usePostStore(state => state.addMedia);

    const handleImageSelected = async (file: File) => {
        addMedia([file]);
    };

    const handleVideoSelected = async (file: File) => {
        addMedia([file]);
    };

    return (
        <InsertMediaUpload
            onImageSelected={handleImageSelected}
            onVideoSelected={handleVideoSelected}
        />
    );
}

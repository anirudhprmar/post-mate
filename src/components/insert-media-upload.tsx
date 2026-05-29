"use client";

import { useRef, useState } from 'react';
import { Image, Video } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { usePostStore } from '~/store/post';

interface InsertMediaUploadProps {
    onImageSelected: (file: File) => Promise<void>;
    onVideoSelected: (file: File) => Promise<void>;
}

export default function InsertMediaUpload({ onImageSelected, onVideoSelected }: InsertMediaUploadProps) {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const media = usePostStore(state => state.media);
    const images = media.filter(m => m.type === 'image');
    const videos = media.filter(m => m.type === 'video');

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await onImageSelected(file);
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        await onVideoSelected(file);
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    return (
        <div className="sm:max-w-[600px]">
            <Tabs defaultValue="image" className="w-full flex flex-col">
                <TabsList className="grid w-full h-fit grid-cols-2">
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="video">Video</TabsTrigger>
                </TabsList>

                <TabsContent value="image">
                    <div className="space-y-4">
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-primary/80 transition-colors cursor-pointer"
                            onClick={() => imageInputRef.current?.click()}
                        >
                            <div className="flex flex-col items-center gap-2">
                                {images.length === 0 ? (
                                    <>
                                        <Image className="h-12 w-12 text-gray-400" />
                                        <span className="text-gray-500 font-medium">Click to upload or drag and drop</span>
                                        <span className="text-sm text-gray-400">JPG, PNG, or GIF (max 800x400px)</span>
                                    </>
                                ) : (
                                    <div className="flex flex-wrap gap-2 justify-center w-full">
                                        {images.map(img => (
                                            <img key={img.id} src={img.previewUrl} alt="Preview" className="max-h-32 object-contain rounded-md" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                ref={imageInputRef}
                                accept="image/jpg,image/png,image/gif"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="video">
                    <div className="space-y-4">
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-primary/80 transition-colors cursor-pointer"
                            onClick={() => videoInputRef.current?.click()}
                        >
                            <div className="flex flex-col items-center gap-2">
                                {videos.length === 0 ? (
                                    <>
                                        <Video className="h-12 w-12 text-gray-400" />
                                        <span className="text-gray-500 font-medium">Click to upload or drag and drop</span>
                                        <span className="text-sm text-gray-400">MP4, MOV, or AVI (max 100MB)</span>
                                    </>
                                ) : (
                                    <div className="flex flex-wrap gap-2 justify-center w-full">
                                        {videos.map(v => (
                                            <video key={v.id} src={v.previewUrl} controls className="max-h-32 object-contain rounded-md" />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={videoInputRef}
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="hidden"
                            />

                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

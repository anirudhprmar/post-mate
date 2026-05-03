"use client";

import { useRef, useState } from 'react';
import { Image, Video } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface InsertMediaUploadProps {
    onImageSelected: (file: File) => Promise<void>;
    onVideoSelected: (file: File) => Promise<void>;
}

export default function InsertMediaUpload({ onImageSelected, onVideoSelected }: InsertMediaUploadProps) {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const imagePreviewRef = useRef<HTMLImageElement>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [videoName, setVideoName] = useState<string | null>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (imagePreviewRef.current) {
            imagePreviewRef.current.src = URL.createObjectURL(file);
            imagePreviewRef.current.style.display = 'block';
        }

        setImageName(file.name);
        await onImageSelected(file);
    };

    const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const videoUrl = URL.createObjectURL(file);
        if (videoPreviewRef.current) {
            videoPreviewRef.current.src = videoUrl;
            videoPreviewRef.current.style.display = 'block';
            videoPreviewRef.current.load();
        }
        setVideoName(file.name);
        await onVideoSelected(file);
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
                                {!imageName ?
                                    <>
                                        <Image className="h-12 w-12 text-gray-400" />
                                        <span className="text-gray-500 font-medium">Click to upload or drag and drop</span>
                                        <span className="text-sm text-gray-400">JPG, PNG, or GIF (max 800x400px)</span>
                                    </>
                                    : <span className="text-sm text-primary font-medium">{imageName}</span>}
                            </div>

                            <input
                                type="file"
                                ref={imageInputRef}
                                accept="image/jpg,image/png,image/gif"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {imageName && <img id="imagePreview" ref={imagePreviewRef} className="w-40 h-40 flex items-center justify-center m-auto" />}
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
                                {!videoName ? <>
                                    <Video className="h-12 w-12 text-gray-400" />
                                    <span className="text-gray-500 font-medium">Click to upload or drag and drop</span>
                                    <span className="text-sm text-gray-400">MP4, MOV, or AVI (max 100MB)</span>
                                </>
                                    : <span className="text-sm text-primary font-medium">{videoName}</span>}
                            </div>
                            <input
                                type="file"
                                ref={videoInputRef}
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="hidden"
                            />
                            <video id="videoPreview" controls ref={videoPreviewRef} style={{ display: 'none' }} className='w-70 h-40 flex items-center justify-center m-auto ' />

                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

"use client"

import { X, User, Loader2 } from "lucide-react";
import { useState } from "react";
import InsertMedia from "./insert-media";
import { PostEditor } from "./post-editor";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import { usePostStore } from "~/store/post";
import Image from "next/image";
import { XIcon, LinkedInIcon, FacebookIcon, InstagramIcon, ThreadsIcon, YouTubeIcon } from "~/lib/platform-icons";
import { uploadAllMedia } from "~/lib/upload-media";

const platformIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    twitter: XIcon,
    linkedin: LinkedInIcon,
    facebook: FacebookIcon,
    instagram: InstagramIcon,
    threads: ThreadsIcon,
    youtube: YouTubeIcon,
};

export default function PostContent() {
    const { data: connectedAccounts = [], isLoading } = api.connectedAccount.getAll.useQuery();
    const content = usePostStore(state => state.content);
    const selectedAccountIds = usePostStore(state => state.selectedAccountIds);
    const toggleAccount = usePostStore(state => state.toggleAccount);
    const media = usePostStore(state => state.media);
    const removeMedia = usePostStore(state => state.removeMedia);
    const clearMedia = usePostStore(state => state.clearMedia);

    const [userSelectedPreviewId, setUserSelectedPreviewId] = useState<string | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);

    const createPost = api.post.createPost.useMutation();
    const createUploadUrl = api.media.createUploadUrl.useMutation();
    const confirmUpload = api.media.confirmUpload.useMutation();
    const confirmStatus = api.post.confirmStatus.useMutation();

    const handlePublish = async (mode: 'draft' | 'schedule') => {
        if (selectedAccountIds.length === 0) return;

        setIsPublishing(true);
        setPublishError(null);

        try {
            const post = await createPost.mutateAsync({
                content: content,
            });
            const postId = post.id;

            if (media.length > 0) {
                const uploadedMedia = await uploadAllMedia(
                    media,
                    (input) => createUploadUrl.mutateAsync(input),
                );

                await confirmUpload.mutateAsync({
                    postId,
                    media: uploadedMedia,
                });
            }

            await confirmStatus.mutateAsync({
                postId,
                status: mode === 'schedule' ? 'scheduled' : 'draft',
            });
            clearMedia();
        } catch (err) {
            setPublishError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsPublishing(false);
        }
    };

    const selectedAccounts = connectedAccounts.filter(ca => selectedAccountIds.includes(ca.id));

    const activePreviewId = selectedAccountIds.includes(userSelectedPreviewId as string)
        ? userSelectedPreviewId
        : (selectedAccounts[0]?.id ?? null);

    const activePreviewAccount = selectedAccounts.find(a => a.id === activePreviewId);

    return (
        <div className="flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="font-bold mb-2">Your Post</p>

                    <div className="space-y-4">
                        {/* accounts available  */}
                        <div>
                            <p className="text-sm font-medium mb-2">Accounts</p>
                            <div className="flex flex-wrap gap-1">
                                {isLoading ? (
                                    <div className="h-8 w-24 bg-muted animate-pulse rounded-full"></div>
                                ) : connectedAccounts.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No accounts connected.</p>
                                ) : (
                                    connectedAccounts.map(account => {
                                        const isSelected = selectedAccountIds.includes(account.id);
                                        return (
                                            <button
                                                key={account.id}
                                                onClick={() => toggleAccount(account.id)}
                                                className={`flex justify-center items-center rounded-full border-2 p-0.5 relative transition-colors ${isSelected ? "border-primary" : "border-transparent hover:border-border"}`}
                                            >
                                                {account.avatarUrl ? (
                                                    <>
                                                        <Image src={account.avatarUrl} alt={account.username} width={32} height={32} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />

                                                    </>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-primary" />
                                                    </div>
                                                )}
                                                {(() => {
                                                    const Icon = platformIcons[account.platform.toLowerCase()];
                                                    if (!Icon) return null;
                                                    return (
                                                        <div className="absolute -bottom-1 -right-1 bg-black/80 text-white rounded-full p-[3px]">
                                                            <Icon className="w-2.5 h-2.5" />
                                                        </div>
                                                    );
                                                })()}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="rounded-md p-3 bg-muted/70 flex flex-col gap-2">
                            <InsertMedia />

                            {media.length > 0 && (
                                <div className="flex flex-wrap gap-2 py-2">
                                    {media.map(m => (
                                        <div key={m.id} className="relative group w-20 h-20 rounded-md overflow-hidden bg-card border">
                                            {m.type === 'image' ? (
                                                <img src={m.previewUrl} alt="Media" className="w-full h-full object-cover" />
                                            ) : (
                                                <video src={m.previewUrl} className="w-full h-full object-cover" />
                                            )}
                                            <button
                                                onClick={() => removeMedia(m.id)}
                                                className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <PostEditor />
                        </div>

                    </div>

                </div>
                <div className="border-l pl-3 flex flex-col">
                    <p className="font-bold mb-2">Post Preview</p>
                    <div className="flex flex-col gap-4">
                        {selectedAccounts.length === 0 ? (
                            <div className="bg-muted rounded-sm p-3 text-center py-8 border border-dashed">
                                <p className="text-muted-foreground text-sm">Select an account to preview your post.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                    {selectedAccounts.map(account => (
                                        <button
                                            key={account.id}
                                            onClick={() => setUserSelectedPreviewId(account.id)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activePreviewId === account.id
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                                }`}
                                        >
                                            {account.avatarUrl ? (
                                                <Image src={account.avatarUrl} alt={account.username} width={16} height={16} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-3 h-3 text-primary" />
                                                </div>
                                            )}
                                            <span className="capitalize">{account.platform}</span>
                                        </button>
                                    ))}
                                </div>

                                {activePreviewAccount && (
                                    <div className="border rounded-md p-4 bg-card shadow-sm">
                                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
                                            {activePreviewAccount.avatarUrl ? (
                                                <Image src={activePreviewAccount.avatarUrl} alt={activePreviewAccount.username} width={32} height={32} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                                                    <User className="w-4 h-4 text-primary" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-sm leading-none">{activePreviewAccount.username}</p>
                                                <p className="text-xs text-muted-foreground mt-1 capitalize">{activePreviewAccount.platform}</p>
                                            </div>
                                        </div>
                                        <div
                                            className="text-sm max-w-none whitespace-pre-wrap break-words tiptap [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                                            dangerouslySetInnerHTML={{ __html: content || (media.length === 0 ? '<span class="text-muted-foreground italic">Write something to preview...</span>' : '') }}
                                        />
                                        {media.length > 0 && (
                                            <div className="mt-4 grid grid-cols-2 gap-2">
                                                {media.map(m => (
                                                    <div key={m.id} className="relative aspect-square sm:aspect-video rounded-md overflow-hidden bg-muted">
                                                        {m.type === 'image' ? (
                                                            <img src={m.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <video src={m.previewUrl} controls className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-end items-center mt-6 gap-2" >
                {publishError && (
                    <p className="text-sm text-destructive mr-auto">{publishError}</p>
                )}
                <Button
                    variant={"secondary"}
                    disabled={isPublishing}
                    onClick={() => handlePublish('draft')}
                >
                    {isPublishing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save as Draft
                </Button>
                <Button
                    variant={'default'}
                    disabled={isPublishing || selectedAccountIds.length === 0}
                    onClick={() => handlePublish('schedule')}
                >
                    {isPublishing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Schedule
                </Button>
            </div>
        </div >
    )
}

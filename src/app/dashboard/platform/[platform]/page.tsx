export default async function PlatformPage({ params }: { params: Promise<{ platform: string }> }) {
    const { platform } = await params;
    return (
        <div>page - {platform.toUpperCase()}</div>
    )
}

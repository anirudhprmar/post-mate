import React from 'react'

export default function PostLayout({ children, format }: { children: React.ReactNode, format: string }) {
    return (
        <>
            <h2 className="text-xl">{format}</h2>
            {children}
        </>
    )
}

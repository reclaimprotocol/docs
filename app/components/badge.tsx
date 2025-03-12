import React from 'react';

export type BadgeProps = { href: string, imgSrc: string, alt: string }

export function Badge({ href, imgSrc, alt }: BadgeProps) {
    return (
        <a href={href} rel="noreferrer noopener" target="_blank">
            <img alt={alt} loading="lazy" decoding="async" data-nimg="1" style={{ color: 'transparent' }} src={imgSrc}>
            </img>
        </a>
    )
}

export function BadgeGroup({ badges }: { badges: BadgeProps[] }) {
    return (
        <div className="flex flex-row flex-wrap gap-2">
            {badges.map((badge) => <Badge key={`${badge.imgSrc}-${badge.href}-${badge.alt}`} {...badge} />)}
        </div>
    )
}

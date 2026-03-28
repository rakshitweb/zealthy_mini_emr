export const View = ({ className, height = 16, width = 16 }: { className?: string; height?: number; width?: number }) => {
    return <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
}
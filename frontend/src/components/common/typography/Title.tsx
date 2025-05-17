interface TitleProps {
    className?: string;
    children: React.ReactNode;
}

function Title({ className = '', children }: TitleProps) {
    return (
        <p className={`text-2xl font-bold ${className}`}>{children}</p>
    );
}

export default Title
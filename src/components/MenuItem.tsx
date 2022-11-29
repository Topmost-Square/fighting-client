type MenuItemProps = {
    name: string,
    top?: boolean
}

export const MenuItem = ({ name, top }: MenuItemProps) => {
    const topStyles = top ? 'mt-10' : '';
    const styles = 'w-1/2 h-1/6 bg-violet-300 mb-10 flex flex-col items-center justify-center';
    const hoverStyles = 'hover:bg-violet-500 hover:drop-shadow-2xl';
    return <div className={[topStyles, styles, hoverStyles].join(' ')}>{name}</div>
}
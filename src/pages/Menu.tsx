import {MenuItem} from "../components/MenuItem";

export const Menu = () => {
    return (
        <div className='flex flex-col items-center h-screen'>
            <MenuItem name='Practice' top={true} />
            <MenuItem name='Online' />
            <MenuItem name='Inventory' />
            <MenuItem name='Settings' />
            <MenuItem name='Exit' />
        </div>
    );
}
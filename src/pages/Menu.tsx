import {MenuItem} from "../components/MenuItem";
import {removeToken} from "../utils/auth";

export const Menu = () => {
    const exit = () => {
        removeToken();
        document.location.reload();
    }

    return (
        <div className='flex flex-col items-center h-screen'>
            <MenuItem name='Practice' top={true} />
            <MenuItem name='Online' />
            <MenuItem name='Inventory' />
            <MenuItem name='Settings' />
            <MenuItem name='Exit' click={exit}/>
        </div>
    );
}

import BlackDeadLeft from '../images/dead/black/left.png';
import BlackDeadRight from '../images/dead/black/right.png';

import PurpleDeadLeft from '../images/dead/purple/left.png';
import PurpleDeadRight from '../images/dead/purple/right.png';

import RedDeadLeft from '../images/dead/red/left.png';
import RedDeadRight from '../images/dead/red/right.png';

import GreenDeadLeft from '../images/dead/green/left.png';
import GreenDeadRight from '../images/dead/green/right.png';

import BlueDeadLeft from '../images/dead/blue/left.png';
import BlueDeadRight from '../images/dead/blue/right.png';

export const painterFile = (name: string|null) => {
    switch (name) {
        case 'black-dead-left':
            return BlackDeadLeft;
        case 'black-dead-right':
            return BlackDeadRight;
        case 'purple-dead-left':
            return PurpleDeadLeft;
        case 'purple-dead-right':
            return PurpleDeadRight;
        case 'red-dead-left':
            return RedDeadLeft;
        case 'red-dead-right':
            return RedDeadRight;
        case 'green-dead-left':
            return GreenDeadLeft;
        case 'green-dead-right':
            return GreenDeadRight;
        case 'blue-dead-left':
            return BlueDeadLeft;
        case 'blue-dead-right':
            return BlueDeadRight;
        default:
            return BlackDeadLeft;
    }
};

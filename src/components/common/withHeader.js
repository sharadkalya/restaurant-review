/* eslint func-names: 0 */

import { Header } from "./Header";

export const withHeader = (WrappedComponent) => {
    return function (props) {
        return (
            <div className='with-header-wrapper'>
                <Header />
                <WrappedComponent
                    {...props}
                />
            </div>
        );
    };
};

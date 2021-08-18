import { useContext } from "react";
import { AuthContext } from "../../Auth";
import { DataProvider } from "../../DataProvider";
import { Header } from "../common";
import Listing from "./Listing";

export default function ListingComponent() {
    const contextValue = useContext(AuthContext);
    const dataProvider = useContext(DataProvider);

    return (
        <div>
            <Header />
            <div className='main-content'>
                <Listing
                    currentUser={contextValue.currentUser}
                    dataProvider={dataProvider}
                />
            </div>
        </div>
    );
}

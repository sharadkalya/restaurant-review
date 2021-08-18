import { useContext } from "react";
import { Redirect } from "react-router";
import { AuthContext } from "../../Auth";
import { ADMIN } from "../../constants";
import { UserManagement } from "./UserManagement";

export default function ManageUsers() {
    const authContext = useContext(AuthContext);

    if (authContext.currentUser.role !== ADMIN) {
        return <Redirect
            to='/'
        />;
    }
    return <UserManagement />;
}

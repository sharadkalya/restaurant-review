import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ADMIN } from "../../constants";
import { deleteUsersApi, getUsers, updateUsersApi } from "../../firebase/api";
import { FullScreenLoader, Header, Toast } from "../common";

const columns = [
    {
        editable: true,
        field: 'first',
        headerName: 'First',
        width: 130
    },
    {
        editable: true,
        field: 'last',
        headerName: 'Last',
        width: 130
    },
    {
        editable: true,
        field: 'role',
        headerName: 'Role',
        width: 130
    },
    {
        editable: false,
        field: 'email',
        headerName: 'Email',
        width: 200
    }
];

export const UserManagement = () => {

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [updateUsers, setUpdateUsers] = useState({});
    const [snapshot, setSnapshot] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersSnapshot = await getUsers();
            const usersData = usersSnapshot.docs.map(doc => {
                const items = doc.data();
                return { ...items, id: doc.id };
            });
            setSnapshot(usersSnapshot);
            if (usersData) {
                setRows(usersData);
            }
        } catch (error) {
            setUpdateSuccess(false);
            setShowFeedback(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onSelectionModelChange = (selectedRows) => {
        setSelectedUsers(selectedRows);
    };

    const onCellEditCommit = (editData) => {
        const item = {
            [editData.field]: editData.value
        };

        const obj = updateUsers[editData.id];

        if (obj) {
            setUpdateUsers({
                ...updateUsers,
                [editData.id]: {
                    ...obj,
                    ...item
                }
            });
        } else {
            setUpdateUsers({
                ...updateUsers,
                [editData.id]: item
            });
        }
    };

    const update = async () => {
        setLoading(true);
        try {
            await updateUsersApi(updateUsers);

            setUpdateUsers({});
            setUpdateSuccess(true);
            setShowFeedback(true);
        } catch {
            setUpdateSuccess(false);
            setShowFeedback(true);
        } finally {
            setLoading(false);
        }
    };

    const deleteUsers = async () => {
        setLoading(true);
        try {
            await deleteUsersApi(selectedUsers, snapshot);
            const selectedUsersReplica = [...selectedUsers];
            const newRows = rows.filter((row) => !selectedUsersReplica.includes(row.id));
            setRows(newRows);
            setSelectedUsers([]);
            setUpdateSuccess(true);
            setShowFeedback(true);
        } catch {
            setUpdateSuccess(false);
            setShowFeedback(true);
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = (params) => params.row.role !== ADMIN;

    return (
        <div>
            <Header />
            <div className='below-header'>
                <div className='link-container'>
                    <Link
                        to={{
                            pathname: '/',
                            state: {}
                        }}
                    >
                        View All Restaurants
                    </Link>
                </div>
                <div className='user-mgmt-btns-wrapper'>
                    <Button
                        color="primary"
                        disabled={Object.keys(updateUsers).length === 0}
                        onClick={update}
                        variant="contained"
                    >
                        Update
                    </Button>
                    <Button
                        color="secondary"
                        disabled={Object.keys(selectedUsers).length === 0}
                        onClick={deleteUsers}
                        variant="contained"
                    >
                        Delete
                    </Button>
                </div>
                <div className='datagrid-container'>
                    <DataGrid
                        checkboxSelection
                        columns={columns}
                        disableSelectionOnClick
                        isCellEditable={isAdmin}
                        isRowSelectable={isAdmin}
                        onCellEditCommit={onCellEditCommit}
                        onSelectionModelChange={onSelectionModelChange}
                        pageSize={5}
                        rows={rows}
                    />
                    <FullScreenLoader
                        isVisible={loading}
                    />
                </div>
                <Toast
                    errorMsg='Error in updating/loading users'
                    setShowFeedback={setShowFeedback}
                    showFeedback={showFeedback}
                    success={updateSuccess}
                    successMsg='Users updated successfully'
                />
            </div>
        </div>
    );
};

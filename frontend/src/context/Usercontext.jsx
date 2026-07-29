import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
    const serverUrl = "http://localhost:8000";
    const [userData, setUserData] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // fetch the current user using whatever accessToken we have
    const handleCurrentUser = async (token) => {
        try {
            const response = await axios.get(
                `${serverUrl}/user/get-me`,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUserData(response.data.user);
        } catch (error) {
            console.error(error.response?.data || error.message);
            setUserData(null);
        }
    };

    // on first load, there's no accessToken in memory yet (page was refreshed)
    // so use the refresh cookie to mint a fresh one
    const bootstrapSession = async () => {
        try {
            const res = await axios.get(`${serverUrl}/auth/refresh-token`, {
                withCredentials: true,
            });
            const token = res.data.accesstoken;
            setAccessToken(token);
            await handleCurrentUser(token);
        } catch (error) {
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        bootstrapSession();
    }, []);

    const value = {
        serverUrl,
        userData,
        setUserData,
        accessToken,
        setAccessToken,
        handleCurrentUser,
        loading,
    };

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
};

export default UserContext;
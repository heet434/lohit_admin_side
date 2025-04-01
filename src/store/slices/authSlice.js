import { createSlice } from '@reduxjs/toolkit';

const loadState = (key, defaultValue) => {
    try {
        const serializedState = sessionStorage.getItem(key);
        if (serializedState === null) {
            return defaultValue;
        };
        return JSON.parse(serializedState);
    } catch (err) {
        console.log("Error loading state");
        return undefined;
    }
};

const saveState = (key,obj) => {
    try {
        sessionStorage.setItem(key, JSON.stringify(obj));
    } catch {
        console.log("Error saving state");
    }
};

const authSlice = createSlice({
    name: 'authLohitAdmin',
    initialState: {
        token: loadState('token', null),
        role: loadState('role', null),
        name: loadState('name', null),
        email: loadState('email', null),
        phone: loadState('phone', null),
        deliverymanId: loadState('deliverymanId', null),
    },
    reducers: {
        loginAdmin(state, action) {
            state.token = action.payload.token;
            state.role = "admin";
            state.email = action.payload.email;
            saveState('authLohitAdmin', state);
        },
        loginDelivery(state, action) {
            state.token = action.payload.token;
            state.role = "delivery";
            state.phone = action.payload.phone;
            state.deliverymanId = action.payload.deliverymanId;
            state.name = action.payload.name;
            saveState('authLohitAdmin', state);
        },
        logout(state) {
            state.token = null;
            state.role = null;
            state.name = null;
            state.email = null;
            state.phone = null;
            state.deliverymanId = null;
            saveState('authLohitAdmin', state);
        }
    },
});

export const authActions = authSlice.actions;
export default authSlice;
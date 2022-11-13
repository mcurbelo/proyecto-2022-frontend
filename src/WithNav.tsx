import React from 'react';
import MainHeader from './components/MainHeader';
import { Outlet } from 'react-router';

export default () => {
    return (
        <>
            <MainHeader />
            <Outlet />
        </>
    );
};
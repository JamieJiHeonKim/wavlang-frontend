import React from 'react';
import Navbar from './Navbar/Navbar';
import Footer from '../sections/Footer/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar />
        <main>
          <Outlet /> {/* Nested routes will render here */}
        </main>
      <Footer />
    </>
  );
};

export default Layout;

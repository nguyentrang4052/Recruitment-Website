import { Outlet } from 'react-router-dom';
import Header from './Header/Header.jsx';
import Footer from './Footer/Footer.jsx';
import HomePage from './Pages/HomePage/HomePage.jsx';
import { Breadcrumb } from './Breadcrumb/Breadcrumb.jsx';
import { useLocation } from 'react-router-dom';


const LayoutWithHeader = () => {
  const location = useLocation(); 

  return (
    <>
      <Header />
      {location.pathname !== '/dashboard' && <Breadcrumb />}
      {/* <Breadcrumb/> */}
      <Outlet /> 
      <Footer />
    </>
  );
};


const LayoutWithHomePage = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  return (
    <>
      {token ? (
        <>
          <Header />
          {(location.pathname.startsWith('/recruitment/') || location.pathname.startsWith('/companies') || location.pathname == ('/about') || location.pathname == ('/cv-templates'))&& <Breadcrumb />}

       
          <Outlet />
          <Footer />
        </>
      ) : (
        <>
          <HomePage />
          {location.pathname !== '/' &&  location.pathname !== '/applicant-login' && location.pathname !== '/dashboard' && <Breadcrumb />}
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
};

export { LayoutWithHeader, LayoutWithHomePage };



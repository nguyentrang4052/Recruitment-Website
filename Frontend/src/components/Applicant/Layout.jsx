import { Outlet } from 'react-router-dom';
import Header from './Header/Header.jsx';
import Footer from './Footer/Footer.jsx';
import HomePage from './Pages/HomePage/HomePage.jsx';
import { Breadcrumb } from './Breadcrumb/Breadcrumb.jsx';
import { useLocation } from 'react-router-dom';

// Layout với Header
// const LayoutWithHeader = () => (

//   <>
//     <Header />
//     <Breadcrumb /> 
//     <Outlet /> 
//     <Footer />
//   </>
// );
const LayoutWithHeader = () => {
  const location = useLocation(); 

  return (
    <>
      <Header />
      {location.pathname !== '/dashboard' && <Breadcrumb />}
      <Outlet /> 
      <Footer />
    </>
  );
};

// const LayoutWithHomePage = () => {

//   const location = useLocation(); 

//   return (
//     <>
//       <HomePage />
//       {location.pathname == '/recruitment/:rnid' && <Breadcrumb />}
//       <Outlet /> 
//       <Footer />
//     </>
//   );
// };
const LayoutWithHomePage = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  // const isLoggedIn = token && !isTokenExpired(token);

  return (
    <>
      {token ? (
        <>
          <Header />
          {location.pathname.startsWith('/recruitment/') && <Breadcrumb />}
          <Outlet />
          <Footer />
        </>
      ) : (
        <>
          <HomePage />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
};

export { LayoutWithHeader, LayoutWithHomePage };



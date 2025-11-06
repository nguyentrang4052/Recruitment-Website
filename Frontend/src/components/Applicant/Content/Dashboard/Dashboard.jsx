import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Header from "./../../Header/Header.jsx";
import Sidebar from './../../Sidebar/Sidebar.jsx';
import Setting from "./../Setting/Setting.jsx";
import Notice from "./../Notice/Notice.jsx";
import Profile from "./../Profile/Profile.jsx";

function Dashboard() {
  const [page, setPage] = useState("profile"); 

  const navigate = useNavigate();
  const handleLogoutClick = () => {
    navigate('/');
  }

  const renderContent = () => {
    switch (page) {
      case "profile":
        return <Profile />;
      case "save-jobs":
          return <h2>Việc làm đã ứng tuyển</h2>;
      case "loved-jobs":
          return <h2>Việc làm yêu thích</h2>;
      case "notifications":
        return <Notice />;
      case "companies":
        return <h2>Nhà tuyển dụng của tôi</h2>;
      case "settings":
        return <Setting />;
      case "logout":
        return handleLogoutClick();
      default:
        return <h2>Chào mừng bạn đến với website của chúng tôi</h2>;
    }
  };

  return (
    <div>
      <Header />
      <div>
        <Sidebar onSelect={(page) => setPage(page)} /> 
        {renderContent()}
      </div>
    </div>
  )
}

export default Dashboard;

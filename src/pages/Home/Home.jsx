import { useSelector } from "react-redux";
import Dashboard from "../dashboard/Dashboard";
import LoginScreen from '../Login/Login'

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const getDashboard = () => {
    switch(user.role) {
      case 'superadmin':
        return <Dashboard />;
      // case 'dealer':
      //   return <DealerDashboard />;
      default:
        return <LoginScreen />;
    }
  };
  return (
    <div className="home-container">
      {getDashboard()}
    </div>
  );
};
export default Home;
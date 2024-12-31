import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Detail from './pages/Detail';
import DetailDummy from './pages/Detail-dummy';
import { SectionProvider } from './utils/SectionContext';
import { OktaAuth } from '@okta/okta-auth-js';
import { Security, LoginCallback,SecureRoute } from '@okta/okta-react';
import { oktaConfig } from './oktaConfig';
import ProtectedRoute from './ProtectedRoute ';
//require('dotenv').config()

const oktaAuth = new OktaAuth(oktaConfig);
function App() {
  const navigate = useNavigate();
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    navigate(originalUri || "/",{ replace: true });
  };
  const LayoutWithHeader = (component) => {
    return (
      <SectionProvider>
      <div className='main'>
        <Header />
        <main className='mainContainer'>
          <div className='mainArea' style={{ height: 'calc(100vh - 110px)', overflowY: 'auto', backgroundColor: '#F5F5F5', margin: '3px 0 0' }}>
            {component}
          </div>
        </main>
        <Footer />
      </div>
      </SectionProvider>
    );
  }

  const Layout = (props) => {
    switch (props.component) {
      case "login":
        return <Login />
      case "dashboard":
        return LayoutWithHeader(<Dashboard />)
      case "history":
          return LayoutWithHeader(<History />)
      case "detail":
            return LayoutWithHeader(<Detail />)
      default:
        return <div>Component not found</div>
    }
  }

  return (
    <>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} >
        <Routes>
          <Route exact path="/" element={<Layout component="login" />} />
          <Route  exact path="/dashboard"  element={<ProtectedRoute component={<Layout component="dashboard" />} />} />
          <Route  exact path="/history" element={<ProtectedRoute component={<Layout component="history" />} />} />
          <Route  exact path="/detail"  element={<ProtectedRoute component={<Layout component="detail" />} />} />
          <Route path="/login/callback" element={<LoginCallback />} />
          <Route path="*"  element={<Layout component="login" />} />
        </Routes>
        </Security>
    </>
  );
}
const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;

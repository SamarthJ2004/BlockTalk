import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MainContent from './MainContent';
import '../App.css'

const MainPage = () => {
  return (
    <div className="app">
      <Sidebar />
      <MainContent />
      <RightSidebar />
    </div>
  )
}

export default MainPage;

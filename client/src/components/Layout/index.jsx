import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flexGrow: 1, marginLeft: 220 }}>
        <Navbar />
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;

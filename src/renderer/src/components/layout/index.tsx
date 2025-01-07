import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import DeviceStatus from "@renderer/components/widget/device-status";
import Frequency from "../widget/frequency";
import SelectMode from "../widget/select-mode";
import AnalyticsReport from "../widget/analytics-report";

const Layout = (): JSX.Element => {
  return (
    <div className="flex">
      <Header />
      <Sidebar />
      <div className="h-screen max-h-screen w-full space-y-5 overflow-y-auto p-5">
        <h1 className="text-3xl font-bold"> Setting</h1>
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
          <Frequency />
          <SelectMode />
        </div>
        <Outlet />
        {/* <AnalyticsReport /> */}
      </div>
      <DeviceStatus />
    </div>
  );
};
export default Layout;

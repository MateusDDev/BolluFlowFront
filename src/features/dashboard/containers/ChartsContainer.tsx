import EntriesChart from "@/features/dashboard/components/organisms/EntriesChart";
import DashboardPieChart from "@/features/dashboard/components/organisms/DashboardPieChart";

const ChartsContainer = () => {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
      <div className="p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <EntriesChart />
      </div>
      <div className="p-4 rounded-lg">
        <DashboardPieChart />
      </div>
      <div className="p-4 rounded-lg"></div>
      <div className="p-4 rounded-lg"></div>
      <div className="p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2"></div>
      <div className="p-4 rounded-lg"></div>
    </section>
  );
};

export default ChartsContainer;

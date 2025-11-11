import { CampaignSidebar } from "@/components/CampaignSidebar";
import { CampaignTable } from "@/components/CampaignTable";

const Campaigns = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <CampaignSidebar />
      <CampaignTable />
    </div>
  );
};

export default Campaigns;

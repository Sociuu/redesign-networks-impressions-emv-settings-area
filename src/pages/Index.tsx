import NetworksSettings from "@/components/NetworksSettings";

const TABS = [
  "General Settings",
  "Email settings",
  "Self Signup",
  "Authentication",
  "UTM",
  "Networks & Impressions",
  "Social Integrations",
  "Content Hub",
  "SociuuHub",
  "Send-out Settings",
  "Distribution Channels",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b bg-card px-6 pt-8 pb-0">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Settings</h1>
        {/* Tabs */}
        <nav className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-t-md transition-colors ${
                tab === "Networks & Impressions"
                  ? "bg-background text-foreground border border-b-0 border-border -mb-px"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <NetworksSettings />
      </div>
    </div>
  );
};

export default Index;

import { useState, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  RotateCcw,
  Save,
  HelpCircle,
  DollarSign,
  Facebook,
  Instagram,
  Linkedin,
  Info,
  Save,
  HelpCircle,
  DollarSign,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

// --- Types ---
interface NetworkField {
  value: string;
  isCustom: boolean;
  isCurrencyBound: boolean;
}

interface NetworkRow {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  fields: Record<string, NetworkField>;
}

type FieldKey = "click" | "impressions" | "videoCount" | "cpm" | "reactions" | "comments";

const FIELD_LABELS: Record<FieldKey, { label: string; isCurrencyBound: boolean }> = {
  click: { label: "Click", isCurrencyBound: true },
  impressions: { label: "Impressions", isCurrencyBound: false },
  videoCount: { label: "Video Count", isCurrencyBound: true },
  cpm: { label: "CPM", isCurrencyBound: true },
  reactions: { label: "Reactions", isCurrencyBound: true },
  comments: { label: "Comments", isCurrencyBound: true },
};

const CURRENCIES = [
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "DKK", label: "DKK (kr)", symbol: "kr" },
  { value: "SEK", label: "SEK (kr)", symbol: "kr" },
  { value: "NOK", label: "NOK (kr)", symbol: "kr" },
];

const NetworkIcon = ({ name }: { name: string }) => {
  const iconClass = "h-5 w-5";
  const wrapperClass =
    "flex h-8 w-8 items-center justify-center rounded-full";

  switch (name) {
    case "Facebook":
      return (
        <span className={`${wrapperClass} bg-[hsl(220,46%,48%)]`}>
          <Facebook className={`${iconClass} text-primary-foreground`} />
        </span>
      );
    case "Instagram":
      return (
        <span className={`${wrapperClass} bg-gradient-to-br from-[hsl(37,97%,60%)] via-[hsl(340,75%,55%)] to-[hsl(280,70%,50%)]`}>
          <Instagram className={`${iconClass} text-primary-foreground`} />
        </span>
      );
    case "LinkedIn":
      return (
        <span className={`${wrapperClass} bg-[hsl(210,80%,42%)]`}>
          <Linkedin className={`${iconClass} text-primary-foreground`} />
        </span>
      );
    default:
      return (
        <span className={`${wrapperClass} bg-muted`}>
          <span className="text-xs font-semibold text-muted-foreground">
            {name.charAt(0)}
          </span>
        </span>
      );
  }
};

const makeField = (value: string, isCurrencyBound: boolean, isCustom = false): NetworkField => ({
  value,
  isCustom,
  isCurrencyBound,
});

const INITIAL_NETWORKS: NetworkRow[] = [
  {
    id: "facebook",
    name: "Facebook",
    icon: <NetworkIcon name="Facebook" />,
    enabled: true,
    fields: {
      click: makeField("1,406", true),
      impressions: makeField("38", false),
      videoCount: makeField("0.0152", true),
      cpm: makeField("N/A", true),
      reactions: makeField("N/A", true),
      comments: makeField("N/A", true),
    },
  },
  {
    id: "x",
    name: "X",
    icon: <NetworkIcon name="X" />,
    enabled: false,
    fields: {
      click: makeField("1.14", true),
      impressions: makeField("76", false),
      videoCount: makeField("N/A", true),
      cpm: makeField("N/A", true),
      reactions: makeField("N/A", true),
      comments: makeField("N/A", true),
    },
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <NetworkIcon name="LinkedIn" />,
    enabled: true,
    fields: {
      click: makeField("5.0388", true, true),
      impressions: makeField("313", false),
      videoCount: makeField("0.038", true),
      cpm: makeField("18.32", true, true),
      reactions: makeField("0.84", true, true),
      comments: makeField("3.74", true, true),
    },
  },
  {
    id: "xing",
    name: "Xing",
    icon: <NetworkIcon name="Xing" />,
    enabled: false,
    fields: {
      click: makeField("5.32", true),
      impressions: makeField("0", false),
      videoCount: makeField("N/A", true),
      cpm: makeField("N/A", true),
      reactions: makeField("N/A", true),
      comments: makeField("N/A", true),
    },
  },
  {
    id: "ok",
    name: "Ok",
    icon: <NetworkIcon name="Ok" />,
    enabled: false,
    fields: {
      click: makeField("0.4788", true),
      impressions: makeField("0", false),
      videoCount: makeField("N/A", true),
      cpm: makeField("N/A", true),
      reactions: makeField("N/A", true),
      comments: makeField("N/A", true),
    },
  },
  {
    id: "vk",
    name: "Vk",
    icon: <NetworkIcon name="Vk" />,
    enabled: false,
    fields: {
      click: makeField("0.4788", true),
      impressions: makeField("0", false),
      videoCount: makeField("N/A", true),
      cpm: makeField("N/A", true),
      reactions: makeField("N/A", true),
      comments: makeField("N/A", true),
    },
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <NetworkIcon name="Instagram" />,
    enabled: false,
    fields: {
      click: makeField("0.608", true),
      impressions: makeField("190", false),
      videoCount: makeField("N/A", true),
      cpm: makeField("N/A", true),
      reactions: makeField("N/A", true),
      comments: makeField("N/A", true),
    },
  },
];

const FIELD_KEYS: FieldKey[] = ["click", "impressions", "videoCount", "cpm", "reactions", "comments"];

export default function NetworksSettings() {
  const [networks, setNetworks] = useState<NetworkRow[]>(INITIAL_NETWORKS);
  const [currency, setCurrency] = useState("EUR");
  const [hasChanges, setHasChanges] = useState(false);

  const toggleNetwork = useCallback((id: string) => {
    setNetworks((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
    setHasChanges(true);
  }, []);

  const updateField = useCallback((networkId: string, fieldKey: string, value: string) => {
    setNetworks((prev) =>
      prev.map((n) =>
        n.id === networkId
          ? {
              ...n,
              fields: {
                ...n.fields,
                [fieldKey]: { ...n.fields[fieldKey], value, isCustom: true },
              },
            }
          : n
      )
    );
    setHasChanges(true);
  }, []);

  const resetField = useCallback((networkId: string, fieldKey: string) => {
    const original = INITIAL_NETWORKS.find((n) => n.id === networkId);
    if (!original) return;
    setNetworks((prev) =>
      prev.map((n) =>
        n.id === networkId
          ? {
              ...n,
              fields: {
                ...n.fields,
                [fieldKey]: { ...original.fields[fieldKey], isCustom: false },
              },
            }
          : n
      )
    );
    setHasChanges(true);
  }, []);

  const resetAll = useCallback(() => {
    setNetworks(INITIAL_NETWORKS);
    setHasChanges(true);
  }, []);

  const saveSettings = useCallback(() => {
    setHasChanges(false);
    toast.success("Settings saved successfully");
  }, []);

  const handleCurrencyChange = useCallback((val: string) => {
    setCurrency(val);
    setHasChanges(true);
    toast.info(`Currency changed to ${val}. Default values will be recalculated.`);
  }, []);

  const hasAnyCustom = networks.some((n) =>
    Object.values(n.fields).some((f) => f.isCustom)
  );

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Sharable Networks Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure default settings and EMV values for social networks used.
        </p>
      </div>

      {/* Currency selector */}
      <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          <DollarSign className="h-5 w-5 text-accent-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">EMV Currency</p>
          <p className="text-xs text-muted-foreground">
            Changing currency recalculates default values. Custom values remain
            unchanged.
          </p>
        </div>
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* EMV section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Earned Media Values
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <HelpCircle className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                EMV estimates the cost saving of organic reach via employee
                advocacy vs. paid ads. Values marked as "Custom" were set by
                your team.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            Default value
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-custom-indicator" />
            Custom value
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-[180px]">
                Network
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground w-[100px]">
                Active
              </th>
              {FIELD_KEYS.map((key) => (
                <th
                  key={key}
                  className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  <span className="flex items-center gap-1">
                    {FIELD_LABELS[key].label}
                    {FIELD_LABELS[key].isCurrencyBound && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DollarSign className="h-3 w-3 text-muted-foreground/60" />
                        </TooltipTrigger>
                        <TooltipContent>Currency-bound value</TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {networks.map((network) => (
              <tr
                key={network.id}
                className={`transition-colors ${
                  network.enabled
                    ? "bg-card"
                    : "bg-muted/30 opacity-60"
                }`}
              >
                {/* Network name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {network.icon}
                    <span className="text-sm font-medium text-foreground">
                      {network.name}
                    </span>
                  </div>
                </td>

                {/* Toggle */}
                <td className="px-3 py-3 text-center">
                  <Switch
                    checked={network.enabled}
                    onCheckedChange={() => toggleNetwork(network.id)}
                  />
                </td>

                {/* Value fields */}
                {FIELD_KEYS.map((key) => {
                  const field = network.fields[key];
                  const isNA = field.value === "N/A";
                  return (
                    <td key={key} className="px-3 py-3">
                      <div className="relative flex items-center gap-1">
                        {field.isCustom && (
                          <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-full bg-custom-indicator" />
                        )}
                        <Input
                          value={field.value}
                          disabled={!network.enabled || isNA}
                          onChange={(e) =>
                            updateField(network.id, key, e.target.value)
                          }
                          className={`h-8 w-[90px] text-sm ${
                            field.isCustom
                              ? "border-custom-indicator/40 bg-custom-bg"
                              : ""
                          } ${isNA ? "text-muted-foreground" : ""}`}
                        />
                        {field.isCustom && !isNA && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => resetField(network.id, key)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Reset to default</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {hasChanges
            ? "You have unsaved changes"
            : "Changes will apply immediately"}
        </p>
        <div className="flex items-center gap-3">
          {hasAnyCustom && (
            <Button variant="outline" size="sm" onClick={resetAll}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset all to default
            </Button>
          )}
          <Button size="sm" onClick={saveSettings} disabled={!hasChanges}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

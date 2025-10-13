import { Calculator, Moon, Sun, Download, Save, History, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface AppHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const AppHeader = ({ darkMode, onToggleDarkMode }: AppHeaderProps) => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Project Saved",
      description: "Your estimation has been saved to browser storage.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Exporting to PDF",
      description: "Your report is being generated...",
    });
  };

  const handleExportExcel = () => {
    toast({
      title: "Exporting to Excel",
      description: "Your spreadsheet is being generated...",
    });
  };

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Calculator className="w-6 h-6 text-primary" />
          <span className="gradient-text">Cost Estimator Pro</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="hidden sm:flex"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                Export to PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel}>
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            title="View history"
            className="hidden md:flex"
          >
            <History className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

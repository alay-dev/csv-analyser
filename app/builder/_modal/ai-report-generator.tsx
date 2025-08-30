"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataStore } from "@/store/data";
import useCallAgent from "@/hooks/use-call-agent";
import { Brain, FileText, Download, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AIReportGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ReportType = "summary" | "insights" | "detailed" | "custom";

interface ReportOption {
  type: ReportType;
  title: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
}

const reportOptions: ReportOption[] = [
  {
    type: "summary",
    title: "Executive Summary",
    description: "High-level overview of key findings and metrics",
    prompt: "Generate an executive summary report of the data with key insights, main trends, and important metrics. Focus on the most significant findings that would be relevant to business stakeholders.",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    type: "insights",
    title: "Data Insights",
    description: "Deep analysis with patterns and recommendations",
    prompt: "Analyze the data and provide detailed insights including patterns, correlations, anomalies, and actionable recommendations. Include statistical observations and business implications.",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    type: "detailed",
    title: "Detailed Analysis",
    description: "Comprehensive report with all findings",
    prompt: "Create a comprehensive detailed analysis report covering all aspects of the data including descriptive statistics, data quality assessment, trends analysis, and detailed findings with supporting evidence.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    type: "custom",
    title: "Custom Report",
    description: "Specify your own requirements",
    prompt: "",
    icon: <FileText className="h-5 w-5" />,
  },
];

export const AIReportGeneratorModal = ({ open, onOpenChange }: AIReportGeneratorModalProps) => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>("summary");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string>("");
  const [showReport, setShowReport] = useState(false);

  const { fileName, currentTag } = useDataStore();
  const { callAiAgent } = useCallAgent();

  const handleGenerateReport = async () => {
    if (!currentTag?.sessionID) {
      alert("Please upload a CSV file first to generate a report.");
      return;
    }

    setIsGenerating(true);
    setShowReport(false);

    try {
      const selectedOption = reportOptions.find((option) => option.type === selectedReportType);
      const prompt = selectedReportType === "custom" ? customPrompt : selectedOption?.prompt || "";

      if (!prompt.trim()) {
        alert("Please enter a custom prompt for your report.");
        return;
      }

      const { response } = await callAiAgent(prompt);
      setGeneratedReport(response);
      setShowReport(true);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = () => {
    if (!generatedReport) return;

    const blob = new Blob([generatedReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-report-${fileName || "data"}-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setShowReport(false);
    setGeneratedReport("");
    setCustomPrompt("");
    setSelectedReportType("summary");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col" isCloseable={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Report Generator
          </DialogTitle>
          <DialogDescription>
            Generate intelligent reports and insights from your CSV data using AI analysis.
            {fileName && <span className="block mt-1 text-sm font-medium">Data source: {fileName}</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!showReport ? (
            <div className="space-y-6">
              {/* Report Type Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Select Report Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reportOptions.map((option) => (
                    <div
                      key={option.type}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedReportType === option.type ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
                      onClick={() => setSelectedReportType(option.type)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{option.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{option.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Prompt Input */}
              {selectedReportType === "custom" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Report Requirements</label>
                  <Textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="Describe what you want to analyze or include in your report..." className="min-h-[100px]" />
                </div>
              )}

              {/* Generate Button */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateReport} disabled={isGenerating || !currentTag?.sessionID || (selectedReportType === "custom" && !customPrompt.trim())} className="min-w-[120px]">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 h-full flex flex-col">
              {/* Report Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Report</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Generate New
                  </Button>
                </div>
              </div>

              {/* Report Content */}
              <ScrollArea className="flex-1 border rounded-lg p-4 bg-gray-50">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{generatedReport}</ReactMarkdown>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50 rounded-lg">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <div className="space-y-1">
                <p className="font-medium">Generating AI Report...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

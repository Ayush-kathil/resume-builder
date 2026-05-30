"use client";

import { useState, useEffect } from "react";
import { Play, Save, History, AlertTriangle } from "lucide-react";

type PromptVersion = {
  _id: string;
  name: string;
  version: number;
  content: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
};

export default function PromptIDE() {
  const [prompts, setPrompts] = useState<PromptVersion[]>([]);
  const [name, setName] = useState("resume_generation");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Playground state
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testError, setTestError] = useState("");

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await fetch("/api/admin/prompts");
      if (res.ok) {
        const data = await res.json();
        setPrompts(data);
        if (data.length > 0 && !content) {
          // Load latest active prompt if available
          const active = data.find((p: PromptVersion) => p.isActive);
          if (active) {
            setName(active.name);
            setContent(active.content);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, notes, isActive }),
      });
      if (res.ok) {
        alert("Prompt version saved successfully!");
        setNotes("");
        fetchPrompts();
      } else {
        alert("Failed to save prompt");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving prompt");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult("");
    setTestError("");
    try {
      const res = await fetch("/api/admin/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptContent: `${content}\n\nUser Input: ${testInput}`, promptName: name }),
      });
      const data = await res.json();
      if (res.ok) {
        setTestResult(data.result);
      } else {
        setTestError(data.error || "Testing failed");
      }
    } catch (e) {
      console.error(e);
      setTestError("Network error");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[600px]">
      {/* IDE Section */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl flex flex-col shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#27272a] flex justify-between items-center bg-[#18181b]">
          <h3 className="font-semibold text-white">System Prompt IDE</h3>
          <div className="flex gap-2">
            <button
              onClick={fetchPrompts}
              className="px-3 py-1.5 text-xs font-medium text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded-md transition-colors flex items-center gap-1"
            >
              <History className="h-3.5 w-3.5" /> History
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !content}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" /> {isSaving ? "Saving..." : "Save Version"}
            </button>
          </div>
        </div>
        
        <div className="p-4 flex flex-col gap-4 flex-1">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Prompt Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#09090b] border border-[#3f3f46] rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-end mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-[#3f3f46] text-blue-600 focus:ring-blue-600 bg-[#09090b]"
                />
                <span className="text-sm text-[#ededed]">Set Active</span>
              </label>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Prompt Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter system instructions here..."
              className="w-full flex-1 min-h-[200px] bg-[#09090b] border border-[#3f3f46] rounded-md py-2 px-3 text-sm text-white font-mono focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Version Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What changed in this version?"
              className="w-full bg-[#09090b] border border-[#3f3f46] rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* AI Playground Section */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl flex flex-col shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#27272a] flex justify-between items-center bg-[#18181b]">
          <h3 className="font-semibold text-white">AI Output Playground</h3>
          <button
            onClick={handleTest}
            disabled={isTesting || !content || !testInput}
            className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white hover:bg-green-500 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" /> {isTesting ? "Running..." : "Run Test"}
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4 flex-1">
          <div>
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Test Input</label>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="e.g. 'Software Engineer with 5 years experience at Google...'"
              className="w-full h-32 bg-[#09090b] border border-[#3f3f46] rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Output Result</label>
            <div className={`w-full flex-1 min-h-[200px] rounded-md p-4 text-sm font-mono overflow-y-auto ${testError ? 'bg-red-950/30 border border-red-900/50 text-red-400' : 'bg-[#09090b] border border-[#3f3f46] text-green-400'}`}>
              {testError ? (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{testError}</span>
                </div>
              ) : (
                testResult || "Run a test to see the AI output here..."
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

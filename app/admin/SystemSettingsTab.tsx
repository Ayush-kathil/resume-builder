"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Globe, AlertTriangle, ShieldOff } from "lucide-react";

export default function SystemSettingsTab() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert("Settings saved successfully.");
      } else {
        alert("Failed to save settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!settings) {
    return <div>Failed to load settings.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-playfair font-medium text-[#1a1a1a] mb-6 flex items-center gap-2">
          <Globe className="h-5 w-5 text-gray-500" />
          Global Website Settings
        </h2>
        
        <div className="space-y-6">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 border border-red-100 bg-red-50/30 rounded-xl">
            <div>
              <h3 className="font-medium text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Maintenance Mode
              </h3>
              <p className="text-sm text-red-600/80 mt-1">
                Enable this to temporarily block users from accessing the app.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {/* Allow New Signups */}
          <div className="flex items-center justify-between p-4 border border-[#e5e5e5] bg-gray-50/50 rounded-xl">
            <div>
              <h3 className="font-medium text-[#1a1a1a] flex items-center gap-2">
                <ShieldOff className="h-4 w-4 text-gray-500" /> Allow New Signups
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                When disabled, the registration page will be blocked.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.allowNewSignups}
                onChange={(e) => setSettings({ ...settings, allowNewSignups: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>

          <div className="border-t border-[#e5e5e5] pt-6 mt-6">
            <h3 className="font-medium text-[#1a1a1a] mb-4">Enterprise Security Policies</h3>
            
            <div className="space-y-4">
              {/* MFA */}
              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <span className="text-sm font-medium text-gray-700">Enforce Multi-Factor Authentication</span>
                  <p className="text-xs text-gray-500 mt-1">Require 2FA/MFA for all administrative accounts during login.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.mfaEnforced}
                    onChange={(e) => setSettings({ ...settings, mfaEnforced: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* PII Masking */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="pr-4">
                  <span className="text-sm font-medium text-gray-700">PII Masking & Redaction</span>
                  <p className="text-xs text-gray-500 mt-1">Automatically obscure emails and phone numbers in the User Directory.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.piiMasking}
                    onChange={(e) => setSettings({ ...settings, piiMasking: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              {/* AI Opt Out */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="pr-4">
                  <span className="text-sm font-medium text-gray-700">Opt-Out of 3rd Party AI Training</span>
                  <p className="text-xs text-gray-500 mt-1">Append parameters to LLM requests to prevent data from being used for model training.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.aiModelTrainingOptOut}
                    onChange={(e) => setSettings({ ...settings, aiModelTrainingOptOut: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Session Timeout & IP Allowlist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    value={settings.sessionTimeout || 60}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 60 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Force re-authentication after inactivity.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IP Allowlist</label>
                  <input
                    type="text"
                    value={settings.ipAllowlist || ''}
                    onChange={(e) => setSettings({ ...settings, ipAllowlist: e.target.value })}
                    placeholder="e.g. 192.168.1.1, 10.0.0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Comma-separated IPv4/IPv6 addresses.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5e5e5] pt-6 mt-6">
            <h3 className="font-medium text-[#1a1a1a] mb-4">Announcement Banner</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Show Banner</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.announcementBanner.active}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      announcementBanner: { ...settings.announcementBanner, active: e.target.checked }
                    })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
                <input
                  type="text"
                  value={settings.announcementBanner.text}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    announcementBanner: { ...settings.announcementBanner, text: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={settings.announcementBanner.backgroundColor}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      announcementBanner: { ...settings.announcementBanner, backgroundColor: e.target.value }
                    })}
                    className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={settings.announcementBanner.textColor}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      announcementBanner: { ...settings.announcementBanner, textColor: e.target.value }
                    })}
                    className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Live Preview */}
              {settings.announcementBanner.active && (
                <div className="mt-4 p-4 rounded-lg overflow-hidden border border-[#e5e5e5]">
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Live Preview</p>
                  <div 
                    className="w-full text-center py-2 text-sm font-medium rounded shadow-sm"
                    style={{ 
                      backgroundColor: settings.announcementBanner.backgroundColor,
                      color: settings.announcementBanner.textColor
                    }}
                  >
                    {settings.announcementBanner.text}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white rounded-lg hover:bg-black transition-colors font-medium text-sm disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  Verified,
  ShieldAlert,
  Terminal,
  Bug,
  UserX,
  LockKeyhole,
  MonitorCheck,
} from "lucide-react";

// Base Components
interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = "" }) => (
  <div
    className={`bg-[rgba(20,20,20,0.85)] backdrop-blur-[40px] border-[0.5px] border-white/15 rounded-xl p-6 relative overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const Scanline: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[100px] animate-scanline" />
  </div>
);

// 1. SUCCESSFUL LOGIN (Access Granted)
export const AccessGrantedModal: React.FC<{ onDashboardClick?: () => void }> = ({ 
  onDashboardClick 
}) => (
  <GlassPanel className="flex flex-col items-center justify-center min-h-[480px] group">
    <Scanline />
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
    <div className="mb-6 relative">
      <div className="absolute inset-0 bg-green-500/20 blur-[64px] rounded-full group-hover:scale-125 transition-transform duration-700" />
      <svg className="relative w-32 h-32" viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(34, 197, 94, 0.1)" strokeWidth="0.5" />
        <circle cx="50" cy="50" fill="none" r="35" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="0.5" />
        <circle
          className="animate-tunnel-flow"
          cx="50"
          cy="50"
          fill="none"
          r="35"
          stroke="rgba(34, 197, 94, 0.8)"
          strokeLinecap="round"
          strokeWidth="1.5"
          style={{ strokeDasharray: "20 80" }}
        />
        <circle cx="50" cy="50" fill="none" r="25" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5" />
        <foreignObject height="30" width="30" x="35" y="35">
          <div className="flex items-center justify-center h-full">
            <Verified className="text-green-500 w-7 h-7" />
          </div>
        </foreignObject>
      </svg>
    </div>
    <h3 className="font-h3 text-h3 text-primary mb-2 tracking-tight">Access Granted</h3>
    <div className="space-y-2 text-center mb-6 px-6">
      <p className="text-on-surface-variant text-body-md">Identity verified via hardware enclave.</p>
      <p className="text-green-500/70 font-mono text-[11px] tracking-widest uppercase">Tunnel Established: US-WEST-2-AZ1</p>
    </div>
    <button 
      onClick={onDashboardClick}
      className="w-full max-w-[280px] py-3 px-4 bg-primary text-background font-label-caps tracking-[0.2em] text-[12px] hover:bg-on-surface transition-all active:scale-95 border-[0.5px] border-white/10"
    >
      INITIALIZE DASHBOARD
    </button>
  </GlassPanel>
);

// 2. FAILED LOGIN (Perimeter Alert) - Matching original design
export const PerimeterAlertModal: React.FC<{ onRetry?: () => void }> = ({ 
  onRetry 
}) => (
  <GlassPanel className="flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden border-error/40 shadow-[0_0_40px_rgba(255,107,107,0.18)]">
    {/* Red gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-error/10 via-transparent to-transparent pointer-events-none" />
    {/* Red border lines */}
    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-error/80 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-error/60 to-transparent" />
    <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-error/60 to-transparent" />
    <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-error/60 to-transparent" />
    <div className="mb-6 relative">
      {/* Red glow */}
      <div className="absolute inset-0 bg-error/15 blur-[40px] rounded-full animate-shimmer" />
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Rotating squares */}
        <div className="absolute -inset-2 rounded-2xl border-[2px] border-[rgba(255,107,107,0.95)] bg-[rgba(255,107,107,0.12)] rotate-45 animate-spin-slow shadow-[0_0_24px_rgba(255,107,107,0.35)]" />
        <div className="absolute inset-2 rounded-2xl border-[2px] border-[rgba(255,107,107,0.8)] bg-[rgba(255,107,107,0.08)] -rotate-12 animate-spin-reverse-slower shadow-[0_0_16px_rgba(255,107,107,0.22)]" />
        <ShieldAlert className="text-error w-11 h-11 font-semibold z-10" />
      </div>
    </div>
    <h3 className="font-h3 text-h3 text-primary mb-2 tracking-tight">Perimeter Alert</h3>
    <div className="space-y-2 text-center mb-6 px-6">
      <p className="text-on-surface-variant text-body-md">Security handshake failed. Multiple invalid requests detected.</p>
      <div className="inline-flex items-center gap-2 bg-error/10 border border-error/20 px-3 py-1.5 rounded">
        <span className="w-1.5 h-1.5 bg-error rounded-full" />
        <span className="text-error font-mono text-[10px] tracking-tighter">SOURCE_BLOCKED: 192.168.1.104</span>
      </div>
    </div>
    <div className="flex flex-col gap-3 w-full max-w-[280px]">
      <button 
        onClick={onRetry}
        className="w-full py-3 px-4 bg-error/10 border border-error/30 text-error font-label-caps tracking-[0.2em] text-[12px] hover:bg-error/20 transition-all"
      >
        RE-AUTHENTICATE
      </button>
      <a className="text-[11px] font-label-caps text-on-surface-variant/60 text-center hover:text-primary transition-colors cursor-pointer tracking-widest">
        RECOVER_CREDENTIALS
      </a>
    </div>
  </GlassPanel>
);

// 3. SUCCESSFUL ANALYSIS (Data Console)
export const AnalysisCompleteModal: React.FC = () => (
  <GlassPanel className="flex flex-col min-h-[480px]">
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
    <div className="flex items-start justify-between mb-6">
      <div>
        <h3 className="font-h3 text-h3 text-primary mb-1">Analysis Complete</h3>
        <p className="text-[11px] font-mono text-on-surface-variant/60">KERNEL: 0.9.12-LTS / CORE: v4.2</p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-label-caps text-on-surface-variant mb-1">STATUS</span>
        <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-500 font-mono text-[10px]">NOMINAL</span>
      </div>
    </div>
    <div className="flex-1 space-y-6">
      <div className="grid grid-cols-2 gap-6 border-t border-b border-outline-variant/10 py-4">
        <div className="relative">
          <span className="text-[10px] font-label-caps text-on-surface-variant block mb-2">MATURITY INDEX</span>
          <div className="flex items-end gap-2">
            <span className="font-h2 text-h2 text-primary leading-none">8.4</span>
            <span className="text-body-md text-on-surface-variant/40 mb-1">/10.0</span>
          </div>
          <div className="mt-3 h-8 w-full opacity-60">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path d="M0 15 Q 10 5, 20 12 T 40 8 T 60 14 T 80 6 T 100 10" fill="none" stroke="white" strokeWidth="0.75" />
              <path d="M0 15 Q 10 5, 20 12 T 40 8 T 60 14 T 80 6 T 100 10 V 20 H 0 Z" fill="rgba(255,255,255,0.05)" />
            </svg>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-on-surface-variant">COVERAGE</span>
              <span className="text-[10px] font-mono text-primary">92%</span>
            </div>
            <div className="h-[2px] bg-white/10 w-full">
              <div className="h-full bg-primary w-[92%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-on-surface-variant">COMPLEXITY</span>
              <span className="text-[10px] font-mono text-primary">LOW</span>
            </div>
            <div className="h-[2px] bg-white/10 w-full">
              <div className="h-full bg-primary w-[14%]" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 bg-white/5 border-[0.5px] border-white/10 rounded">
        <p className="text-on-surface-variant text-[13px] leading-relaxed italic">
          &quot;Architecture validates as modular. No critical circular dependencies identified within the root directory structure.&quot;
        </p>
      </div>
    </div>
    <button className="mt-6 w-full py-3 px-4 bg-primary text-background font-label-caps tracking-[0.2em] text-[12px] flex items-center justify-center gap-3 group">
      ACCESS REPORT_MODULE 
      <Terminal className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  </GlassPanel>
);

// 4. FAILED ANALYSIS (System Diagnostic) - Matching original design
export const SystemDiagnosticModal: React.FC = () => (
  <GlassPanel className="flex flex-col min-h-[480px] border-t-2 border-t-error/30">
    {/* Top red line */}
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-error/40 to-transparent" />
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border border-error/30 flex items-center justify-center rounded">
          <MonitorCheck className="text-error w-5 h-5" />
        </div>
        <h3 className="font-h3 text-h3 text-primary">System Diagnostic</h3>
      </div>
      <div className="px-2 py-1 bg-error/5 border border-error/20 text-error font-mono text-[10px] tracking-widest">
        CRITICAL_FAULT
      </div>
    </div>
    <div className="flex-1 space-y-3">
      <p className="text-on-surface-variant text-body-md">Analysis sequence interrupted during &apos;node_resolution&apos; phase.</p>
      <div className="bg-surface-container-lowest border-[0.5px] border-white/10 p-3 rounded font-mono overflow-hidden relative">
        <div className="flex items-center gap-2 mb-2 opacity-50">
          <span className="w-2 h-2 rounded-full bg-error/60" />
          <span className="text-[10px]">STACK_TRACE: CORE_DUMP_042</span>
        </div>
        <div className="text-[12px] text-on-surface-variant/80 space-y-1 overflow-x-auto">
          <div className="whitespace-nowrap"><span className="text-error/70">ERROR:</span> ERR_REF_NOT_FOUND</div>
          <div className="whitespace-nowrap"><span className="text-primary/40">AT:</span> /root/main/lib/parser.ts:241:14</div>
          <div className="whitespace-nowrap"><span className="text-primary/40">IN:</span> mapLocalSymbols()</div>
          <div className="whitespace-nowrap opacity-30 mt-2">... mapping source map (40.2kb)</div>
          <div className="whitespace-nowrap opacity-30">... process exited with code 1</div>
        </div>
        <div className="absolute right-2 top-2">
          <Bug className="text-white/5 w-10 h-10" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 mt-6">
      <button className="py-3 px-4 bg-transparent border border-white/10 text-on-surface-variant font-label-caps tracking-widest text-[11px] hover:text-primary hover:border-white/20 transition-all">
        DUMP_LOGS
      </button>
      <button className="py-3 px-4 bg-error text-on-error font-label-caps tracking-widest text-[11px] hover:bg-error/90 transition-all shadow-[0_0_20px_rgba(255,180,171,0.1)]">
        FORCE_REINDEX
      </button>
    </div>
  </GlassPanel>
);

// 5. LOGIN ERROR (Identity Verification Failure) - Matching original design
export const IdentityVerificationModal: React.FC = () => (
  <GlassPanel className="flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden">
    {/* Red gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-error/5 via-transparent to-transparent pointer-events-none" />
    <div className="mb-6 relative">
      {/* Red glow */}
      <div className="absolute inset-0 bg-error/10 blur-[40px] rounded-full animate-shimmer" />
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Rotating square */}
        <div className="absolute inset-0 border-[0.5px] border-error/30 rotate-45" />
        <UserX className="text-error w-9 h-9 font-light" />
      </div>
    </div>
    <h3 className="font-h3 text-h3 text-primary mb-2 tracking-tight">Identity Verification Failure</h3>
    <div className="space-y-2 text-center mb-6 px-6">
      <p className="text-on-surface-variant text-body-md">Invalid credentials provided for &apos;lead_architect&apos;. Authentication handshake timed out after 3 retries.</p>
    </div>
    <div className="flex flex-col gap-3 w-full max-w-[280px]">
      <button className="w-full py-3 px-4 bg-primary text-background font-label-caps tracking-[0.2em] text-[12px] hover:bg-on-surface transition-all active:scale-95 border-[0.5px] border-white/10">
        RETRY LOGIN
      </button>
      <a className="text-[11px] font-label-caps text-on-surface-variant/60 text-center hover:text-primary transition-colors cursor-pointer tracking-widest">
        RECOVER ACCESS
      </a>
    </div>
  </GlassPanel>
);

// 6. UNAUTHENTICATED (Session Expired)
export const SessionExpiredModal: React.FC = () => (
  <GlassPanel className="flex flex-col items-center justify-center min-h-[480px] group">
    <Scanline />
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
    <div className="mb-6 relative">
      <div className="absolute inset-0 bg-primary/5 blur-[64px] rounded-full group-hover:scale-125 transition-transform duration-700" />
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 border-[0.5px] border-outline-variant/30 rounded-full" />
        <LockKeyhole className="text-primary/60 w-9 h-9" />
      </div>
    </div>
    <h3 className="font-h3 text-h3 text-primary mb-2 tracking-tight">Session Expired</h3>
    <div className="space-y-2 text-center mb-6 px-6">
      <p className="text-on-surface-variant text-body-md">Your secure tunnel to the &apos;US-EAST-ALPHA-01&apos; cluster has been terminated due to inactivity. Re-authentication required.</p>
    </div>
    <button className="w-full max-w-[280px] py-3 px-4 bg-primary text-background font-label-caps tracking-[0.2em] text-[12px] hover:bg-on-surface transition-all active:scale-95 border-[0.5px] border-white/10">
      RE-AUTHENTICATE
    </button>
  </GlassPanel>
);

// Main Component - Grid Layout
export default function FeedbackModals() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1200px] mx-auto p-6 bg-background">
      <AccessGrantedModal />
      <PerimeterAlertModal />
      <AnalysisCompleteModal />
      <SystemDiagnosticModal />
      <IdentityVerificationModal />
      <SessionExpiredModal />
    </div>
  );
}
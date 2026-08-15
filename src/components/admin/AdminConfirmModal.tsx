"use client";

import React from "react";
import { AlertTriangle, X, RefreshCw } from "lucide-react";

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdminConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: AdminConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-grotesk">
      <div className="w-full max-w-md bg-[#0B0E13] border border-[rgba(141,190,255,0.15)] rounded-2xl p-6 space-y-6 shadow-2xl relative">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl border ${isDestructive ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-[#8DBEFF]/10 border-[#8DBEFF]/20 text-[#8DBEFF]"}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bebas text-2xl tracking-wider text-white uppercase leading-none">{title}</h3>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-[12px] border border-white/10 hover:bg-white/5 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-[12px] font-extrabold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              isDestructive
                ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20"
                : "bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] shadow-[0_0_20px_rgba(141,190,255,0.2)]"
            }`}
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

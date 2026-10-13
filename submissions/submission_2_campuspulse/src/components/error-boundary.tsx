"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Production-grade ErrorBoundary. Catches render-time exceptions from any
 * subtree and shows a recoverable CTF-themed panel so the rest of the
 * dashboard continues to function in front of the jury.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[FlagHorizon ErrorBoundary]", this.props.label, error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-strong neon-border flex flex-col items-center gap-3 rounded-xl p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-[var(--neon-amber)]" aria-hidden />
          <div>
            <p className="font-mono text-sm text-[var(--neon-amber)]">
              [{this.props.label ?? "subsystem"}] connection lost
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {this.state.error?.message ?? "An unexpected error was quarantined."}
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--neon)]/40 bg-[var(--neon)]/10 px-3 py-1.5 text-xs font-mono text-[var(--neon)] hover:bg-[var(--neon)]/20"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> retry subsystem
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

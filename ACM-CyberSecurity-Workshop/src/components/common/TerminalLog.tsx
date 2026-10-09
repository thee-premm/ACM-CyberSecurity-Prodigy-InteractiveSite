import React, { useRef, useEffect } from 'react';
import { Terminal, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { LogEntry } from '../../types';

interface TerminalLogProps {
  logs: LogEntry[];
  title?: string;
  maxHeight?: string;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ 
  logs, 
  title = 'SYS_LOGS // LIVE FEED',
  maxHeight = 'max-h-48' 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green shrink-0 mt-0.5" />;
      case 'danger':
        return <AlertTriangle className="w-3.5 h-3.5 text-cyber-magenta shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-cyber-yellow shrink-0 mt-0.5" />;
      default:
        return <Info className="w-3.5 h-3.5 text-cyber-cyan shrink-0 mt-0.5" />;
    }
  };

  const getTextColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-cyber-green';
      case 'danger':
        return 'text-cyber-magenta';
      case 'warning':
        return 'text-cyber-yellow';
      default:
        return 'text-cyber-cyan/90';
    }
  };

  return (
    <div className="bg-cyber-dark/90 border border-cyber-border rounded-lg overflow-hidden flex flex-col">
      {/* Terminal Title Bar */}
      <div className="bg-cyber-surface px-3 py-1.5 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
          <span className="text-[10px] font-mono text-cyber-muted">LIVE</span>
        </div>
      </div>

      {/* Log Feed */}
      <div 
        ref={scrollRef} 
        className={`p-3 font-mono text-xs overflow-y-auto space-y-1.5 scrollbar-thin bg-black/50 ${maxHeight}`}
      >
        {logs.length === 0 ? (
          <div className="text-cyber-muted italic text-[11px]">
            [SYS] Waiting for operative telemetry...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              {getIcon(log.type)}
              <span className="text-[10px] text-slate-500 select-none">
                [{log.timestamp}]
              </span>
              <span className={`text-[11px] ${getTextColor(log.type)}`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

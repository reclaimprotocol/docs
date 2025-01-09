import React from 'react';
import { Zap, ArrowRight, Check } from 'lucide-react';

export function IntegrationCard() {
  return (
    <div className="relative group">
       <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-[#3385FF] rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      <div className="relative px-7 py-6 bg-white dark:bg-gray-900 rounded-lg leading-none flex items-center">
        <div className="flex flex-col w-full">
          <div className="flex items-center space-x-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3385FF]/10 dark:bg-[#3385FF]/20">
              <Zap className="h-6 w-6 text-[#3385FF] dark:text-[#3385FF]" />
            </span>
            <span className="text-slate-800 dark:text-white text-lg font-medium">Integration Ready</span>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-4">
                Quick Integration
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
                Get up and running in minutes with simple, intuitive implementation.
            </p>
            </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Production Ready</span>
            </div>
            <a 
              href="https://dev.reclaimprotocol.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 px-4 py-2 bg-[#3385FF] text-white rounded-lg hover:bg-[#3385FF]/80 transition-colors no-underline"
            >
              <span>Integrate Now</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
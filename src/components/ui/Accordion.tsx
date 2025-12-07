/**
 * Accordion Component
 * 
 * Simple accordion implementation following Chessio UI patterns.
 */

"use client";

import React, { createContext, useContext, useState } from "react";
import { ChevronDown } from "lucide-react";

// Context for accordion state
interface AccordionContextValue {
  value: string | null;
  onValueChange: (value: string) => void;
  type: "single";
  collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

// Context for AccordionItem
interface AccordionItemContextValue {
  value: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within <Accordion>");
  }
  return context;
}

// Main Accordion component
interface AccordionProps {
  type: "single";
  collapsible?: boolean;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Accordion({
  type = "single",
  collapsible = true,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className = "",
  children,
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue || null);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleValueChange = (newValue: string) => {
    if (collapsible && value === newValue) {
      // Collapse if already open
      if (onValueChange) {
        onValueChange("");
      } else {
        setInternalValue(null);
      }
    } else {
      if (onValueChange) {
        onValueChange(newValue);
      } else {
        setInternalValue(newValue);
      }
    }
  };

  return (
    <AccordionContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        type,
        collapsible,
      }}
    >
      <div className={`space-y-2 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// AccordionItem component
interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function AccordionItem({
  value,
  className = "",
  children,
  disabled = false,
}: AccordionItemProps) {
  const { value: openValue } = useAccordion();
  const isOpen = openValue === value;

  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div
        className={`rounded-lg border border-chessio-border bg-chessio-card/50 overflow-hidden ${className}`}
        data-state={isOpen ? "open" : "closed"}
        data-disabled={disabled ? "true" : "false"}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

// AccordionTrigger component
interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function AccordionTrigger({
  className = "",
  children,
  disabled = false,
}: AccordionTriggerProps) {
  const accordion = useAccordion();
  const parent = useContext(AccordionItemContext);
  
  if (!parent) {
    throw new Error("AccordionTrigger must be used within AccordionItem");
  }

  const isOpen = accordion.value === parent.value;

  const handleClick = () => {
    if (!disabled) {
      accordion.onValueChange(parent.value);
    }
  };

  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between px-4 py-3 text-left font-medium transition-all hover:bg-chessio-card ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      onClick={handleClick}
      disabled={disabled}
      data-state={isOpen ? "open" : "closed"}
    >
      <span className="flex-1">{children}</span>
      <ChevronDown
        className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

// AccordionContent component
interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

export function AccordionContent({
  className = "",
  children,
}: AccordionContentProps) {
  const accordion = useAccordion();
  const parent = useContext(AccordionItemContext);
  
  if (!parent) {
    throw new Error("AccordionContent must be used within AccordionItem");
  }

  const isOpen = accordion.value === parent.value;

  if (!isOpen) return null;

  return (
    <div
      className={`px-4 pb-4 pt-0 text-sm text-muted-foreground ${className}`}
      data-state="open"
    >
      {children}
    </div>
  );
}

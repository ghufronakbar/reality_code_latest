"use client";

import { Check } from "lucide-react";

interface StepsProps {
  currentStep: number;
}

export function Steps({ currentStep }: StepsProps) {
  const steps = [
    {
      title: "Business Information",
      description: "Basic business details",
    },
    {
      title: "Contact Information",
      description: "How customers can reach you",
    },
    {
      title: "Bank Details",
      description: "Payment information",
    },
  ];

  return (
    <div className="relative">
      <div className="absolute left-0 top-[15px] w-full h-0.5 bg-muted">
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
      
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;
          
          return (
            <div
              key={step.title}
              className="flex flex-col items-center"
              style={{ width: "120px" }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                    ? "border-primary bg-background text-primary"
                    : "border-muted bg-background text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
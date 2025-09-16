'use client';

import { CheckoutStep } from './checkout-content';
import { CheckIcon } from '@heroicons/react/24/solid';

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
  onStepClick: (step: CheckoutStep) => void;
}

const steps = [
  { id: 'shipping', name: 'Shipping', description: 'Delivery information' },
  { id: 'payment', name: 'Payment', description: 'Payment method' },
  { id: 'review', name: 'Review', description: 'Order confirmation' },
] as const;

export default function CheckoutSteps({ currentStep, onStepClick }: CheckoutStepsProps) {
  const getStepIndex = (step: CheckoutStep) => {
    return steps.findIndex(s => s.id === step);
  };

  const currentStepIndex = getStepIndex(currentStep);

  return (
    <nav className="px-6 py-4 border-b border-gray-200">
      <ol className="flex items-center justify-between">
        {steps.map((step, stepIdx) => {
          const isCompleted = stepIdx < currentStepIndex;
          const isCurrent = step.id === currentStep;
          const isClickable = stepIdx <= currentStepIndex;

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex items-center">
                {/* Step Circle */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-pink-600 border-pink-600 text-white'
                      : isCurrent
                      ? 'border-pink-600 text-pink-600'
                      : 'border-gray-300 text-gray-400'
                  } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  onClick={() => isClickable && onStepClick(step.id)}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepIdx + 1}</span>
                  )}
                </div>

                {/* Step Info */}
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      isCurrent ? 'text-pink-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>

              {/* Connector Line */}
              {stepIdx < steps.length - 1 && (
                <div
                  className={`hidden sm:block w-full h-0.5 mx-4 ${
                    stepIdx < currentStepIndex ? 'bg-pink-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>{steps[currentStepIndex]?.name}</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-pink-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </nav>
  );
}

import React, { lazy, Suspense } from 'react';


interface ModalContentSwitchProps {
  content: string;
  contentProps?: any;
}

export const ModalContentSwitch: React.FC<ModalContentSwitchProps> = ({ content, contentProps }) => {
  // Fallback UI for Suspense
  const fallback = <div className="flex justify-center items-center p-4">Loading...</div>;
  
  // Render the appropriate component based on content type
  switch (content) {
    default:
      return <div>No content found for type: {content}</div>;
  }
}; 
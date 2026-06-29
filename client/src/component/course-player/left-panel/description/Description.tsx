import React from 'react';

export default function Description({ videoId }: { videoId: string }) {
  // You can fetch description from API using videoId if needed
  return (
    <div>
      <h2 className="text-base font-semibold tracking-tight text-text-primary">
        About this lesson
      </h2>
      <p className="mt-2 max-w-[65ch] leading-relaxed text-text-secondary">
        This is the description for the video. You can fetch and render it dynamically from your API.
      </p>
    </div>
  );
}

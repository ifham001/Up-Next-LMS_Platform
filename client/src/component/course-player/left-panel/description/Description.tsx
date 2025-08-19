import React from 'react';

export default function Description({ videoId }: { videoId: string }) {
  // You can fetch description from API using videoId if needed
  return (
    <div>
      <p className="text-gray-700">
        This is the description for the video. You can fetch and render it dynamically from your API.
      </p>
    </div>
  );
}

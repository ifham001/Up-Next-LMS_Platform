"use client";
import { getResourcesApi } from "@/api/user/resource/resource";
import React, { useEffect, useState } from "react";

export interface IResource {
  id: string;
  title: string;
  description: string;
  section_id: string;
  resource_url: string;
}

export default function ResourceList({ resourceId }: { resourceId: string }) {
  const [resources, setResources] = useState<IResource[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResourcesApi(resourceId);
        if (data.success) setResources(data.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };
    fetchResources();
  }, [resourceId]);

  if (resources.length === 0) {
    return (
      <p className="text-gray-500 mt-8 text-center text-lg">
        No resources available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1  justify-center sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {resources.map((res) => (
        <div
          key={res.id}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl duration-300 p-6 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
              {res.title}
            </h2>
            <p className="text-gray-600 text-sm mb-4">{res.description}</p>
          </div>
          <a
            href={res.resource_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-block text-center bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Open Resource
          </a>
        </div>
      ))}
    </div>
  );
}

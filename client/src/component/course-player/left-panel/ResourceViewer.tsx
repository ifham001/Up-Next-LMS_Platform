"use client";
import { getResourcesApi } from "@/api/user/resource/resource";
import React, { useEffect, useState } from "react";
import { FileText, FolderDown, ArrowUpRight } from "lucide-react";

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
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-dark">
          <FolderDown size={22} strokeWidth={1.75} />
        </span>
        <h2 className="mt-4 text-lg font-semibold tracking-tight text-text-primary">
          No resources yet
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          This lesson doesn't have any downloads or links.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <span className="eyebrow">Downloads</span>
      <h1 className="mt-4 mb-6 text-2xl font-semibold tracking-tight text-text-primary">
        Lesson <span className="text-accent">resources</span>
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((res) => (
          <div
            key={res.id}
            className="card-interactive flex flex-col justify-between p-6"
          >
            <div>
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-dark">
                <FileText size={18} strokeWidth={1.75} />
              </span>
              <h2 className="mb-2 text-base font-semibold tracking-tight text-text-primary">
                {res.title}
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-text-secondary">
                {res.description}
              </p>
            </div>
            <a
              href={res.resource_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Open resource
              <ArrowUpRight size={16} strokeWidth={1.75} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

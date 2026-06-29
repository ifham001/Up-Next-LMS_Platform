"use client";
import { getDashBoardDataApi } from "@/api/admin/dashboard/dashboard";
import Loading from "@/ui/Loading";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  BookOpen,
  Users,
  DollarSign,
  UserPlus,
  TrendingUp,
} from "lucide-react";

type Data = {
  lifetimeRevenue: number;
  todayNewUsers: number;
  todayRevenue: number;
  totalCourses: number;
  totalUsers: number;
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const response = await getDashBoardDataApi(dispatch, setIsLoading);
      if (response.success) {
        setDashboardData(response);
      }
    };
    getData();
  }, [dispatch]);

  if (isLoading || !dashboardData) {
    return <Loading />;
  }

  const stats = [
    {
      title: "Total courses",
      value: dashboardData.totalCourses.toLocaleString(),
      icon: <BookOpen className="h-5 w-5" strokeWidth={1.75} />,
    },
    {
      title: "Total users",
      value: dashboardData.totalUsers.toLocaleString(),
      icon: <Users className="h-5 w-5" strokeWidth={1.75} />,
    },
    {
      title: "New users today",
      value: dashboardData.todayNewUsers.toLocaleString(),
      icon: <UserPlus className="h-5 w-5" strokeWidth={1.75} />,
    },
    {
      title: "Revenue today",
      value: `₹${dashboardData.todayRevenue.toLocaleString()}`,
      icon: <TrendingUp className="h-5 w-5" strokeWidth={1.75} />,
    },
  ];

  return (
    <div className="flex flex-1 flex-col px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-10 animate-fadeInUp">
          <span className="eyebrow mb-4">Admin overview</span>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Your platform at a <span className="text-accent">glance</span>
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-text-secondary">
            An overview of your platform&apos;s courses, users, and revenue.
          </p>
        </header>

        {/* Lifetime revenue — primary stat */}
        <div className="card animate-fadeInUp mb-4 flex flex-col gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">Lifetime revenue</p>
            <p className="tnum font-display mt-2 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              ₹{dashboardData.lifetimeRevenue.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Total earnings across all published courses.
            </p>
          </div>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-dark">
            <DollarSign className="h-5 w-5" strokeWidth={1.75} />
          </div>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`card-interactive animate-fadeInUp delay-${(i % 3) + 1} flex flex-col gap-4 p-6`}
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-dark">
                {stat.icon}
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">{stat.title}</p>
                <p className="tnum font-display mt-1 text-2xl font-bold tracking-tight text-text-primary">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
      title: "Total Courses",
      value: dashboardData.totalCourses,
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Active Users",
      value: dashboardData.totalUsers,
      icon: <Users className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Lifetime Revenue",
      value: `₹${dashboardData.lifetimeRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-yellow-500" />,
    },
    {
      title: "Today's New Users",
      value: dashboardData.todayNewUsers,
      icon: <UserPlus className="w-6 h-6 text-purple-500" />,
    },
    {
      title: "Today's Sales",
      value: `₹${dashboardData.todayRevenue.toLocaleString()}`,
      icon: <TrendingUp className="w-6 h-6 text-pink-500" />,
    },
  ];

  return (
    <div className="flex flex-col flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4"
          >
            <div className="p-3 bg-gray-100 rounded-full">{stat.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

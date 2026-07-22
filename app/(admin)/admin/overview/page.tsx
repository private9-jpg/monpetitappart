import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminOverviewComponent from "@/components/admin/AdminOverview";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Vue d'ensemble",
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1">
        <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
          <h1 className="text-xl font-semibold text-zinc-900">Vue d&apos;ensemble</h1>
        </div>
        <div className="p-4 sm:p-6">
          <AdminOverviewComponent />
        </div>
      </main>
    </div>
  );
}

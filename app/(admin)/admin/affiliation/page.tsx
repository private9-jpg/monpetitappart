import { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Affiliation",
  robots: { index: false, follow: false },
};

export default function AdminAffiliationPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1">
        <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
          <h1 className="text-xl font-semibold text-zinc-900">Affiliation</h1>
          <p className="mt-1 text-sm text-zinc-600">Performance des clics, marchands et conversions.</p>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-sm text-zinc-600">Module d&apos;affiliation — en construction.</p>
        </div>
      </main>
    </div>
  );
}

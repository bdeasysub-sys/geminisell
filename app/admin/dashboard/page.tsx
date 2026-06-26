import { requireAdmin } from "@/lib/auth";
import AdminDashboard from "./AdminDashboard";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  return <AdminDashboard adminEmail={admin.email} />;
}

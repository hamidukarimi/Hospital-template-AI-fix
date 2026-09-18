import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminButton } from "../../components/AdminButton";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";
import { useToast } from "../../components/Toast";
import adminApi from "../../services/adminApi";

interface SiteSettingsItem {
  id: string;
  hospitalName: string;
  logo?: string | null;
  phone: string;
  email: string;
  address: string;
  sundayVisitingHours?: string | null;
  mondayFridayVisitingHours?: string | null;
}

const emptyForm = {
  hospitalName: "",
  logo: "",
  phone: "",
  email: "",
  address: "",
  sundayVisitingHours: "",
  mondayFridayVisitingHours: "",
};

const SiteSettingsPage = () => {
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const load = async () => {
      try {
        const item = await adminApi.get<SiteSettingsItem>(
          "/admin/site-settings",
        );
        setForm({
          hospitalName: item?.hospitalName ?? "",
          logo: item?.logo ?? "",
          phone: item?.phone ?? "",
          email: item?.email ?? "",
          address: item?.address ?? "",
          sundayVisitingHours: item?.sundayVisitingHours ?? "",
          mondayFridayVisitingHours: item?.mondayFridayVisitingHours ?? "",
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load site settings.",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      await adminApi.patch("/admin/site-settings", {
        hospitalName: form.hospitalName.trim(),
        logo: form.logo.trim() || null,
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        sundayVisitingHours: form.sundayVisitingHours.trim() || null,
        mondayFridayVisitingHours:
          form.mondayFridayVisitingHours.trim() || null,
      });

      pushToast({ type: "success", title: "Site settings updated." });
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save settings",
        description:
          submitError instanceof Error
            ? submitError.message
            : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label="Loading site settings..." />;
  if (error)
    return <ErrorState title="Unable to load settings" message={error} />;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Site Settings"
        description="Update the hospital identity and contact information shown on the public site."
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Hospital name
            </span>
            <input
              value={form.hospitalName}
              onChange={(event) =>
                setForm({ ...form, hospitalName: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              required
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Logo URL</span>
            <input
              value={form.logo}
              onChange={(event) =>
                setForm({ ...form, logo: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              placeholder="/uploads/site/logo.png"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Phone</span>
            <input
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              required
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Address</span>
            <textarea
              value={form.address}
              onChange={(event) =>
                setForm({ ...form, address: event.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Sunday visiting hours
            </span>
            <input
              value={form.sundayVisitingHours}
              onChange={(event) =>
                setForm({ ...form, sundayVisitingHours: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Monday-Friday hours
            </span>
            <input
              value={form.mondayFridayVisitingHours}
              onChange={(event) =>
                setForm({
                  ...form,
                  mondayFridayVisitingHours: event.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <AdminButton type="submit" variant="secondary" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save settings"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

export default SiteSettingsPage;

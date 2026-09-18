import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminButton } from "../../components/AdminButton";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";
import { useToast } from "../../components/Toast";
import adminApi from "../../services/adminApi";

interface FooterSettingsItem {
  id: string;
  logo?: string | null;
  location?: string | null;
  visitingHours?: string | null;
  phone?: string | null;
}

const emptyForm = {
  logo: "",
  location: "",
  visitingHours: "",
  phone: "",
};

const FooterSettingsPage = () => {
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const load = async () => {
      try {
        const item = await adminApi.get<FooterSettingsItem>(
          "/admin/footer-settings",
        );
        setForm({
          logo: item?.logo ?? "",
          location: item?.location ?? "",
          visitingHours: item?.visitingHours ?? "",
          phone: item?.phone ?? "",
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load footer settings.",
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
      await adminApi.patch("/admin/footer-settings", {
        logo: form.logo.trim() || null,
        location: form.location.trim(),
        visitingHours: form.visitingHours.trim() || null,
        phone: form.phone.trim(),
      });

      pushToast({ type: "success", title: "Footer settings updated." });
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save footer settings",
        description:
          submitError instanceof Error
            ? submitError.message
            : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label="Loading footer settings..." />;
  if (error)
    return (
      <ErrorState title="Unable to load footer settings" message={error} />
    );

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Footer Settings"
        description="Edit footer branding and contact details."
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Logo URL</span>
            <input
              value={form.logo}
              onChange={(event) =>
                setForm({ ...form, logo: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              placeholder="/uploads/site/footer-logo.png"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Location</span>
            <textarea
              value={form.location}
              onChange={(event) =>
                setForm({ ...form, location: event.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Visiting hours
            </span>
            <input
              value={form.visitingHours}
              onChange={(event) =>
                setForm({ ...form, visitingHours: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
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
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <AdminButton type="submit" variant="secondary" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save footer settings"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

export default FooterSettingsPage;

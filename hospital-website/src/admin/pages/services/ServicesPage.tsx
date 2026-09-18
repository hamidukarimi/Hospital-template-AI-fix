import { Image as ImageIcon, PencilLine, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminButton } from "../../components/AdminButton";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";
import { SearchInput } from "../../components/SearchInput";
import { StatusBadge } from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";
import adminApi from "../../services/adminApi";
import { getImageUrl } from "../../utils/adminHelpers";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  category?: string | null;
  linkText?: string | null;
  linkUrl?: string | null;
  color: string;
  isActive?: boolean;
  sortOrder?: number;
}

const emptyForm = {
  title: "",
  description: "",
  image: "",
  category: "",
  linkText: "",
  linkUrl: "",
  color: "#147BD5",
  isActive: true,
  sortOrder: 0,
};

const ServicesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [items, setItems] = useState<ServiceItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isFormView =
    location.pathname.endsWith("/new") ||
    /\/services\/.+\/edit$/.test(location.pathname);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await adminApi.get<ServiceItem[]>("/admin/services");
        setItems(data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load services.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isFormView) {
      void load();
    }
  }, [isFormView]);

  useEffect(() => {
    const match = location.pathname.match(/\/services\/(.+)\/edit$/);
    const id = match?.[1];

    if (!id) {
      setForm(emptyForm);
      setEditingId(null);
      return;
    }

    const loadItem = async () => {
      try {
        const item = await adminApi.get<ServiceItem>(`/admin/services/${id}`);
        setEditingId(id);
        setForm({
          title: item.title ?? "",
          description: item.description ?? "",
          image: item.image ?? "",
          category: item.category ?? "",
          linkText: item.linkText ?? "",
          linkUrl: item.linkUrl ?? "",
          color: item.color ?? "#147BD5",
          isActive: item.isActive ?? true,
          sortOrder: item.sortOrder ?? 0,
        });
      } catch {
        setError("Unable to load service for editing.");
      }
    };

    void loadItem();
  }, [location.pathname]);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return items;

    return items.filter((item) =>
      [item.title, item.category, item.description].some((field) =>
        (field ?? "").toLowerCase().includes(value),
      ),
    );
  }, [items, search]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        category: form.category.trim() || null,
        linkText: form.linkText.trim() || null,
        linkUrl: form.linkUrl.trim() || null,
        color: form.color,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };

      if (!payload.title || !payload.description) {
        pushToast({
          type: "error",
          title: "Missing required fields",
          description: "Title and description are required.",
        });
        return;
      }

      if (editingId) {
        await adminApi.patch(`/admin/services/${editingId}`, payload);
        pushToast({ type: "success", title: "Service updated successfully." });
      } else {
        await adminApi.post("/admin/services", payload);
        pushToast({ type: "success", title: "Service created successfully." });
      }

      navigate("/admin/services");
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save service",
        description:
          submitError instanceof Error
            ? submitError.message
            : "Please check your form and try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await adminApi.delete(`/admin/services/${deleteTargetId}`);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTargetId),
      );
      pushToast({ type: "success", title: "Service deleted successfully." });
    } catch (deleteError) {
      pushToast({
        type: "error",
        title: "Unable to delete service",
        description:
          deleteError instanceof Error
            ? deleteError.message
            : "Please try again.",
      });
    } finally {
      setDeleteTargetId(null);
    }
  };

  if (isFormView) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title={editingId ? "Edit service" : "Create service"}
          description={
            editingId
              ? "Update the service details below."
              : "Add a new service offer to the hospital website."
          }
          backLink="/admin/services"
        />

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Description
              </span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Category
              </span>
              <input
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Sort order
              </span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) =>
                  setForm({ ...form, sortOrder: Number(event.target.value) })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Image URL
              </span>
              <input
                value={form.image}
                onChange={(event) =>
                  setForm({ ...form, image: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                placeholder="/uploads/services/service.jpg"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Link text
              </span>
              <input
                value={form.linkText}
                onChange={(event) =>
                  setForm({ ...form, linkText: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Link URL
              </span>
              <input
                value={form.linkUrl}
                onChange={(event) =>
                  setForm({ ...form, linkUrl: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Highlight color
              </span>
              <input
                type="color"
                value={form.color}
                onChange={(event) =>
                  setForm({ ...form, color: event.target.value })
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 p-1"
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <span>Active</span>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm({ ...form, isActive: event.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Link
              to="/admin/services"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              Cancel
            </Link>
            <AdminButton type="submit" variant="secondary" disabled={saving}>
              {saving
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                  ? "Update service"
                  : "Create service"}
            </AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Services"
        description="Manage hospital service offerings and care categories."
        action={
          <Link to="/admin/services/new">
            <AdminButton variant="secondary">
              <Plus className="h-4 w-4" />
              Add service
            </AdminButton>
          </Link>
        }
      />

      {error && <ErrorState title="Unable to load services" message={error} />}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search services..."
          />
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading services..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No services found"
          description="Add your first service to get started."
          actionLabel="Create service"
          actionHref="/admin/services/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Image</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((service) => (
                  <tr
                    key={service.id}
                    className="border-t border-slate-200 align-top"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {service.title}
                          </p>
                          <p className="mt-1 max-w-sm text-xs text-slate-500">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {service.category || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        value={service.isActive}
                        trueLabel="Active"
                        falseLabel="Inactive"
                      />
                    </td>
                    <td className="px-4 py-4">
                      {service.image ? (
                        <img
                          src={getImageUrl(service.image)}
                          alt={service.title}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/services/${service.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                          aria-label={`Edit ${service.title}`}
                        >
                          <PencilLine className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(service.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                          aria-label={`Delete ${service.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        title="Delete service?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ServicesPage;

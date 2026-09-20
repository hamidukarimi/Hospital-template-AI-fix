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
import {
  adminFormActionsClass,
  adminFormClass,
  adminFormGridClass,
  adminFormPageWrap,
} from "../../utils/adminHelpers";
import { getImageUrl } from "../../utils/adminHelpers";

interface ServiceItem {
  id: string;
  title: string;
  slug?: string | null;
  description: string;
  image?: string | null;
  category?: string | null;
  linkText?: string | null;
  linkUrl?: string | null;
  color: string;
  isActive?: boolean;
  sortOrder?: number;
  heroTitle?: string | null;
  heroDescription?: string | null;
  heroImage?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  overviewSmallTitle?: string | null;
  overviewTitle?: string | null;
  overviewDescription?: string | null;
  overviewImage?: string | null;
  overviewSecondaryTitle?: string | null;
  overviewSecondaryDescription?: string | null;
  overviewCtaText?: string | null;
  overviewCtaUrl?: string | null;
  metrics?: unknown[];
  partners?: unknown[];
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  image: "",
  category: "",
  linkText: "",
  linkUrl: "",
  color: "#147BD5",
  isActive: true,
  sortOrder: 0,
  heroTitle: "",
  heroDescription: "",
  heroImage: "",
  ctaText: "",
  ctaUrl: "",
  overviewSmallTitle: "",
  overviewTitle: "",
  overviewDescription: "",
  overviewImage: "",
  overviewSecondaryTitle: "",
  overviewSecondaryDescription: "",
  overviewCtaText: "",
  overviewCtaUrl: "",
  metricsJson: "[]",
  partnersJson: "[]",
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
          slug: item.slug ?? "",
          description: item.description ?? "",
          image: item.image ?? "",
          category: item.category ?? "",
          linkText: item.linkText ?? "",
          linkUrl: item.linkUrl ?? "",
          color: item.color ?? "#147BD5",
          isActive: item.isActive ?? true,
          sortOrder: item.sortOrder ?? 0,
          heroTitle: item.heroTitle ?? "",
          heroDescription: item.heroDescription ?? "",
          heroImage: item.heroImage ?? "",
          ctaText: item.ctaText ?? "",
          ctaUrl: item.ctaUrl ?? "",
          overviewSmallTitle: item.overviewSmallTitle ?? "",
          overviewTitle: item.overviewTitle ?? "",
          overviewDescription: item.overviewDescription ?? "",
          overviewImage: item.overviewImage ?? "",
          overviewSecondaryTitle: item.overviewSecondaryTitle ?? "",
          overviewSecondaryDescription: item.overviewSecondaryDescription ?? "",
          overviewCtaText: item.overviewCtaText ?? "",
          overviewCtaUrl: item.overviewCtaUrl ?? "",
          metricsJson: JSON.stringify(item.metrics ?? [], null, 2),
          partnersJson: JSON.stringify(item.partners ?? [], null, 2),
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
        slug: form.slug.trim() || undefined,
        description: form.description.trim(),
        image: form.image.trim(),
        category: form.category.trim() || null,
        linkText: form.linkText.trim() || null,
        linkUrl: form.linkUrl.trim() || null,
        color: form.color,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
        ctaText: form.ctaText.trim() || null,
        ctaUrl: form.ctaUrl.trim() || null,
        overviewTitle: form.overviewTitle.trim() || null,
        overviewDescription: form.overviewDescription.trim() || null,
        metrics: JSON.parse(form.metricsJson || "[]"),
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
      <div className={adminFormPageWrap.md}>
        <PageHeader
          title={editingId ? "Edit service" : "Create service"}
          description={
            editingId
              ? "Update the service details below."
              : "Add a new service offer to the hospital website."
          }
          backLink="/admin/services"
        />

        <form onSubmit={handleSubmit} className={adminFormClass}>
          <div className={adminFormGridClass}>
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
                Public slug
              </span>
              <input
                value={form.slug}
                onChange={(event) =>
                  setForm({ ...form, slug: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                placeholder="cardiology"
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

            <div className="border-t border-slate-200 pt-5 md:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Service details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Content shown on the public slug page.
              </p>
            </div>
            {(
              [
                "heroTitle",
                "heroDescription",
                "heroImage",
                "ctaText",
                "ctaUrl",
                "overviewSmallTitle",
                "overviewTitle",
                "overviewDescription",
                "overviewImage",
                "overviewSecondaryTitle",
                "overviewSecondaryDescription",
                "overviewCtaText",
                "overviewCtaUrl",
              ] as const
            ).map((field) => (
              <label key={field} className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium capitalize text-slate-700">
                  {field.replace(/[A-Z]/g, (letter) => ` ${letter}`)}
                </span>
                {field.toLowerCase().includes("description") ? (
                  <textarea
                    rows={3}
                    value={form[field]}
                    onChange={(event) =>
                      setForm({ ...form, [field]: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                  />
                ) : (
                  <input
                    value={form[field]}
                    onChange={(event) =>
                      setForm({ ...form, [field]: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                  />
                )}
              </label>
            ))}
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Hero and overview metrics JSON
              </span>
              <textarea
                rows={5}
                value={form.metricsJson}
                onChange={(event) =>
                  setForm({ ...form, metricsJson: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs"
                placeholder='[{"label":"Departments","value":24,"suffix":"+","sortOrder":1}]'
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Partners JSON
              </span>
              <textarea
                rows={5}
                value={form.partnersJson}
                onChange={(event) =>
                  setForm({ ...form, partnersJson: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs"
                placeholder='[{"name":"Joint Commission International","sortOrder":1}]'
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

          <div className={adminFormActionsClass}>
            <Link
              to="/admin/services"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
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

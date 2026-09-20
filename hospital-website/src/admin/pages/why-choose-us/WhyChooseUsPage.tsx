import { PencilLine, Plus, Trash2 } from "lucide-react";
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

interface WhyChooseUsItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  linkText?: string | null;
  linkUrl?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

const emptyForm = {
  icon: "stethoscope",
  title: "",
  description: "",
  color: "#147BD5",
  linkText: "",
  linkUrl: "",
  sortOrder: 0,
  isActive: true,
};

const WhyChooseUsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [items, setItems] = useState<WhyChooseUsItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isFormView =
    location.pathname.endsWith("/new") ||
    /\/why-choose-us\/.+\/edit$/.test(location.pathname);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.get<WhyChooseUsItem[]>(
          "/admin/why-choose-us",
        );
        setItems(data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load why choose us items.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isFormView) void load();
  }, [isFormView]);

  useEffect(() => {
    const match = location.pathname.match(/\/why-choose-us\/(.+)\/edit$/);
    const id = match?.[1];

    if (!id) {
      setForm(emptyForm);
      setEditingId(null);
      return;
    }

    const loadItem = async () => {
      try {
        const item = await adminApi.get<WhyChooseUsItem>(
          `/admin/why-choose-us/${id}`,
        );
        setEditingId(id);
        setForm({
          icon: item.icon ?? "stethoscope",
          title: item.title ?? "",
          description: item.description ?? "",
          color: item.color ?? "#147BD5",
          linkText: item.linkText ?? "",
          linkUrl: item.linkUrl ?? "",
          sortOrder: item.sortOrder ?? 0,
          isActive: item.isActive ?? true,
        });
      } catch {
        setError("Unable to load item.");
      }
    };

    void loadItem();
  }, [location.pathname]);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return items;

    return items.filter((item) =>
      [item.title, item.description, item.icon].some((field) =>
        (field ?? "").toLowerCase().includes(value),
      ),
    );
  }, [items, search]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        icon: form.icon,
        title: form.title.trim(),
        description: form.description.trim(),
        color: form.color,
        linkText: form.linkText.trim() || null,
        linkUrl: form.linkUrl.trim() || null,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
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
        await adminApi.patch(`/admin/why-choose-us/${editingId}`, payload);
        pushToast({ type: "success", title: "Item updated successfully." });
      } else {
        await adminApi.post("/admin/why-choose-us", payload);
        pushToast({ type: "success", title: "Item created successfully." });
      }

      navigate("/admin/why-choose-us");
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save item",
        description:
          submitError instanceof Error
            ? submitError.message
            : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await adminApi.delete(`/admin/why-choose-us/${deleteTargetId}`);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTargetId),
      );
      pushToast({ type: "success", title: "Item deleted successfully." });
    } catch (deleteError) {
      pushToast({
        type: "error",
        title: "Unable to delete item",
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
          title={editingId ? "Edit item" : "Create item"}
          description={
            editingId
              ? "Update the feature highlight."
              : "Add a brand highlight for the Why Choose Us section."
          }
          backLink="/admin/why-choose-us"
        />

        <form onSubmit={handleSubmit} className={adminFormClass}>
          <div className={adminFormGridClass}>
            <label className="space-y-2">
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

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Icon</span>
              <input
                value={form.icon}
                onChange={(event) =>
                  setForm({ ...form, icon: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
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
              <span className="text-sm font-medium text-slate-700">Color</span>
              <input
                type="color"
                value={form.color}
                onChange={(event) =>
                  setForm({ ...form, color: event.target.value })
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 p-1"
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
              to="/admin/why-choose-us"
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
                  ? "Update item"
                  : "Create item"}
            </AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Why Choose Us"
        description="Showcase the qualities that make the hospital stand out."
        action={
          <Link to="/admin/why-choose-us/new">
            <AdminButton variant="secondary">
              <Plus className="h-4 w-4" />
              Add item
            </AdminButton>
          </Link>
        }
      />

      {error && <ErrorState title="Unable to load items" message={error} />}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search items..."
        />
      </div>

      {loading ? (
        <LoadingState label="Loading why choose us items..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No items found"
          description="Create a feature highlight to show what sets the hospital apart."
          actionLabel="Create item"
          actionHref="/admin/why-choose-us/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-200 align-top"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {item.title}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {item.description}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        value={item.isActive}
                        trueLabel="Active"
                        falseLabel="Inactive"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/why-choose-us/${item.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(item.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
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
        title="Delete item?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default WhyChooseUsPage;

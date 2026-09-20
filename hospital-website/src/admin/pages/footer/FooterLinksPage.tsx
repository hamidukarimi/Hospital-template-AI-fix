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

interface FooterColumnOption {
  id: string;
  title: string;
  isActive?: boolean;
}

interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
  sortOrder?: number;
  isActive?: boolean;
  footerColumnId?: string;
}

const emptyForm = {
  label: "",
  url: "",
  sortOrder: 0,
  isActive: true,
  footerColumnId: "",
};

const FooterLinksPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [items, setItems] = useState<FooterLinkItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [footerColumns, setFooterColumns] = useState<FooterColumnOption[]>(
    [],
  );
  const [columnsLoading, setColumnsLoading] = useState(false);

  const isFormView =
    location.pathname.endsWith("/new") ||
    /\/footer-links\/.+\/edit$/.test(location.pathname);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.get<FooterLinkItem[]>(
          "/admin/footer-links",
        );
        setItems(data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load footer links.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isFormView) void load();
  }, [isFormView]);

  useEffect(() => {
    const match = location.pathname.match(/\/footer-links\/(.+)\/edit$/);
    const id = match?.[1];

    if (!id) {
      setForm(emptyForm);
      setEditingId(null);
      return;
    }

    const loadItem = async () => {
      try {
        const item = await adminApi.get<FooterLinkItem>(
          `/admin/footer-links/${id}`,
        );
        setEditingId(id);
        setForm({
          label: item.label ?? "",
          url: item.url ?? "",
          sortOrder: item.sortOrder ?? 0,
          isActive: item.isActive ?? true,
          footerColumnId: item.footerColumnId ?? "",
        });
      } catch {
        setError("Unable to load footer link.");
      }
    };

    void loadItem();
  }, [location.pathname]);

  useEffect(() => {
    if (!isFormView) return;

    const loadColumns = async () => {
      setColumnsLoading(true);
      try {
        const data = await adminApi.get<FooterColumnOption[]>(
          "/admin/footer-columns",
        );
        setFooterColumns(data ?? []);
      } catch {
        pushToast({
          type: "error",
          title: "Unable to load footer columns",
          description: "Refresh the page and try again.",
        });
      } finally {
        setColumnsLoading(false);
      }
    };

    void loadColumns();
  }, [isFormView, pushToast]);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return items;

    return items.filter((item) =>
      [item.label, item.url].some((field) =>
        (field ?? "").toLowerCase().includes(value),
      ),
    );
  }, [items, search]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        label: form.label.trim(),
        url: form.url.trim(),
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
        footerColumnId: form.footerColumnId.trim(),
      };

      if (!payload.label || !payload.url) {
        pushToast({
          type: "error",
          title: "Required details missing",
          description: "Label and URL are required.",
        });
        return;
      }

      if (!payload.footerColumnId) {
        pushToast({
          type: "error",
          title: "Footer column required",
          description: "Select the footer column this link belongs to.",
        });
        return;
      }

      if (editingId) {
        await adminApi.patch(`/admin/footer-links/${editingId}`, payload);
        pushToast({ type: "success", title: "Footer link updated." });
      } else {
        await adminApi.post("/admin/footer-links", payload);
        pushToast({ type: "success", title: "Footer link created." });
      }

      navigate("/admin/footer-links");
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save footer link",
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
      await adminApi.delete(`/admin/footer-links/${deleteTargetId}`);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTargetId),
      );
      pushToast({ type: "success", title: "Footer link deleted." });
    } catch (deleteError) {
      pushToast({
        type: "error",
        title: "Unable to delete footer link",
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
      <div className={adminFormPageWrap.sm}>
        <PageHeader
          title={editingId ? "Edit footer link" : "Create footer link"}
          description={
            editingId
              ? "Update the footer link."
              : "Add a link under a footer section."
          }
          backLink="/admin/footer-links"
        />

        <form onSubmit={handleSubmit} className={adminFormClass}>
          <div className={adminFormGridClass}>
            <label className="min-w-0 space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Footer column
              </span>
              <select
                value={form.footerColumnId}
                onChange={(event) =>
                  setForm({ ...form, footerColumnId: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
                disabled={columnsLoading}
              >
                <option value="">
                  {columnsLoading
                    ? "Loading columns..."
                    : "Select a footer column"}
                </option>
                {footerColumns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                    {column.isActive === false ? " (inactive)" : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="min-w-0 space-y-2">
              <span className="text-sm font-medium text-slate-700">Label</span>
              <input
                value={form.label}
                onChange={(event) =>
                  setForm({ ...form, label: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
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
              <span className="text-sm font-medium text-slate-700">URL</span>
              <input
                value={form.url}
                onChange={(event) =>
                  setForm({ ...form, url: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
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
              to="/admin/footer-links"
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
                  ? "Update link"
                  : "Create link"}
            </AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Footer Links"
        description="Add direct links to each footer column."
        action={
          <Link to="/admin/footer-links/new">
            <AdminButton variant="secondary">
              <Plus className="h-4 w-4" />
              Add link
            </AdminButton>
          </Link>
        }
      />

      {error && (
        <ErrorState title="Unable to load footer links" message={error} />
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search footer links..."
        />
      </div>

      {loading ? (
        <LoadingState label="Loading footer links..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No footer links found"
          description="Add useful links inside your footer sections."
          actionLabel="Create link"
          actionHref="/admin/footer-links/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Label</th>
                  <th className="px-4 py-3 font-semibold">URL</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((link) => (
                  <tr
                    key={link.id}
                    className="border-t border-slate-200 align-top"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {link.label}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{link.url}</td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        value={link.isActive}
                        trueLabel="Active"
                        falseLabel="Inactive"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/footer-links/${link.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(link.id)}
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
        title="Delete footer link?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default FooterLinksPage;

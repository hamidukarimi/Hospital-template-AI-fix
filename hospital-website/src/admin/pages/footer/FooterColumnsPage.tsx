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

interface FooterColumnItem {
  id: string;
  title: string;
  sortOrder?: number;
  isActive?: boolean;
  footerSettingsId?: string;
}

const emptyForm = {
  title: "",
  sortOrder: 0,
  isActive: true,
  footerSettingsId: "",
};

const FooterColumnsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [items, setItems] = useState<FooterColumnItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isFormView =
    location.pathname.endsWith("/new") ||
    /\/footer-columns\/.+\/edit$/.test(location.pathname);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.get<FooterColumnItem[]>(
          "/admin/footer-columns",
        );
        setItems(data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load footer columns.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isFormView) void load();
  }, [isFormView]);

  useEffect(() => {
    const match = location.pathname.match(/\/footer-columns\/(.+)\/edit$/);
    const id = match?.[1];

    if (!id) {
      setForm(emptyForm);
      setEditingId(null);
      return;
    }

    const loadItem = async () => {
      try {
        const item = await adminApi.get<FooterColumnItem>(
          `/admin/footer-columns/${id}`,
        );
        setEditingId(id);
        setForm({
          title: item.title ?? "",
          sortOrder: item.sortOrder ?? 0,
          isActive: item.isActive ?? true,
          footerSettingsId: item.footerSettingsId ?? "",
        });
      } catch {
        setError("Unable to load footer column.");
      }
    };

    void loadItem();
  }, [location.pathname]);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return items;

    return items.filter((item) => item.title.toLowerCase().includes(value));
  }, [items, search]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const resolvedFooterSettingsId =
        form.footerSettingsId ||
        (await adminApi.get<{ id?: string } | null>("/admin/footer-settings"))
          ?.id;

      if (!resolvedFooterSettingsId) {
        throw new Error("No footer settings record is available.");
      }

      setForm((current) => ({
        ...current,
        footerSettingsId: resolvedFooterSettingsId,
      }));

      const payload = {
        title: form.title.trim(),
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
        footerSettingsId: resolvedFooterSettingsId,
      };

      if (!payload.title) {
        pushToast({
          type: "error",
          title: "Title required",
          description: "A title is required for the footer column.",
        });
        return;
      }

      if (editingId) {
        await adminApi.patch(`/admin/footer-columns/${editingId}`, payload);
        pushToast({ type: "success", title: "Footer column updated." });
      } else {
        await adminApi.post("/admin/footer-columns", payload);
        pushToast({ type: "success", title: "Footer column created." });
      }

      navigate("/admin/footer-columns");
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save footer column",
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
      await adminApi.delete(`/admin/footer-columns/${deleteTargetId}`);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTargetId),
      );
      pushToast({ type: "success", title: "Footer column deleted." });
    } catch (deleteError) {
      pushToast({
        type: "error",
        title: "Unable to delete footer column",
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
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title={editingId ? "Edit footer column" : "Create footer column"}
          description={
            editingId
              ? "Update the column label."
              : "Add a footer grouping section."
          }
          backLink="/admin/footer-columns"
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
              to="/admin/footer-columns"
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
                  ? "Update column"
                  : "Create column"}
            </AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Footer Columns"
        description="Organize the footer information sections."
        action={
          <Link to="/admin/footer-columns/new">
            <AdminButton variant="secondary">
              <Plus className="h-4 w-4" />
              Add column
            </AdminButton>
          </Link>
        }
      />

      {error && (
        <ErrorState title="Unable to load footer columns" message={error} />
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search footer columns..."
        />
      </div>

      {loading ? (
        <LoadingState label="Loading footer columns..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No footer columns found"
          description="Add a footer section to group important links."
          actionLabel="Create column"
          actionHref="/admin/footer-columns/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((column) => (
                  <tr
                    key={column.id}
                    className="border-t border-slate-200 align-top"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {column.title}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        value={column.isActive}
                        trueLabel="Active"
                        falseLabel="Inactive"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/footer-columns/${column.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(column.id)}
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
        title="Delete footer column?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default FooterColumnsPage;

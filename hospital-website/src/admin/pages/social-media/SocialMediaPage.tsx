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

interface SocialMediaItem {
  id: string;
  platform: string;
  url: string;
  isActive?: boolean;
  siteSettingsId?: string;
}

const emptyForm = {
  platform: "FACEBOOK",
  url: "",
  isActive: true,
  siteSettingsId: "",
};

const SocialMediaPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [items, setItems] = useState<SocialMediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isFormView =
    location.pathname.endsWith("/new") ||
    /\/social-media\/.+\/edit$/.test(location.pathname);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.get<SocialMediaItem[]>(
          "/admin/social-media",
        );
        setItems(data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load social links.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isFormView) void load();
  }, [isFormView]);

  useEffect(() => {
    const match = location.pathname.match(/\/social-media\/(.+)\/edit$/);
    const id = match?.[1];

    if (!id) {
      setForm(emptyForm);
      setEditingId(null);
      return;
    }

    const loadItem = async () => {
      try {
        const item = await adminApi.get<SocialMediaItem>(
          `/admin/social-media/${id}`,
        );
        setEditingId(id);
        setForm({
          platform: item.platform ?? "FACEBOOK",
          url: item.url ?? "",
          isActive: item.isActive ?? true,
          siteSettingsId: item.siteSettingsId ?? "",
        });
      } catch {
        setError("Unable to load social media item.");
      }
    };

    void loadItem();
  }, [location.pathname]);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return items;

    return items.filter((item) =>
      [item.platform, item.url].some((field) =>
        (field ?? "").toLowerCase().includes(value),
      ),
    );
  }, [items, search]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const resolvedSiteSettingsId =
        form.siteSettingsId ||
        (await adminApi.get<{ id?: string } | null>("/admin/site-settings"))
          ?.id;

      if (!resolvedSiteSettingsId) {
        throw new Error("No site settings record is available.");
      }

      setForm((current) => ({
        ...current,
        siteSettingsId: resolvedSiteSettingsId,
      }));

      const payload = {
        platform: form.platform,
        url: form.url.trim(),
        isActive: form.isActive,
        siteSettingsId: resolvedSiteSettingsId,
      };

      if (!payload.url) {
        pushToast({
          type: "error",
          title: "URL required",
          description: "A valid social media URL is required.",
        });
        return;
      }

      if (editingId) {
        await adminApi.patch(`/admin/social-media/${editingId}`, payload);
        pushToast({ type: "success", title: "Social media updated." });
      } else {
        await adminApi.post("/admin/social-media", payload);
        pushToast({ type: "success", title: "Social media created." });
      }

      navigate("/admin/social-media");
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save social media",
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
      await adminApi.delete(`/admin/social-media/${deleteTargetId}`);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTargetId),
      );
      pushToast({ type: "success", title: "Social media deleted." });
    } catch (deleteError) {
      pushToast({
        type: "error",
        title: "Unable to delete social media",
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
          title={editingId ? "Edit social media" : "Create social media"}
          description={
            editingId
              ? "Update the platform link."
              : "Add a new social media profile."
          }
          backLink="/admin/social-media"
        />

        <form onSubmit={handleSubmit} className={adminFormClass}>
          <div className={adminFormGridClass}>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Platform
              </span>
              <select
                value={form.platform}
                onChange={(event) =>
                  setForm({ ...form, platform: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              >
                <option value="FACEBOOK">FACEBOOK</option>
                <option value="INSTAGRAM">INSTAGRAM</option>
                <option value="TWITTER">TWITTER</option>
                <option value="LINKEDIN">LINKEDIN</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <div className="flex h-[46px] items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm">
                <span>Active</span>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm({ ...form, isActive: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
              </div>
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
          </div>

          <div className={adminFormActionsClass}>
            <Link
              to="/admin/social-media"
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
        title="Social Media"
        description="Manage the hospital's public social profile links."
        action={
          <Link to="/admin/social-media/new">
            <AdminButton variant="secondary">
              <Plus className="h-4 w-4" />
              Add link
            </AdminButton>
          </Link>
        }
      />

      {error && (
        <ErrorState title="Unable to load social media" message={error} />
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search social links..."
        />
      </div>

      {loading ? (
        <LoadingState label="Loading social media..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No social links found"
          description="Add the first platform connection for the hospital."
          actionLabel="Create link"
          actionHref="/admin/social-media/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Platform</th>
                  <th className="px-4 py-3 font-semibold">URL</th>
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
                      {item.platform}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{item.url}</td>
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
                          to={`/admin/social-media/${item.id}/edit`}
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
        title="Delete social link?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SocialMediaPage;

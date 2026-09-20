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

interface HelpSectionOption {
  id: string;
  title: string;
  isActive?: boolean;
}

interface HelpCardItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  color: string;
  sortOrder?: number;
  isActive?: boolean;
  helpSectionId?: string;
}

const allowedIcons = [
  "stethoscope",
  "shield-check",
  "heart-pulse",
  "activity",
  "clock",
  "ambulance",
];
const emptyForm = {
  icon: "stethoscope",
  title: "",
  description: "",
  buttonText: "",
  buttonUrl: "",
  color: "#F7C12B",
  sortOrder: 0,
  isActive: true,
  helpSectionId: "",
};

const HelpCardsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [items, setItems] = useState<HelpCardItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [helpSections, setHelpSections] = useState<HelpSectionOption[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);

  const isFormView =
    location.pathname.endsWith("/new") ||
    /\/help-cards\/.+\/edit$/.test(location.pathname);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.get<HelpCardItem[]>("/admin/help-cards");
        setItems(data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load help cards.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isFormView) void load();
  }, [isFormView]);

  useEffect(() => {
    const match = location.pathname.match(/\/help-cards\/(.+)\/edit$/);
    const id = match?.[1];

    if (!id) {
      setForm(emptyForm);
      setEditingId(null);
      return;
    }

    const loadItem = async () => {
      try {
        const item = await adminApi.get<HelpCardItem>(
          `/admin/help-cards/${id}`,
        );
        setEditingId(id);
        setForm({
          icon: item.icon ?? "stethoscope",
          title: item.title ?? "",
          description: item.description ?? "",
          buttonText: item.buttonText ?? "",
          buttonUrl: item.buttonUrl ?? "",
          color: item.color ?? "#F7C12B",
          sortOrder: item.sortOrder ?? 0,
          isActive: item.isActive ?? true,
          helpSectionId: item.helpSectionId ?? "",
        });
      } catch {
        setError("Unable to load help card.");
      }
    };

    void loadItem();
  }, [location.pathname]);

  useEffect(() => {
    if (!isFormView) return;

    const loadSections = async () => {
      setSectionsLoading(true);
      try {
        const data = await adminApi.get<HelpSectionOption[]>(
          "/admin/help-cards/sections",
        );
        setHelpSections(data ?? []);
      } catch {
        pushToast({
          type: "error",
          title: "Unable to load help sections",
          description: "Refresh the page and try again.",
        });
      } finally {
        setSectionsLoading(false);
      }
    };

    void loadSections();
  }, [isFormView, pushToast]);

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
        icon: allowedIcons.includes(form.icon) ? form.icon : "stethoscope",
        title: form.title.trim(),
        description: form.description.trim(),
        buttonText: form.buttonText.trim(),
        buttonUrl: form.buttonUrl.trim(),
        color: form.color,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
        helpSectionId: form.helpSectionId.trim(),
      };

      if (
        !payload.title ||
        !payload.description ||
        !payload.buttonText ||
        !payload.buttonUrl
      ) {
        pushToast({
          type: "error",
          title: "Missing required fields",
          description: "Title, description, button text, and URL are required.",
        });
        return;
      }

      if (!payload.helpSectionId) {
        pushToast({
          type: "error",
          title: "Help section required",
          description: "Select the help section this card belongs to.",
        });
        return;
      }

      if (editingId) {
        await adminApi.patch(`/admin/help-cards/${editingId}`, payload);
        pushToast({
          type: "success",
          title: "Help card updated successfully.",
        });
      } else {
        await adminApi.post("/admin/help-cards", payload);
        pushToast({
          type: "success",
          title: "Help card created successfully.",
        });
      }

      navigate("/admin/help-cards");
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save help card",
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
      await adminApi.delete(`/admin/help-cards/${deleteTargetId}`);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTargetId),
      );
      pushToast({ type: "success", title: "Help card deleted successfully." });
    } catch (deleteError) {
      pushToast({
        type: "error",
        title: "Unable to delete help card",
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
          title={editingId ? "Edit help card" : "Create help card"}
          description={
            editingId
              ? "Update the help card."
              : "Add a support card to the help section."
          }
          backLink="/admin/help-cards"
        />

        <form onSubmit={handleSubmit} className={adminFormClass}>
          <div className={adminFormGridClass}>
            <label className="min-w-0 space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Help section
              </span>
              <select
                value={form.helpSectionId}
                onChange={(event) =>
                  setForm({ ...form, helpSectionId: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
                disabled={sectionsLoading}
              >
                <option value="">
                  {sectionsLoading
                    ? "Loading sections..."
                    : "Select a help section"}
                </option>
                {helpSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                    {section.isActive === false ? " (inactive)" : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="min-w-0 space-y-2">
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
              <select
                value={form.icon}
                onChange={(event) =>
                  setForm({ ...form, icon: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              >
                {allowedIcons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
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
                Button text
              </span>
              <input
                value={form.buttonText}
                onChange={(event) =>
                  setForm({ ...form, buttonText: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Button URL
              </span>
              <input
                value={form.buttonUrl}
                onChange={(event) =>
                  setForm({ ...form, buttonUrl: event.target.value })
                }
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
              to="/admin/help-cards"
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
                  ? "Update help card"
                  : "Create help card"}
            </AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Help Cards"
        description="Manage educational and support callouts across the site."
        action={
          <Link to="/admin/help-cards/new">
            <AdminButton variant="secondary">
              <Plus className="h-4 w-4" />
              Add help card
            </AdminButton>
          </Link>
        }
      />

      {error && (
        <ErrorState title="Unable to load help cards" message={error} />
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search help cards..."
        />
      </div>

      {loading ? (
        <LoadingState label="Loading help cards..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No help cards found"
          description="Create a help card to guide patients to the right services."
          actionLabel="Create help card"
          actionHref="/admin/help-cards/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Card</th>
                  <th className="px-4 py-3 font-semibold">Button</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((card) => (
                  <tr
                    key={card.id}
                    className="border-t border-slate-200 align-top"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {card.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {card.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {card.buttonText}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        value={card.isActive}
                        trueLabel="Active"
                        falseLabel="Inactive"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/help-cards/${card.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(card.id)}
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
        title="Delete help card?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default HelpCardsPage;

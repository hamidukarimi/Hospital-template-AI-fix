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

interface TestimonialItem {
  id: string;
  name: string;
  role?: string | null;
  content: string;
  image?: string | null;
  rating?: number | null;
  sortOrder?: number;
  isActive?: boolean;
}

const emptyForm = {
  name: "",
  role: "",
  content: "",
  image: "",
  rating: 5,
  sortOrder: 0,
  isActive: true,
};

const TestimonialsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isFormView =
    location.pathname.endsWith("/new") ||
    /\/testimonials\/.+\/edit$/.test(location.pathname);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.get<TestimonialItem[]>(
          "/admin/testimonials",
        );
        setItems(data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load testimonials.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isFormView) void load();
  }, [isFormView]);

  useEffect(() => {
    const match = location.pathname.match(/\/testimonials\/(.+)\/edit$/);
    const id = match?.[1];

    if (!id) {
      setForm(emptyForm);
      setEditingId(null);
      return;
    }

    const loadItem = async () => {
      try {
        const item = await adminApi.get<TestimonialItem>(
          `/admin/testimonials/${id}`,
        );
        setEditingId(id);
        setForm({
          name: item.name ?? "",
          role: item.role ?? "",
          content: item.content ?? "",
          image: item.image ?? "",
          rating: item.rating ?? 5,
          sortOrder: item.sortOrder ?? 0,
          isActive: item.isActive ?? true,
        });
      } catch {
        setError("Unable to load testimonial.");
      }
    };

    void loadItem();
  }, [location.pathname]);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return items;

    return items.filter((item) =>
      [item.name, item.role, item.content].some((field) =>
        (field ?? "").toLowerCase().includes(value),
      ),
    );
  }, [items, search]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim() || null,
        content: form.content.trim(),
        image: form.image.trim(),
        rating: Number(form.rating) || 5,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      };

      if (!payload.name || !payload.content) {
        pushToast({
          type: "error",
          title: "Missing required fields",
          description: "Name and content are required.",
        });
        return;
      }

      if (editingId) {
        await adminApi.patch(`/admin/testimonials/${editingId}`, payload);
        pushToast({
          type: "success",
          title: "Testimonial updated successfully.",
        });
      } else {
        await adminApi.post("/admin/testimonials", payload);
        pushToast({
          type: "success",
          title: "Testimonial created successfully.",
        });
      }

      navigate("/admin/testimonials");
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save testimonial",
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
      await adminApi.delete(`/admin/testimonials/${deleteTargetId}`);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTargetId),
      );
      pushToast({
        type: "success",
        title: "Testimonial deleted successfully.",
      });
    } catch (deleteError) {
      pushToast({
        type: "error",
        title: "Unable to delete testimonial",
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
          title={editingId ? "Edit testimonial" : "Create testimonial"}
          description={
            editingId
              ? "Update patient feedback."
              : "Add a new patient testimonial."
          }
          backLink="/admin/testimonials"
        />

        <form onSubmit={handleSubmit} className={adminFormClass}>
          <div className={adminFormGridClass}>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <input
                value={form.role}
                onChange={(event) =>
                  setForm({ ...form, role: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Content
              </span>
              <textarea
                value={form.content}
                onChange={(event) =>
                  setForm({ ...form, content: event.target.value })
                }
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Rating</span>
              <input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(event) =>
                  setForm({ ...form, rating: Number(event.target.value) })
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
                placeholder="/uploads/testimonials/patient.jpg"
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
              to="/admin/testimonials"
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
                  ? "Update testimonial"
                  : "Create testimonial"}
            </AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Testimonials"
        description="Manage patient feedback and trust-building endorsements."
        action={
          <Link to="/admin/testimonials/new">
            <AdminButton variant="secondary">
              <Plus className="h-4 w-4" />
              Add testimonial
            </AdminButton>
          </Link>
        }
      />

      {error && (
        <ErrorState title="Unable to load testimonials" message={error} />
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search testimonials..."
        />
      </div>

      {loading ? (
        <LoadingState label="Loading testimonials..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No testimonials found"
          description="Add a testimonial to highlight patient experiences."
          actionLabel="Create testimonial"
          actionHref="/admin/testimonials/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Patient</th>
                  <th className="px-4 py-3 font-semibold">Rating</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((testimonial) => (
                  <tr
                    key={testimonial.id}
                    className="border-t border-slate-200 align-top"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {testimonial.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {testimonial.role || "Patient"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {testimonial.rating ?? 0}/5
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        value={testimonial.isActive}
                        trueLabel="Active"
                        falseLabel="Inactive"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/testimonials/${testimonial.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(testimonial.id)}
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
        title="Delete testimonial?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TestimonialsPage;

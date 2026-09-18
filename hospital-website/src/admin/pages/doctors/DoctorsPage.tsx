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

interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  description?: string | null;
  image?: string | null;
  profileUrl?: string | null;
  category?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

const emptyForm = {
  name: "",
  specialty: "",
  description: "",
  image: "",
  profileUrl: "",
  category: "",
  isActive: true,
  sortOrder: 0,
};

const DoctorsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [items, setItems] = useState<DoctorItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isFormView =
    location.pathname.endsWith("/new") ||
    /\/doctors\/.+\/edit$/.test(location.pathname);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await adminApi.get<DoctorItem[]>("/admin/doctors");
        setItems(data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load doctors.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isFormView) void load();
  }, [isFormView]);

  useEffect(() => {
    const match = location.pathname.match(/\/doctors\/(.+)\/edit$/);
    const id = match?.[1];

    if (!id) {
      setForm(emptyForm);
      setEditingId(null);
      return;
    }

    const loadItem = async () => {
      try {
        const item = await adminApi.get<DoctorItem>(`/admin/doctors/${id}`);
        setEditingId(id);
        setForm({
          name: item.name ?? "",
          specialty: item.specialty ?? "",
          description: item.description ?? "",
          image: item.image ?? "",
          profileUrl: item.profileUrl ?? "",
          category: item.category ?? "",
          isActive: item.isActive ?? true,
          sortOrder: item.sortOrder ?? 0,
        });
      } catch {
        setError("Unable to load doctor.");
      }
    };

    void loadItem();
  }, [location.pathname]);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return items;

    return items.filter((item) =>
      [item.name, item.specialty, item.category].some((field) =>
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
        specialty: form.specialty.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        profileUrl: form.profileUrl.trim() || null,
        category: form.category.trim() || null,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };

      if (!payload.name || !payload.specialty || !payload.description) {
        pushToast({
          type: "error",
          title: "Missing required fields",
          description: "Name, specialty, and description are required.",
        });
        return;
      }

      if (editingId) {
        await adminApi.patch(`/admin/doctors/${editingId}`, payload);
        pushToast({ type: "success", title: "Doctor updated successfully." });
      } else {
        await adminApi.post("/admin/doctors", payload);
        pushToast({ type: "success", title: "Doctor created successfully." });
      }

      navigate("/admin/doctors");
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save doctor",
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
      await adminApi.delete(`/admin/doctors/${deleteTargetId}`);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTargetId),
      );
      pushToast({ type: "success", title: "Doctor deleted successfully." });
    } catch (deleteError) {
      pushToast({
        type: "error",
        title: "Unable to delete doctor",
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
          title={editingId ? "Edit doctor" : "Create doctor"}
          backLink="/admin/doctors"
          description={
            editingId
              ? "Update the doctor profile."
              : "Add a physician to the hospital directory."
          }
        />

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2">
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
              <span className="text-sm font-medium text-slate-700">
                Specialty
              </span>
              <input
                value={form.specialty}
                onChange={(event) =>
                  setForm({ ...form, specialty: event.target.value })
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
                placeholder="/uploads/doctors/doctor.jpg"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Profile URL
              </span>
              <input
                value={form.profileUrl}
                onChange={(event) =>
                  setForm({ ...form, profileUrl: event.target.value })
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
              to="/admin/doctors"
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
                  ? "Update doctor"
                  : "Create doctor"}
            </AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Doctors"
        description="Manage specialist profiles and physician directory content."
        action={
          <Link to="/admin/doctors/new">
            <AdminButton variant="secondary">
              <Plus className="h-4 w-4" />
              Add doctor
            </AdminButton>
          </Link>
        }
      />

      {error && <ErrorState title="Unable to load doctors" message={error} />}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search doctors..."
        />
      </div>

      {loading ? (
        <LoadingState label="Loading doctors..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="Add a doctor to begin building your care team."
          actionLabel="Create doctor"
          actionHref="/admin/doctors/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Doctor</th>
                  <th className="px-4 py-3 font-semibold">Specialty</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Image</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-t border-slate-200 align-top"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {doctor.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {doctor.category || "General"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {doctor.specialty}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        value={doctor.isActive}
                        trueLabel="Active"
                        falseLabel="Inactive"
                      />
                    </td>
                    <td className="px-4 py-4">
                      {doctor.image ? (
                        <img
                          src={getImageUrl(doctor.image)}
                          alt={doctor.name}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/doctors/${doctor.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(doctor.id)}
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
        title="Delete doctor?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default DoctorsPage;

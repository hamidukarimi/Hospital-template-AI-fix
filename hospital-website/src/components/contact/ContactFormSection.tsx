import React, { useState } from "react";
import { Send, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { submitContactMessage } from "../../lib/api";

interface OperatingHour {
  department: string;
  hours: string;
}

interface ContactFormSectionProps {
  operatingHours: OperatingHour[];
}

export default function ContactFormSection({ operatingHours }: ContactFormSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "General Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const result = await submitContactMessage(formData);

    if (result) {
      setStatus({ type: "success", text: "Your message has been sent successfully! Our team will contact you shortly." });
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "General Inquiry",
        message: "",
      });
    } else {
      setStatus({ type: "error", text: "Failed to send message. Please try again later." });
    }

    setLoading(false);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-8 border border-slate-200/80 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
            <p className="text-slate-600 mb-6">Fill out the form below and our administrative team will respond within 24 hours.</p>

            {status && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                  status.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {status.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
                <p className="text-sm font-medium">{status.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Appointments">Appointments & Scheduling</option>
                    <option value="Billing">Billing & Insurance</option>
                    <option value="Emergency Care">Emergency Care Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you today?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition shadow-sm"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="ml-2 w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Operating Hours Sidebar */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-sky-400" />
                <h3 className="text-xl font-bold">Operating & Visiting Hours</h3>
              </div>
              <div className="divide-y divide-slate-800 space-y-4">
                {operatingHours.map((item, idx) => (
                  <div key={idx} className="pt-4 first:pt-0 flex justify-between items-center text-sm">
                    <span className="text-slate-300 font-medium">{item.department}</span>
                    <span className="font-semibold text-sky-300">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
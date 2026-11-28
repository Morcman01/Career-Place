"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/app/lib/supabase/client";

const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900";

export default function OnboardingPage() {
    const [fullName, setFullName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    function validate() {
        const e: Record<string, string> = {};
        if (fullName.trim().length < 3) {
        e.fullName = "Nama lengkap minimal 3 karakter.";
        }
        if (!birthDate) {
        e.birthDate = "Tanggal lahir wajib diisi.";
        } else if (new Date(birthDate) > new Date()) {
        e.birthDate = "Tanggal lahir tidak boleh di masa depan.";
        }
        if (!gender) e.gender = "Pilih jenis kelamin.";
        if (!province.trim()) e.province = "Provinsi wajib diisi.";
        if (!city.trim()) e.city = "Kota atau kabupaten wajib diisi.";
        if (!/^(\+62|62|0)8\d{8,12}$/.test(phone.replace(/[\s-]/g, ""))) {
        e.phone = "Nomor HP tidak valid. Contoh: 081234567890";
        }
        return e;
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setFormError("");

        const found = validate();
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setLoading(true);
        const supabase = createClient();

        const {
        data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
        window.location.href = "/login";
        return;
        }

        const { data, error } = await supabase
        .from("profiles")
        .update({
            full_name: fullName.trim(),
            birth_date: birthDate,
            gender,
            province: province.trim(),
            city: city.trim(),
            phone: phone.replace(/[\s-]/g, ""),
        })
        .eq("id", user.id)
        .select("id");

        setLoading(false);

        if (error) {
        setFormError(error.message);
        return;
        }
        if (!data || data.length === 0) {
        setFormError(
            "Data tidak tersimpan. Kemungkinan aturan akses di database belum mengizinkan."
        );
        return;
        }

        window.location.href = "/";
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow"
        >
            <div>
            <h1 className="text-2xl font-bold text-gray-900">
                Lengkapi Profil
            </h1>
            <p className="text-sm text-gray-600">
                Isi data berikut sebelum mulai memakai CareerPlace.
            </p>
            </div>

            <div className="space-y-1">
            <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Nama lengkap
            </label>
            <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
            />
            {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName}</p>
            )}
            </div>

            <div className="space-y-1">
            <label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                Tanggal lahir
            </label>
            <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={inputClass}
            />
            {errors.birthDate && (
                <p className="text-sm text-red-600">{errors.birthDate}</p>
            )}
            </div>

            <div className="space-y-1">
            <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Jenis kelamin
            </label>
            <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={inputClass}
            >
                <option value="">Pilih...</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
            </select>
            {errors.gender && (
                <p className="text-sm text-red-600">{errors.gender}</p>
            )}
            </div>

            <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
                <label htmlFor="province" className="text-sm font-medium text-gray-700">
                Provinsi
                </label>
                <input
                id="province"
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className={inputClass}
                />
                {errors.province && (
                <p className="text-sm text-red-600">{errors.province}</p>
                )}
            </div>
            <div className="space-y-1">
                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                Kota/Kabupaten
                </label>
                <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
                />
                {errors.city && (
                <p className="text-sm text-red-600">{errors.city}</p>
                )}
            </div>
            </div>

            <div className="space-y-1">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                No. HP
            </label>
            <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className={inputClass}
            />
            {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
            )}
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
            {loading ? "Menyimpan..." : "Simpan dan lanjut"}
            </button>
        </form>
        </main>
    );
}
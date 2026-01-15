"use client";

import { useEffect, useMemo, useState } from "react";
import { Member } from "@/lib/types";
import { MemberTable } from "@/components/admin/members/member-table";
import { createColumns } from "@/components/admin/members/member-table-columns";
import { CreateMemberModal } from "@/components/admin/members/create-member-modal";
import { DeleteModal } from "@/components/admin/members/member-delete-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/modal-context";
import { showToast } from "@/lib/toast";

/* ===================== FILTER TYPES ===================== */
type MemberFilters = {
  ageMin?: string;
  ageMax?: string;
  bloodGroup?: string;
  rationCardType?: string;
  educationQualification?: string;
  disease?: string;
  occupation?: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filters, setFilters] = useState<MemberFilters>({});
  const { openModal } = useModal();

  /* ===================== FETCH MEMBERS ===================== */
  const fetchMembers = async (activeFilters?: MemberFilters) => {
    try {
      const params = new URLSearchParams();

      Object.entries(activeFilters || {}).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await fetch(`/api/members?${params.toString()}`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      setMembers(data);
    } catch {
      showToast.error("Failed to fetch members");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  /* ===================== SORT ===================== */
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    });
  }, [members]);

  /* ===================== FILTER UPDATE ===================== */
  const updateFilter = (key: keyof MemberFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  /* ===================== CREATE / UPDATE (UPLOAD SUPPORT) ===================== */
  const handleSaveMember = async (
  data: any,
  pendingFiles?: (File | null)[],
  id?: string
) => {
  try {
    const formData = new FormData();

    /* ---------- TEXT FIELDS ---------- */
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    /* ---------- FILES ---------- */
    pendingFiles?.forEach((file) => {
      if (file) {
        const type = (file as any)._uploadType;
        let key = "images";
        if (type === "ration") key = "rationCardImages";
        else if (type === "other") key = "otherImages";
        formData.append(key, file);
      }
    });

    const url = id ? `/api/members/${id}` : `/api/members`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: formData, // ❗️NO headers
    });

    if (!res.ok) throw new Error();

    const saved = await res.json();

    /* ---------- UPDATE TABLE ---------- */
    setMembers((prev) =>
      id
        ? prev.map((m) => (m.id === id ? saved : m))
        : [saved, ...prev]
    );

    showToast.success(
      id ? "Member updated successfully" : "Member created successfully"
    );
  } catch (error) {
    console.error(error);
    showToast.error("Failed to save member");
  }
};


  /* ===================== DELETE ===================== */
  const handleBulkDeleteMembers = async (ids: string[]) => {
    try {
      const res = await fetch(`/api/members?ids=${ids.join(",")}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setMembers((prev) => prev.filter((m) => !ids.includes(m.id)));
      showToast.success("Members deleted successfully");
    } catch {
      showToast.error("Failed to delete members");
    }
  };

  const columns = createColumns({
    onBulkDelete: handleBulkDeleteMembers,
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* ===================== MODALS ===================== */}
      <CreateMemberModal onSave={handleSaveMember} />

      <DeleteModal
        onDelete={handleBulkDeleteMembers}
        entityName="Member"
        entityNamePlural="Members"
      />

      {/* ===================== HEADER ===================== */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Members</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your members.
          </p>
        </div>
        <Button onClick={() => openModal("createMember")}>
          Create Member
        </Button>
      </div>

      {/* ===================== FILTER BAR ===================== */}
      <div className="flex flex-wrap gap-3 bg-muted/50 p-4 rounded-lg">
        <input placeholder="Min Age" className="border px-3 py-2 rounded-md"
          onChange={(e) => updateFilter("ageMin", e.target.value)} />

        <input placeholder="Max Age" className="border px-3 py-2 rounded-md"
          onChange={(e) => updateFilter("ageMax", e.target.value)} />

        <select className="border px-3 py-2 rounded-md"
          onChange={(e) => updateFilter("bloodGroup", e.target.value)}>
          <option value="">Blood Group</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <select className="border px-3 py-2 rounded-md"
          onChange={(e) => updateFilter("rationCardType", e.target.value)}>
          <option value="">Ration Card</option>
          <option value="Yellow card">Yellow card</option>
          <option value="Pink card">Pink card</option>
          <option value="Blue card">Blue card</option>
          <option value="White card">White card</option>
        </select>

        <input placeholder="Education" className="border px-3 py-2 rounded-md"
          onChange={(e) => updateFilter("educationQualification", e.target.value)} />

        <input placeholder="Disease" className="border px-3 py-2 rounded-md"
          onChange={(e) => updateFilter("disease", e.target.value)} />

        <input placeholder="Occupation" className="border px-3 py-2 rounded-md"
          onChange={(e) => updateFilter("occupation", e.target.value)} />

        <Button onClick={() => fetchMembers(filters)}>Apply Filters</Button>

        <Button variant="outline" onClick={() => {
          setFilters({});
          fetchMembers();
        }}>
          Reset
        </Button>
      </div>

      {/* ===================== TABLE ===================== */}
      <MemberTable columns={columns} data={sortedMembers} />
    </div>
  );
}

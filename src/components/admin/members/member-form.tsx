"use client";

import React, { useState } from "react";
import { Member } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type MemberFormValues = {
  name: string;
  mobileNumber?: string;
  age?: number;

  occupation?: string;
  disease?: string;
  educationQualification?: string;
  schemes: string[];
  others?: string;

  wardArea?: string;
  address?: string;
  dateOfBirth?: string;
  kudumbasreeName?: string;
  voterId?: string;

  images: string[];
  rationCardImages: string[];
  otherImages: string[];

  removedImages?: string[];
  removedRationCardImages?: string[];
  removedOtherImages?: string[];
};

interface MemberFormProps {
  onSubmit: (
    values: MemberFormValues,
    pendingFiles?: (File | null)[]
  ) => void;
  initialData?: Member | null;
  onCancel?: () => void;
}

export function MemberForm({
  onSubmit,
  initialData,
  onCancel,
}: MemberFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [mobileNumber, setMobileNumber] = useState(initialData?.mobileNumber || "");
  const [age, setAge] = useState<number>(initialData?.age || 0);

  const [occupation, setOccupation] = useState(initialData?.occupation || "");
  const [disease, setDisease] = useState(initialData?.disease || "");
  const [educationQualification, setEducationQualification] = useState(
    initialData?.educationQualification || ""
  );
  const [schemesText, setSchemesText] = useState(
    initialData?.schemes?.join(", ") || ""
  );
  const [others, setOthers] = useState(initialData?.others || "");

  const [wardArea, setWardArea] = useState(initialData?.wardArea || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || "");
  const [kudumbasreeName, setKudumbasreeName] = useState(
    initialData?.kudumbasreeName || ""
  );
  const [voterId, setVoterId] = useState(initialData?.voterId || "");

  /* ================= IMAGE STATES ================= */
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [rationCardImages, setRationCardImages] = useState<string[]>(
    initialData?.rationCardImages || []
  );
  const [otherImages, setOtherImages] = useState<string[]>(
    initialData?.otherImages || []
  );

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [removedRationCardImages, setRemovedRationCardImages] = useState<string[]>([]);
  const [removedOtherImages, setRemovedOtherImages] = useState<string[]>([]);

  /* ================= FILE HANDLERS ================= */
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "ration" | "other"
  ) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach((f) => ((f as any)._uploadType = type));
    setPendingFiles((prev) => [...prev, ...files]);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(
      {
        name,
        mobileNumber,
        age,
        occupation,
        disease,
        educationQualification,
        schemes: schemesText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        others,
        wardArea,
        address,
        dateOfBirth,
        kudumbasreeName,
        voterId,
        images,
        rationCardImages,
        otherImages,
        removedImages,
        removedRationCardImages,
        removedOtherImages,
      },
      pendingFiles
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 max-h-[75vh] overflow-y-auto pr-2"
    >
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
      <Input placeholder="Age" type="number" value={age || ""} onChange={(e) => setAge(Number(e.target.value))} />

      <Input placeholder="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
      <Input placeholder="Highest Education" value={educationQualification} onChange={(e) => setEducationQualification(e.target.value)} />

      <Textarea placeholder="Diseases" value={disease} onChange={(e) => setDisease(e.target.value)} />

      <Textarea
        placeholder="Welfare Schemes (comma separated)"
        value={schemesText}
        onChange={(e) => setSchemesText(e.target.value)}
      />

      <Textarea placeholder="Others" value={others} onChange={(e) => setOthers(e.target.value)} />

      <Input placeholder="Ward Area" value={wardArea} onChange={(e) => setWardArea(e.target.value)} />
      <Textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
      <Input placeholder="Kudumbasree Name" value={kudumbasreeName} onChange={(e) => setKudumbasreeName(e.target.value)} />
      <Input placeholder="Voter ID" value={voterId} onChange={(e) => setVoterId(e.target.value)} />

      {/* EXISTING IMAGES */}
      {images.length > 0 && (
        <div>
          <label>Existing Member Images</label>
          <div className="flex gap-2 flex-wrap">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="Member" className="h-16 w-16 rounded object-cover" />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => {
                    setImages(prev => prev.filter(i => i !== img));
                    setRemovedImages(prev => [...prev, img]);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {rationCardImages.length > 0 && (
        <div>
          <label>Existing Ration Card Images</label>
          <div className="flex gap-2 flex-wrap">
            {rationCardImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="Ration Card" className="h-16 w-16 rounded object-cover" />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => {
                    setRationCardImages(prev => prev.filter(i => i !== img));
                    setRemovedRationCardImages(prev => [...prev, img]);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {otherImages.length > 0 && (
        <div>
          <label>Existing Other Images</label>
          <div className="flex gap-2 flex-wrap">
            {otherImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt="Other" className="h-16 w-16 rounded object-cover" />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => {
                    setOtherImages(prev => prev.filter(i => i !== img));
                    setRemovedOtherImages(prev => [...prev, img]);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMAGE UPLOADS */}
      <label>Member Images</label>
      <Input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, "images")} />

      <label>Ration Card Images</label>
      <Input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, "ration")} />

      <label>Other Images</label>
      <Input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, "other")} />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {initialData ? "Update Member" : "Create Member"}
        </Button>
      </div>
    </form>
  );
}

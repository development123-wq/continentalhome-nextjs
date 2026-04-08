"use client";

import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug;

  return (
    <div style={{ padding: "40px" }}>
      <h1>{slug}</h1>
    </div>
  );
}
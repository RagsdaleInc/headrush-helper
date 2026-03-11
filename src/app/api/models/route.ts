import { NextResponse } from "next/server";
import { getLibraryData } from "@/lib/library";

export async function GET() {
  const library = await getLibraryData();
  return NextResponse.json(library);
}

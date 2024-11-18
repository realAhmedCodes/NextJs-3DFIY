// app/api/search/searchByImage/route.ts
// app/api/search/searchByImage/route.ts

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensures the route is treated as dynamic

export async function POST(req: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await req.formData();
    const imageFile = formData.get('file') as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Optional: Validate file type and size server-side
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(imageFile.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Only JPEG and PNG are allowed.' }, { status: 400 });
    }

    if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: 'File size exceeds the limit of 5MB.' }, { status: 400 });
    }

    // Read the file as a buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: imageFile.type });

    // Send the image to FastAPI's /search_image/ endpoint
    const fastApiUrl = `http://localhost:8000/search_image/`;
    const formToFastApi = new FormData();
    formToFastApi.append('file', blob, imageFile.name);

    const fastApiResponse = await fetch(fastApiUrl, {
      method: 'POST',
      body: formToFastApi,
    });

    if (!fastApiResponse.ok) {
      const errorData = await fastApiResponse.json();
      console.error('Error searching image:', errorData);
      return NextResponse.json(
        { error: 'Failed to perform image-based search', details: errorData },
        { status: 500 }
      );
    }

    const fastApiData = await fastApiResponse.json();

    // Ensure 'matches' is present and is an array
    if (!fastApiData.matches || !Array.isArray(fastApiData.matches)) {
      console.error('Invalid response structure:', fastApiData);
      return NextResponse.json(
        { error: 'Invalid response from search service' },
        { status: 500 }
      );
    }

    if (fastApiData.matches.length === 0) {
      return NextResponse.json({ message: 'No similar models found' }, { status: 404 });
    }

    // Extract model_ids from matches
    const modelIds = fastApiData.matches.map((match: any) => match.model_id);

    // Validate that modelIds are numbers
    if (!modelIds.every((id: number) => !isNaN(id))) {
      console.error('Invalid modelIds:', modelIds);
      return NextResponse.json(
        { error: 'Invalid model IDs received from search service' },
        { status: 500 }
      );
    }

    // Return the modelIds
    return NextResponse.json(
      {
        modelIds,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in searchByImage API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during image search' },
      { status: 500 }
    );
  }
}

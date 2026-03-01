/**
 * API Proxy Route
 * Forwards all /api/* requests to the Django backend.
 * BACKEND_URL env var is read at runtime (not baked at build time).
 * This allows the browser to only need port 3000.
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
  const slug = params.slug.join('/');
  const targetUrl = `${backendUrl}/api/${slug}`;

  const contentType = request.headers.get('Content-Type') || '';

  let body: BodyInit | null;
  const fetchHeaders: Record<string, string> = {};

  if (contentType.includes('multipart/form-data')) {
    // File upload: forward FormData (fetch sets Content-Type + boundary automatically)
    body = await request.formData();
  } else {
    body = await request.text();
    fetchHeaders['Content-Type'] = contentType || 'application/json';
  }

  const backendResponse = await fetch(targetUrl, {
    method: 'POST',
    headers: fetchHeaders,
    body,
  });

  const responseContentType = backendResponse.headers.get('Content-Type') || '';

  // Binary response (file download, image, PDF)
  if (!responseContentType.includes('application/json')) {
    const buffer = await backendResponse.arrayBuffer();
    const responseHeaders: Record<string, string> = {
      'Content-Type': responseContentType,
    };
    const disposition = backendResponse.headers.get('Content-Disposition');
    if (disposition) responseHeaders['Content-Disposition'] = disposition;

    return new NextResponse(buffer, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  }

  // JSON response
  const data = await backendResponse.json();
  return NextResponse.json(data, { status: backendResponse.status });
}

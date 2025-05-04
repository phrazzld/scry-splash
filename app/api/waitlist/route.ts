import { NextResponse } from 'next/server';

// Configuration - would typically come from environment variables
const WAITLIST_API_ENDPOINT = 'https://api.getwaitlist.com/api/v1/signup';
// TODO: Replace with your actual waitlist ID from Waitlist.com
const WAITLIST_ID = process.env.WAITLIST_ID || 'YOUR_WAITLIST_ID';

/**
 * POST handler for waitlist signups
 * This endpoint receives email submissions from the waitlist form and
 * forwards them to the Waitlist.com API
 */
export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const data = await req.json();
    
    // Basic validation
    if (!data.email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Email format validation (simple regex check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Prepare the request to Waitlist.com API
    const waitlistData = {
      email: data.email,
      waitlist_id: WAITLIST_ID,
      // Optional fields can be added here if collected
      // first_name: data.firstName,
      // last_name: data.lastName,
    };
    
    // Send request to Waitlist.com API
    const response = await fetch(WAITLIST_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(waitlistData),
    });
    
    // Handle the response from Waitlist.com
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Waitlist API error:', result);
      return NextResponse.json(
        { success: false, error: 'Failed to add to waitlist' },
        { status: response.status }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Successfully added to waitlist',
      position: result.position, // Include position if available from API
      total: result.total,       // Include total if available from API
    });
    
  } catch (error) {
    console.error('Waitlist submission error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
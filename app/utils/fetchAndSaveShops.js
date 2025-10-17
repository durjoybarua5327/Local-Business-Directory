import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
// Correct path to shared Configs folder at repository root
import { db } from '../../Configs/FireBaseConfig';

// Clerk auth hook removed from this utility file; userId should be passed in by caller

const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';

// Quick sanity check for developer: ensure API key is set
if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === 'YOUR_GOOGLE_PLACES_API_KEY') {
  // Don't throw here (so module can still load), but warn loudly so developer notices
  console.warn('\n[fetchAndSaveShops] WARNING: Google Places API key not set.\nSet GOOGLE_PLACES_API_KEY in this file or pass a valid key.\n');
}

// Check if shop already exists in Firebase for this specific user
const shopExistsForUser = async (placeId, userId) => {
  try {
    const q = query(
      collection(db, 'Business List'), 
      where('placeId', '==', placeId),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking shop existence:', error);
    return false;
  }
};

// Save shop to Firebase with user ID
const saveShopToFirebase = async (shopData) => {
  try {
    const docRef = await addDoc(collection(db, 'Business List'), shopData);
    console.log('Business saved with ID: ', docRef.id);
    return true;
  } catch (error) {
    console.error('Error adding business: ', error);
    return false;
  }
};

// Fetch nearby places using the NEW Google Places API
export const fetchAndSaveShops = async (latitude, longitude, userId) => {
  try {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // NEW Places API endpoint
    const url = `https://places.googleapis.com/v1/places:searchNearby`;
    
    // Request body for the NEW API
    const requestBody = {
      includedTypes: ["restaurant", "cafe", "store", "book_store"],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: latitude,
            longitude: longitude
          },
          radius: 1000.0
        }
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.id,places.types,places.rating,places.userRatingCount,places.formattedAddress,places.photos,places.websiteUri,places.reviews,places.editorialSummary'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      // Try to extract useful error information from the response body
      let bodyText = '';
      try {
        bodyText = await response.text();
        // attempt to parse JSON to extract message
        try {
          const parsed = JSON.parse(bodyText);
          const msg = parsed.error?.message || parsed.message || JSON.stringify(parsed);
          console.error('[fetchAndSaveShops] Places API error:', response.status, msg);
          throw new Error(msg || `Places API returned status ${response.status}`);
        } catch (_parseErr) {
          // not JSON
          console.error('[fetchAndSaveShops] Places API returned non-JSON error:', response.status, bodyText);
          throw new Error(`Places API returned status ${response.status}: ${bodyText}`);
        }
      } catch (err) {
        // Couldn't read body for some reason
        console.error('[fetchAndSaveShops] Places API error, status:', response.status, err);
        throw new Error(`Places API returned status ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (!data.places || data.places.length === 0) {
      console.log('No businesses found in the area');
      return 0;
    }

    let savedCount = 0;
    
    for (const place of data.places) {
      // Check if business already exists for this user
      if (await shopExistsForUser(place.id, userId)) {
        console.log(`Business ${place.displayName?.text} already exists for user, skipping...`);
        continue;
      }

      // Get photo URL if available
      let imageUrl = '';
      if (place.photos && place.photos.length > 0) {
        imageUrl = 'https://placehold.co/400x200?text=Business+Image';
      }

      // Process reviews if available
      const reviews = place.reviews ? place.reviews.slice(0, 3).map(review => ({
        userName: review.authorAttribution?.displayName || 'Anonymous',
        userImage: review.authorAttribution?.photoUri || '',
        rating: review.rating || 0,
        comment: review.text?.text || '',
        createdAt: new Date().toISOString()
      })) : [];

      // Prepare business data with user ID
      const businessData = {
        placeId: place.id,
        name: place.displayName?.text || 'Unknown Business',
        address: place.formattedAddress || 'Address not available',
        category: place.types && place.types.length > 0 
          ? place.types[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          : 'Business',
        rating: place.rating || 0,
        numberOfReviews: place.userRatingCount || 0,
        imageUrl: imageUrl,
        about: place.editorialSummary?.text || '',
        website: place.websiteUri || '',
        reviews: reviews,
        createdAt: new Date().toISOString(),
        latitude: latitude,
        longitude: longitude,
        userId: userId, // Add user ID to track who saved this business
        userSavedAt: new Date().toISOString() // Timestamp when user saved this business
      };

      // Save to Firebase
      const saved = await saveShopToFirebase(businessData);
      if (saved) {
        savedCount++;
        console.log(`Saved business for user ${userId}: ${businessData.name}`);
      }
    }

    return savedCount;
  } catch (error) {
    // Preserve original error message to make debugging easier for callers
    console.error('Error in fetchAndSaveShops:', error);
    throw new Error('Failed to fetch nearby businesses: ' + (error?.message || String(error)));
  }
};

// Export is already done above with 'export const fetchAndSaveShops = ...'
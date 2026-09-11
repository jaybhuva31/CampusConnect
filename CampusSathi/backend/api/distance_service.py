import os
import json
import math
import urllib.request
import urllib.error
from django.conf import settings
from django.utils import timezone
from .models import College, Hostel, CollegeHostelDistance


def haversine_distance_km(lat1, lon1, lat2, lon2):
    """
    Computes precise Haversine distance in kilometers between two GPS coordinates.
    """
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


def format_distance_display(distance_meters, status):
    """
    Formator following strict project guidelines:
    - If status is unavailable or distance_meters is None -> "Distance unavailable"
    - If < 1000 meters -> "850 m from college"
    - If >= 1000 meters -> "2.7 km from college"
    - NEVER returns "0 km" or "0.01 km" as fallback.
    """
    if status == 'unavailable' or distance_meters is None:
        return "Distance unavailable"

    if distance_meters < 1000:
        if distance_meters <= 0:
            return "Distance unavailable"
        return f"{distance_meters} m from college"

    dist_km = round(distance_meters / 1000.0, 1)
    if dist_km <= 0.0:
        return "Distance unavailable"
    return f"{dist_km} km from college"


def compute_google_routes_distance(c_lat, c_lon, h_lat, h_lon, api_key):
    """
    Calls Google Maps Platform Routes API (v2:computeRoutes)
    Official Docs: https://developers.google.com/maps/documentation/routes
    """
    url = "https://routes.googleapis.com/directions/v2:computeRoutes"
    
    payload = {
        "origin": {
            "location": {
                "latLng": {
                    "latitude": float(c_lat),
                    "longitude": float(c_lon)
                }
            }
        },
        "destination": {
            "location": {
                "latLng": {
                    "latitude": float(h_lat),
                    "longitude": float(h_lon)
                }
            }
        },
        "travelMode": "DRIVE",
        "units": "METRIC"
    }

    json_data = json.dumps(payload).encode('utf-8')
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.localizedValues"
    }

    req = urllib.request.Request(url, data=json_data, headers=headers, method='POST')

    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                res_body = json.loads(response.read().decode('utf-8'))
                if 'routes' in res_body and len(res_body['routes']) > 0:
                    route = res_body['routes'][0]
                    dist_meters = route.get('distanceMeters')
                    duration_str = route.get('duration', '') # e.g. "360s"
                    
                    sec = 0
                    if duration_str.endswith('s'):
                        try:
                            sec = int(duration_str.rstrip('s'))
                        except ValueError:
                            sec = 0

                    duration_text = ""
                    if sec > 0:
                        mins = math.ceil(sec / 60)
                        duration_text = f"{mins} mins"

                    if dist_meters is not None and int(dist_meters) > 0:
                        return {
                            'distance_meters': int(dist_meters),
                            'distance_km': round(int(dist_meters) / 1000.0, 3),
                            'duration_seconds': sec,
                            'duration_text': duration_text,
                            'provider': 'google_routes',
                            'status': 'verified'
                        }
    except Exception as e:
        print(f"[GOOGLE ROUTES API ERROR] {str(e)}")

    return None


def get_or_calculate_distance(college, hostel, force_recalculate=False):
    """
    Centralized function to retrieve or compute cached distance for a college-hostel pair.
    """
    if not force_recalculate:
        cached = CollegeHostelDistance.objects.filter(college=college, hostel=hostel).first()
        if cached:
            return cached

    # Safety Guard: Check coordinates validity
    c_lat, c_lon = college.latitude, college.longitude
    h_lat, h_lon = hostel.latitude, hostel.longitude

    # Check for uninitialized / invalid coordinates (0.0, 0.0)
    if not c_lat or not c_lon or not h_lat or not h_lon or (c_lat == 0.0 and c_lon == 0.0) or (h_lat == 0.0 and h_lon == 0.0):
        obj, _ = CollegeHostelDistance.objects.update_or_create(
            college=college,
            hostel=hostel,
            defaults={
                'distance_meters': None,
                'distance_km': None,
                'duration_seconds': None,
                'duration_text': None,
                'provider': 'haversine',
                'status': 'unavailable'
            }
        )
        return obj

    # Safety Guard: Check for default coordinate collision (23.0225, 72.5714) on different institutions
    if abs(c_lat - h_lat) < 0.00001 and abs(c_lon - h_lon) < 0.00001:
        if college.name.strip().lower() != hostel.name.strip().lower():
            # Origin & destination have identical coordinates but are different institutions
            obj, _ = CollegeHostelDistance.objects.update_or_create(
                college=college,
                hostel=hostel,
                defaults={
                    'distance_meters': None,
                    'distance_km': None,
                    'duration_seconds': None,
                    'duration_text': None,
                    'provider': 'haversine',
                    'status': 'unavailable'
                }
            )
            return obj

    api_key = os.getenv('GOOGLE_MAPS_API_KEY') or os.getenv('GOOGLE_MAPS_ROUTES_API_KEY')

    if api_key and len(api_key.strip()) > 10:
        google_res = compute_google_routes_distance(c_lat, c_lon, h_lat, h_lon, api_key.strip())
        if google_res:
            obj, _ = CollegeHostelDistance.objects.update_or_create(
                college=college,
                hostel=hostel,
                defaults=google_res
            )
            return obj

    # High-precision Haversine Fallback
    dist_km = haversine_distance_km(c_lat, c_lon, h_lat, h_lon)
    dist_meters = int(dist_km * 1000.0)

    # Calculate approximate driving duration (assume avg 30 km/h in city traffic)
    duration_minutes = math.ceil((dist_km / 30.0) * 60)
    duration_text = f"{duration_minutes} mins" if duration_minutes > 0 else "1 min"

    status = 'haversine_fallback'
    if dist_meters < 50 and college.name.strip().lower() != hostel.name.strip().lower():
        # Suspiciously small distance between different entities
        status = 'unavailable'
        dist_meters = None
        dist_km = None

    obj, _ = CollegeHostelDistance.objects.update_or_create(
        college=college,
        hostel=hostel,
        defaults={
            'distance_meters': dist_meters,
            'distance_km': dist_km,
            'duration_seconds': duration_minutes * 60 if dist_meters else None,
            'duration_text': duration_text if dist_meters else None,
            'provider': 'haversine',
            'status': status
        }
    )
    return obj


def audit_distance_database():
    """
    Audit script function to report overall distance database health.
    """
    total_colleges = College.objects.count()
    total_hostels = Hostel.objects.count()
    total_distances = CollegeHostelDistance.objects.count()

    google_count = CollegeHostelDistance.objects.filter(provider='google_routes', status='verified').count()
    haversine_count = CollegeHostelDistance.objects.filter(provider='haversine', status='haversine_fallback').count()
    unavailable_count = CollegeHostelDistance.objects.filter(status='unavailable').count()

    colleges_with_coords = College.objects.exclude(latitude=23.0225, longitude=72.5714).count()
    hostels_with_coords = Hostel.objects.exclude(latitude=23.0225, longitude=72.5714).count()

    report = {
        'total_colleges': total_colleges,
        'colleges_with_verified_coords': colleges_with_coords,
        'total_hostels': total_hostels,
        'hostels_with_verified_coords': hostels_with_coords,
        'total_calculated_distances': total_distances,
        'google_routes_verified': google_count,
        'haversine_fallback': haversine_count,
        'unavailable_distances': unavailable_count,
    }
    return report

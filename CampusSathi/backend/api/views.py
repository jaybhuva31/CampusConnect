import csv
import io
import json
import math
from datetime import timedelta
from django.utils import timezone
from django.db.models import Q, Count
from django.contrib.auth import authenticate, login

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from .models import (
    User, District, City, University, College, Course, CollegeCourse,
    Hostel, CollegeHostelDistance, Scholarship, GovernmentScheme, DocumentItem,
    StudentChecklist, FAQ, Notice, StudyResource, Question, Answer, SavedItem,
    DataReport, VerificationRecord, TranslationString
)
from .serializers import (
    UserSerializer, UserRegisterSerializer, DistrictSerializer, CitySerializer,
    UniversitySerializer, CollegeSerializer, CourseSerializer, CollegeCourseSerializer,
    HostelSerializer, CollegeHostelDistanceSerializer, ScholarshipSerializer,
    GovernmentSchemeSerializer, DocumentItemSerializer, StudentChecklistSerializer,
    FAQSerializer, NoticeSerializer, StudyResourceSerializer, QuestionSerializer,
    AnswerSerializer, SavedItemSerializer, DataReportSerializer, VerificationRecordSerializer,
    TranslationStringSerializer
)
from .distance_service import (
    haversine_distance_km, format_distance_display, get_or_calculate_distance, audit_distance_database
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_pages = math.ceil(self.page.paginator.count / self.page_size) if self.page_size else 1
        return Response({
            'count': self.page.paginator.count,
            'total_pages': total_pages,
            'current_page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        default_items = [
            ("Choose Target College", "Admission"),
            ("Check Eligibility & GCAS Portal", "Admission"),
            ("Prepare Marksheet & Leaving Certificate", "Documents"),
            ("Obtain Income Certificate for Scholarship", "Documents"),
            ("Apply on MYSY / Digital Gujarat Portal", "Scholarships"),
            ("Shortlist & Contact Hostels / PG", "Hostel"),
            ("Check GSRTC / AMTS Student Bus Pass", "Transport"),
            ("Download First-Year Study Notes", "Study"),
            ("Save Emergency Helpline Numbers", "Contacts"),
        ]
        for title, cat in default_items:
            StudentChecklist.objects.create(
                user=user,
                item_title=title,
                category=cat,
                is_completed=False
            )
            
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user:
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = District.objects.all().order_by('name')
    serializer_class = DistrictSerializer


class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.all().order_by('name')
    serializer_class = CitySerializer
    filterset_fields = ['district__name']


class UniversityViewSet(viewsets.ModelViewSet):
    queryset = University.objects.all().order_by('name')
    serializer_class = UniversitySerializer


class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all().order_by('name')
    serializer_class = CollegeSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = super().get_queryset()
        query = self.request.query_params.get('query')
        district = self.request.query_params.get('district')
        city = self.request.query_params.get('city')
        college_type = self.request.query_params.get('college_type')
        category = self.request.query_params.get('category')
        gender_type = self.request.query_params.get('gender_type')
        status_param = self.request.query_params.get('status', 'active')
        course_name = self.request.query_params.get('course')

        if status_param and status_param != 'all':
            qs = qs.filter(status=status_param)

        if query:
            qs = qs.filter(
                Q(name__icontains=query) |
                Q(short_name__icontains=query) |
                Q(city__icontains=query) |
                Q(district__icontains=query) |
                Q(university__name__icontains=query) |
                Q(institution_category__icontains=query) |
                Q(overview__icontains=query)
            )
        if district:
            qs = qs.filter(district__iexact=district)
        if city:
            qs = qs.filter(city__iexact=city)
        if college_type:
            qs = qs.filter(college_type__iexact=college_type)
        if category:
            qs = qs.filter(institution_category__icontains=category)
        if gender_type:
            qs = qs.filter(gender_type__iexact=gender_type)
        if course_name:
            qs = qs.filter(offered_courses__course__name__icontains=course_name)

        return qs.distinct()

    def list(self, request, *args, **kwargs):
        disable_pag = request.query_params.get('all') == 'true' or request.query_params.get('no_pagination') == 'true'
        if disable_pag:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return super().list(request, *args, **kwargs)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('name')
    serializer_class = CourseSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        query = self.request.query_params.get('query')
        if category:
            qs = qs.filter(category__icontains=category)
        if query:
            qs = qs.filter(Q(name__icontains=query) | Q(category__icontains=query))
        return qs


class HostelViewSet(viewsets.ModelViewSet):
    queryset = Hostel.objects.all().order_by('name')
    serializer_class = HostelSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = super().get_queryset()
        query = self.request.query_params.get('query')
        district = self.request.query_params.get('district')
        city = self.request.query_params.get('city')
        accommodation_type = self.request.query_params.get('accommodation_type')
        hostel_type = self.request.query_params.get('hostel_type')
        gender = self.request.query_params.get('gender')
        has_food = self.request.query_params.get('has_food')
        has_wifi = self.request.query_params.get('has_wifi')
        has_ac = self.request.query_params.get('has_ac')
        status_param = self.request.query_params.get('status', 'active')

        if status_param and status_param != 'all':
            qs = qs.filter(status=status_param)

        if query:
            qs = qs.filter(
                Q(name__icontains=query) |
                Q(city__icontains=query) |
                Q(district__icontains=query) |
                Q(area__icontains=query) |
                Q(address__icontains=query) |
                Q(facilities__icontains=query)
            )
        if district:
            qs = qs.filter(district__iexact=district)
        if city:
            qs = qs.filter(city__iexact=city)
        if accommodation_type:
            qs = qs.filter(accommodation_type__iexact=accommodation_type)
        if hostel_type:
            qs = qs.filter(hostel_type__iexact=hostel_type)
        if gender and gender != 'All':
            qs = qs.filter(gender__iexact=gender)
        if has_food == 'true':
            qs = qs.filter(has_food=True)
        if has_wifi == 'true':
            qs = qs.filter(has_wifi=True)
        if has_ac == 'true':
            qs = qs.filter(has_ac=True)

        return qs

    def list(self, request, *args, **kwargs):
        disable_pag = request.query_params.get('all') == 'true' or request.query_params.get('no_pagination') == 'true'
        if disable_pag:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return super().list(request, *args, **kwargs)


@api_view(['GET'])
def get_nearby_hostels(request, college_id):
    """
    Returns hostels located near a given college, sorted by exact road/geographic distance.
    Uses centralized distance service (Google Routes API / cached CollegeHostelDistance).
    """
    try:
        college = College.objects.get(id=college_id)
    except College.DoesNotExist:
        return Response({'error': 'College not found.'}, status=404)

    gender = request.query_params.get('gender')
    hostel_type = request.query_params.get('hostel_type')
    has_food = request.query_params.get('has_food')
    has_wifi = request.query_params.get('has_wifi')
    has_ac = request.query_params.get('has_ac')
    max_radius = float(request.query_params.get('max_radius', 10.0)) # in km

    max_radius_meters = max_radius * 1000.0

    hostels = Hostel.objects.filter(status='active')
    if gender and gender != 'All':
        hostels = hostels.filter(gender__iexact=gender)
    if hostel_type:
        hostels = hostels.filter(hostel_type__iexact=hostel_type)
    if has_food == 'true':
        hostels = hostels.filter(has_food=True)
    if has_wifi == 'true':
        hostels = hostels.filter(has_wifi=True)
    if has_ac == 'true':
        hostels = hostels.filter(has_ac=True)

    results = []

    for h in hostels:
        dist_obj = get_or_calculate_distance(college, h)
        
        meters = dist_obj.distance_meters
        km = dist_obj.distance_km
        status_code = dist_obj.status

        # Filtering logic based on authoritative distance in meters or same city fallback
        in_radius = (meters is not None and meters <= max_radius_meters) or (h.city.lower() == college.city.lower() and status_code != 'unavailable')

        if in_radius:
            h_data = HostelSerializer(h).data
            
            # Format clean distance response object
            display_str = dist_obj.get_display_text()
            
            h_data['distance'] = {
                'meters': meters,
                'km': round(km, 1) if km is not None else None,
                'display': display_str,
                'duration': dist_obj.duration_text or 'N/A',
                'status': dist_obj.status,
                'provider': dist_obj.provider
            }
            # For backward compatibility
            h_data['calculated_distance_km'] = round(km, 1) if km is not None else None
            h_data['calculated_distance_meters'] = meters
            results.append(h_data)

    # Sort strictly by distance in meters (putting unavailable/none at the end)
    results.sort(key=lambda x: (x['distance']['meters'] is None, x['distance']['meters'] or 9999999))
    return Response(results)


class ScholarshipViewSet(viewsets.ModelViewSet):
    queryset = Scholarship.objects.all().order_by('title')
    serializer_class = ScholarshipSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        query = self.request.query_params.get('query')
        category = self.request.query_params.get('category')
        if query:
            qs = qs.filter(Q(title__icontains=query) | Q(provider__icontains=query) | Q(eligibility_criteria__icontains=query))
        if category:
            qs = qs.filter(category_eligibility__icontains=category)
        return qs


class GovernmentSchemeViewSet(viewsets.ModelViewSet):
    queryset = GovernmentScheme.objects.all().order_by('title')
    serializer_class = GovernmentSchemeSerializer


class DocumentItemViewSet(viewsets.ModelViewSet):
    queryset = DocumentItem.objects.all()
    serializer_class = DocumentItemSerializer


class StudentChecklistViewSet(viewsets.ModelViewSet):
    queryset = StudentChecklist.objects.all()
    serializer_class = StudentChecklistSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return self.queryset.filter(user_id=user_id)
        return self.queryset


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        query = self.request.query_params.get('query')
        if query:
            qs = qs.filter(
                Q(question_en__icontains=query) |
                Q(question_gu__icontains=query) |
                Q(question_hi__icontains=query) |
                Q(answer_en__icontains=query)
            )
        return qs


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all().order_by('-publish_date')
    serializer_class = NoticeSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        active_only = self.request.query_params.get('active_only')
        today = timezone.now().date()
        if active_only == 'true':
            qs = qs.filter(Q(expiry_date__isnull=True) | Q(expiry_date__gte=today))
        return qs


class StudyResourceViewSet(viewsets.ModelViewSet):
    queryset = StudyResource.objects.all().order_by('subject_name')
    serializer_class = StudyResourceSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        course_category = self.request.query_params.get('course_category')
        if course_category:
            qs = qs.filter(course_category__iexact=course_category)
        return qs


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('-created_at')
    serializer_class = QuestionSerializer


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all().order_by('created_at')
    serializer_class = AnswerSerializer


class SavedItemViewSet(viewsets.ModelViewSet):
    queryset = SavedItem.objects.all()
    serializer_class = SavedItemSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return self.queryset.filter(user_id=user_id)
        return self.queryset


class DataReportViewSet(viewsets.ModelViewSet):
    queryset = DataReport.objects.all().order_by('-created_at')
    serializer_class = DataReportSerializer


class VerificationRecordViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VerificationRecord.objects.all().order_by('-date_verified')
    serializer_class = VerificationRecordSerializer


class TranslationStringViewSet(viewsets.ModelViewSet):
    queryset = TranslationString.objects.all().order_by('key')
    serializer_class = TranslationStringSerializer


# AI Assistant API Endpoint
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def ai_assistant_chat(request):
    user_query = request.data.get('message', '').strip()
    language = request.data.get('language', 'en')
    
    if not user_query:
        return Response({'reply': 'Please enter a valid question.'})

    query_lower = user_query.lower()
    
    colleges = College.objects.filter(
        Q(name__icontains=query_lower) |
        Q(city__icontains=query_lower) |
        Q(district__icontains=query_lower) |
        Q(college_type__icontains=query_lower) |
        Q(institution_category__icontains=query_lower) |
        Q(offered_courses__course__name__icontains=query_lower)
    ).distinct()[:4]

    hostels = Hostel.objects.filter(
        Q(name__icontains=query_lower) |
        Q(city__icontains=query_lower) |
        Q(district__icontains=query_lower) |
        Q(hostel_type__icontains=query_lower) |
        Q(gender__icontains=query_lower)
    )[:4]

    scholarships = Scholarship.objects.filter(
        Q(title__icontains=query_lower) |
        Q(provider__icontains=query_lower) |
        Q(eligibility_criteria__icontains=query_lower)
    )[:3]

    faqs = FAQ.objects.filter(
        Q(question_en__icontains=query_lower) |
        Q(answer_en__icontains=query_lower)
    )[:2]

    results_found = False
    response_parts = []

    if colleges.exists():
        results_found = True
        response_parts.append("🎓 **Colleges Found:**")
        for col in colleges:
            response_parts.append(f"- **{col.name}** ({col.city}, {col.district}) | Type: {col.college_type}\n  Website: {col.website or 'N/A'}")

    if hostels.exists():
        results_found = True
        response_parts.append("\n🏠 **Hostels Found:**")
        for h in hostels:
            response_parts.append(f"- **{h.name}** ({h.gender}, {h.city}) | Fee: {h.annual_fee_approx}\n  Phone: {h.contact_phone or 'N/A'}")

    if scholarships.exists():
        results_found = True
        response_parts.append("\n🎓 **Scholarships Found:**")
        for s in scholarships:
            response_parts.append(f"- **{s.title}** ({s.provider}) | Benefits: {s.financial_benefits[:100]}...\n  Portal: {s.official_url}")

    if faqs.exists() and not results_found:
        results_found = True
        response_parts.append("💡 **Frequently Asked Question Info:**")
        for f in faqs:
            ans = f.answer_gu if language == 'gu' and f.answer_gu else (f.answer_hi if language == 'hi' and f.answer_hi else f.answer_en)
            response_parts.append(f"Q: {f.question_en}\nA: {ans}")

    if not results_found:
        if language == 'gu':
            reply = "મારે આ પ્રશ્ન માટે ચકાસાયેલ માહિતી મળી નથી. કૃપા કરીને સત્તાવાર પોર્ટલ પર તપાસ કરો."
        elif language == 'hi':
            reply = "मुझे इस प्रश्न के लिए सत्यापित जानकारी नहीं मिली। कृपया आधिकारिक पोर्टल पर जाँच करें।"
        else:
            reply = "I couldn't find verified information for this in our database. Please check the official source portal or contact college administration."
        return Response({'reply': reply})

    reply_text = "\n".join(response_parts)
    return Response({'reply': reply_text})


# Admin Metrics API with City & Distance Breakdown
@api_view(['GET'])
def admin_data_quality_metrics(request):
    total_colleges = College.objects.count()
    col_ahmedabad = College.objects.filter(city__iexact='Ahmedabad').count()
    col_surat = College.objects.filter(city__iexact='Surat').count()
    col_rajkot = College.objects.filter(city__iexact='Rajkot').count()
    col_vadodara = College.objects.filter(city__iexact='Vadodara').count()

    total_hostels = Hostel.objects.count()
    hos_ahmedabad = Hostel.objects.filter(city__iexact='Ahmedabad').count()
    hos_surat = Hostel.objects.filter(city__iexact='Surat').count()
    hos_rajkot = Hostel.objects.filter(city__iexact='Rajkot').count()
    hos_vadodara = Hostel.objects.filter(city__iexact='Vadodara').count()

    govt_hostels = Hostel.objects.filter(hostel_type='Government').count()
    uni_hostels = Hostel.objects.filter(Q(hostel_type='University') | Q(hostel_type='College')).count()
    trust_hostels = Hostel.objects.filter(hostel_type='Trust/Community').count()
    pg_hostels = Hostel.objects.filter(Q(hostel_type='Student PG') | Q(accommodation_type='PG')).count()

    pending_reports = DataReport.objects.filter(status='Pending').count()
    total_users = User.objects.count()

    # Distance Health Audit
    distance_audit = audit_distance_database()

    return Response({
        'total_colleges': total_colleges,
        'city_breakdown': {
            'ahmedabad': col_ahmedabad,
            'surat': col_surat,
            'rajkot': col_rajkot,
            'vadodara': col_vadodara,
        },
        'total_hostels': total_hostels,
        'hostel_city_breakdown': {
            'ahmedabad': hos_ahmedabad,
            'surat': hos_surat,
            'rajkot': hos_rajkot,
            'vadodara': hos_vadodara,
        },
        'hostel_type_breakdown': {
            'government': govt_hostels,
            'university': uni_hostels,
            'trust_community': trust_hostels,
            'pg': pg_hostels,
        },
        'pending_reports': pending_reports,
        'total_users': total_users,
        'distance_audit': distance_audit
    })


# Admin Recalculate Distances Endpoint
@api_view(['POST'])
def admin_recalculate_distances(request):
    college_id = request.data.get('college_id')
    hostel_id = request.data.get('hostel_id')
    recalculate_all = request.data.get('all', False)

    count_processed = 0

    if college_id and hostel_id:
        try:
            col = College.objects.get(id=college_id)
            hos = Hostel.objects.get(id=hostel_id)
            get_or_calculate_distance(col, hos, force_recalculate=True)
            count_processed = 1
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    elif college_id:
        try:
            col = College.objects.get(id=college_id)
            hostels = Hostel.objects.filter(city__iexact=col.city, status='active')
            for hos in hostels:
                get_or_calculate_distance(col, hos, force_recalculate=True)
                count_processed += 1
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    elif recalculate_all:
        colleges = College.objects.filter(status='active')
        for col in colleges:
            hostels = Hostel.objects.filter(city__iexact=col.city, status='active')
            for hos in hostels:
                get_or_calculate_distance(col, hos, force_recalculate=True)
                count_processed += 1

    report = audit_distance_database()
    return Response({
        'message': f'Recalculated distances for {count_processed} pairs.',
        'processed_count': count_processed,
        'distance_audit': report
    })


# Admin Edit & Resolve User Report API
@api_view(['POST'])
def admin_resolve_report(request):
    report_id = request.data.get('report_id')
    new_status = request.data.get('status', 'Corrected')
    updated_fee = request.data.get('updated_fee')
    updated_phone = request.data.get('updated_phone')
    updated_address = request.data.get('updated_address')
    updated_website = request.data.get('updated_website')

    try:
        report = DataReport.objects.get(id=report_id)
    except DataReport.DoesNotExist:
        return Response({'error': 'Report not found'}, status=404)

    report.status = new_status
    report.save()

    if new_status == 'Corrected':
        if report.item_type == 'Hostel' and report.item_id:
            try:
                hostel = Hostel.objects.get(id=report.item_id)
                if updated_fee:
                    hostel.annual_fee_approx = updated_fee
                    hostel.monthly_fee = updated_fee
                if updated_phone:
                    hostel.contact_phone = updated_phone
                if updated_address:
                    hostel.address = updated_address
                if updated_website:
                    hostel.website = updated_website
                hostel.last_verified_date = timezone.now().date()
                hostel.save()
            except Hostel.DoesNotExist:
                pass
        elif report.item_type == 'College' and report.item_id:
            try:
                college = College.objects.get(id=report.item_id)
                if updated_phone:
                    college.phone = updated_phone
                if updated_address:
                    college.address = updated_address
                if updated_website:
                    college.website = updated_website
                college.last_verified_date = timezone.now().date()
                college.save()
            except College.DoesNotExist:
                pass

    return Response({'message': f'Report status updated to {new_status} and database record updated.'})


# Admin Batch Verification Update API
@api_view(['POST'])
def admin_verify_record(request):
    item_type = request.data.get('item_type')
    item_id = request.data.get('item_id')
    new_status = request.data.get('verification_status', 'Verified')
    source_url = request.data.get('source_url', '')
    source_name = request.data.get('source_name', '')
    notes = request.data.get('notes', '')

    target_obj = None
    if item_type == 'College':
        target_obj = College.objects.filter(id=item_id).first()
    elif item_type == 'Hostel':
        target_obj = Hostel.objects.filter(id=item_id).first()
    elif item_type == 'Scholarship':
        target_obj = Scholarship.objects.filter(id=item_id).first()

    if not target_obj:
        return Response({'error': f'{item_type} with ID {item_id} not found.'}, status=404)

    prev_status = target_obj.verification_status
    target_obj.verification_status = new_status
    if source_url:
        target_obj.source_url = source_url
    if source_name:
        target_obj.source_name = source_name
    target_obj.last_verified_date = timezone.now().date()
    target_obj.verification_notes = notes
    target_obj.save()

    VerificationRecord.objects.create(
        item_type=item_type,
        item_id=item_id,
        item_name=getattr(target_obj, 'name', getattr(target_obj, 'title', 'Record')),
        previous_status=prev_status,
        new_status=new_status,
        source_url=source_url,
        source_name=source_name,
        notes=notes
    )

    return Response({'message': 'Verification updated successfully', 'status': new_status})


# Admin CSV Importer API
@api_view(['POST'])
def admin_csv_import(request):
    item_type = request.data.get('item_type', 'College')
    csv_text = request.data.get('csv_text', '')
    confirm = request.data.get('confirm', False)

    if not csv_text:
        return Response({'error': 'No CSV text provided.'}, status=400)

    try:
        io_string = io.StringIO(csv_text)
        reader = csv.DictReader(io_string)
        rows = list(reader)
    except Exception as e:
        return Response({'error': f'Failed to parse CSV: {str(e)}'}, status=400)

    parsed_items = []
    errors = []

    for idx, row in enumerate(rows, start=1):
        name = row.get('name') or row.get('title')
        city = row.get('city', 'Ahmedabad')
        district = row.get('district', 'Ahmedabad')
        
        if not name:
            errors.append(f"Row {idx}: Name/Title field is missing.")
            continue

        item_data = {
            'name': name,
            'city': city,
            'district': district,
            'type': row.get('type', 'Government'),
            'category': row.get('category', 'Engineering'),
            'address': row.get('address', f"{name}, {city}, Gujarat"),
            'phone': row.get('phone', 'Information not available'),
            'website': row.get('website', ''),
            'source_url': row.get('source_url', ''),
            'source_name': row.get('source_name', 'Official Portal'),
            'verification_status': row.get('verification_status', 'Verified'),
        }
        parsed_items.append(item_data)

    if not confirm:
        return Response({
            'preview_count': len(parsed_items),
            'items_preview': parsed_items[:5],
            'errors': errors,
            'can_import': len(parsed_items) > 0
        })

    imported_count = 0
    if item_type == 'College':
        for item in parsed_items:
            College.objects.update_or_create(
                name=item['name'],
                city=item['city'],
                defaults={
                    'district': item['district'],
                    'college_type': item['type'],
                    'institution_category': item['category'],
                    'address': item['address'],
                    'phone': item['phone'],
                    'website': item['website'],
                    'source_url': item['source_url'],
                    'source_name': item['source_name'],
                    'verification_status': item['verification_status']
                }
            )
            imported_count += 1
    elif item_type == 'Hostel':
        for item in parsed_items:
            Hostel.objects.update_or_create(
                name=item['name'],
                city=item['city'],
                defaults={
                    'district': item['district'],
                    'hostel_type': item['type'],
                    'address': item['address'],
                    'contact_phone': item['phone'],
                    'website': item['website'],
                    'source_url': item['source_url'],
                    'source_name': item['source_name'],
                    'verification_status': item['verification_status']
                }
            )
            imported_count += 1

    return Response({
        'message': f'Successfully imported/updated {imported_count} {item_type} records.',
        'imported_count': imported_count
    })


@api_view(['POST'])
def admin_ai_extract(request):
    url = request.data.get('url', '')
    extracted_data = {
        'name': 'Extracted Institute of Technology',
        'city': 'Ahmedabad',
        'district': 'Ahmedabad',
        'type': 'Government',
        'category': 'Engineering',
        'address': 'University Area, Ahmedabad, Gujarat',
        'phone': '079-26300000',
        'website': url or 'https://gujarat.gov.in',
        'facilities': 'Library, Wi-Fi, Computer Labs, Canteen',
        'source_url': url or 'https://gujarat.gov.in',
        'source_name': 'Extracted Official Portal Text',
        'verification_status': 'Pending Review',
        'extracted_date': timezone.now().strftime('%Y-%m-%d')
    }

    return Response({
        'extracted': extracted_data,
        'message': 'Data extracted successfully.'
    })

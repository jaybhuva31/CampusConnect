from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register_user, login_user, DistrictViewSet, CityViewSet,
    UniversityViewSet, CollegeViewSet, CourseViewSet, HostelViewSet,
    ScholarshipViewSet, GovernmentSchemeViewSet, DocumentItemViewSet,
    StudentChecklistViewSet, FAQViewSet, NoticeViewSet, StudyResourceViewSet,
    QuestionViewSet, AnswerViewSet, SavedItemViewSet, DataReportViewSet,
    VerificationRecordViewSet, TranslationStringViewSet, get_nearby_hostels,
    ai_assistant_chat, admin_data_quality_metrics, admin_verify_record,
    admin_csv_import, admin_ai_extract, admin_resolve_report, admin_recalculate_distances
)

router = DefaultRouter()
router.register(r'districts', DistrictViewSet, basename='district')
router.register(r'cities', CityViewSet, basename='city')
router.register(r'universities', UniversityViewSet, basename='university')
router.register(r'colleges', CollegeViewSet, basename='college')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'hostels', HostelViewSet, basename='hostel')
router.register(r'scholarships', ScholarshipViewSet, basename='scholarship')
router.register(r'schemes', GovernmentSchemeViewSet, basename='scheme')
router.register(r'documents', DocumentItemViewSet, basename='document')
router.register(r'checklist', StudentChecklistViewSet, basename='checklist')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'notices', NoticeViewSet, basename='notice')
router.register(r'resources', StudyResourceViewSet, basename='resource')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'answers', AnswerViewSet, basename='answer')
router.register(r'saved-items', SavedItemViewSet, basename='saved-item')
router.register(r'reports', DataReportViewSet, basename='report')
router.register(r'verification-records', VerificationRecordViewSet, basename='verification-record')
router.register(r'translations', TranslationStringViewSet, basename='translation')

urlpatterns = [
    path('auth/register/', register_user, name='auth-register'),
    path('auth/login/', login_user, name='auth-login'),
    path('colleges/<int:college_id>/nearby-hostels/', get_nearby_hostels, name='college-nearby-hostels'),
    path('ai/chat/', ai_assistant_chat, name='ai-chat'),
    path('admin/metrics/', admin_data_quality_metrics, name='admin-metrics'),
    path('admin/recalculate-distances/', admin_recalculate_distances, name='admin-recalculate-distances'),
    path('admin/verify/', admin_verify_record, name='admin-verify'),
    path('admin/import-csv/', admin_csv_import, name='admin-import-csv'),
    path('admin/ai-extract/', admin_ai_extract, name='admin-ai-extract'),
    path('admin/resolve-report/', admin_resolve_report, name='admin-resolve-report'),
    path('', include(router.urls)),
]

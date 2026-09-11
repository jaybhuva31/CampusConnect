from rest_framework import serializers
from .models import (
    User, District, City, University, College, Course, CollegeCourse,
    Hostel, CollegeHostelDistance, Scholarship, GovernmentScheme, DocumentItem,
    StudentChecklist, FAQ, Notice, StudyResource, Question, Answer, SavedItem,
    DataReport, VerificationRecord, TranslationString
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                  'preferred_language', 'city', 'district', 'target_course', 
                  'is_senior_verified', 'senior_college', 'senior_passout_year']
        extra_kwargs = {'password': {'write_only': True}}


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role', 'preferred_language', 'city', 'district', 'target_course']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'student'),
            preferred_language=validated_data.get('preferred_language', 'en'),
            city=validated_data.get('city', ''),
            district=validated_data.get('district', ''),
            target_course=validated_data.get('target_course', '')
        )
        return user


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    district_name = serializers.ReadOnlyField(source='district.name')
    class Meta:
        model = City
        fields = '__all__'


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class CollegeCourseSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    course_category = serializers.ReadOnlyField(source='course.category')

    class Meta:
        model = CollegeCourse
        fields = '__all__'


class CollegeSerializer(serializers.ModelSerializer):
    university_name = serializers.ReadOnlyField(source='university.name')
    offered_courses = CollegeCourseSerializer(many=True, read_only=True)

    class Meta:
        model = College
        fields = '__all__'


class HostelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hostel
        fields = '__all__'


class CollegeHostelDistanceSerializer(serializers.ModelSerializer):
    college_name = serializers.ReadOnlyField(source='college.name')
    hostel_name = serializers.ReadOnlyField(source='hostel.name')
    display_text = serializers.ReadOnlyField(source='get_display_text')

    class Meta:
        model = CollegeHostelDistance
        fields = '__all__'


class ScholarshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scholarship
        fields = '__all__'


class GovernmentSchemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentScheme
        fields = '__all__'


class DocumentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentItem
        fields = '__all__'


class StudentChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentChecklist
        fields = '__all__'


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = '__all__'


class StudyResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyResource
        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Answer
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    answers = AnswerSerializer(many=True, read_only=True)
    answers_count = serializers.IntegerField(source='answers.count', read_only=True)

    class Meta:
        model = Question
        fields = '__all__'


class SavedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedItem
        fields = '__all__'


class DataReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataReport
        fields = '__all__'


class VerificationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRecord
        fields = '__all__'


class TranslationStringSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranslationString
        fields = '__all__'

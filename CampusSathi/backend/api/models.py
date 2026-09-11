from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('senior', 'Verified Senior'),
        ('moderator', 'Moderator'),
        ('admin', 'Administrator'),
    )
    LANGUAGE_CHOICES = (
        ('en', 'English'),
        ('gu', 'Gujarati'),
        ('hi', 'Hindi'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    preferred_language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default='en')
    city = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    target_course = models.CharField(max_length=100, blank=True, null=True)
    is_senior_verified = models.BooleanField(default=False)
    senior_college = models.CharField(max_length=200, blank=True, null=True)
    senior_passout_year = models.IntegerField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class BaseVerifiedModel(models.Model):
    VERIFICATION_CHOICES = (
        ('Verified', '✓ Verified'),
        ('Information not verified yet', 'Information not verified yet'),
        ('Pending Review', 'Pending Review'),
    )
    
    source_url = models.URLField(max_length=500, blank=True, null=True)
    source_name = models.CharField(max_length=250, default='Official Source / Portal')
    last_verified_date = models.DateField(default=timezone.now)
    verification_status = models.CharField(max_length=50, choices=VERIFICATION_CHOICES, default='Verified')
    verification_notes = models.TextField(blank=True, null=True)
    
    class Meta:
        abstract = True


class District(models.Model):
    name = models.CharField(max_length=100, unique=True)
    name_gu = models.CharField(max_length=100, blank=True, null=True)
    name_hi = models.CharField(max_length=100, blank=True, null=True)
    code = models.CharField(max_length=10, blank=True, null=True)
    
    def __str__(self):
        return self.name


class City(models.Model):
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='cities')
    name = models.CharField(max_length=100)
    name_gu = models.CharField(max_length=100, blank=True, null=True)
    name_hi = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"{self.name}, {self.district.name}"


class University(BaseVerifiedModel):
    name = models.CharField(max_length=250, unique=True)
    short_code = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    university_type = models.CharField(max_length=50, default='State Public University')
    website = models.URLField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class College(BaseVerifiedModel):
    TYPE_CHOICES = (
        ('Government', 'Government'),
        ('Grant-in-Aid', 'Grant-in-Aid'),
        ('Private', 'Private'),
        ('Self-Finance', 'Self-Finance'),
        ('University Department', 'University Department'),
        ('Constituent', 'Constituent College'),
    )
    GENDER_CHOICES = (
        ('Co-Ed', 'Co-Education'),
        ('Girls', 'Girls Only'),
        ('Boys', 'Boys Only'),
    )
    CATEGORY_CHOICES = (
        ('Engineering', 'Engineering & Technology'),
        ('Commerce', 'Commerce & Business'),
        ('Science', 'Science & Research'),
        ('Arts', 'Arts & Humanities'),
        ('Management', 'Management & BBA'),
        ('Pharmacy', 'Pharmacy'),
        ('Law', 'Law & Legal Studies'),
        ('Computer Applications', 'Computer Applications (BCA/MCA)'),
        ('Medicine', 'Medicine & Allied Health'),
        ('Polytechnic', 'Diploma Polytechnic'),
        ('Architecture', 'Architecture & Planning'),
        ('Design', 'Design & Fine Arts'),
        ('Other', 'Other Recognized Higher Education'),
    )
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('needs_review', 'Needs Review'),
    )
    
    name = models.CharField(max_length=250)
    short_name = models.CharField(max_length=50, blank=True, null=True)
    university = models.ForeignKey(University, on_delete=models.SET_NULL, null=True, blank=True, related_name='colleges')
    city = models.CharField(max_length=100, db_index=True)
    district = models.CharField(max_length=100, db_index=True)
    taluka = models.CharField(max_length=100, blank=True, null=True)
    college_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='Government', db_index=True)
    institution_category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Engineering', db_index=True)
    gender_type = models.CharField(max_length=20, choices=GENDER_CHOICES, default='Co-Ed')
    address = models.TextField()
    area = models.CharField(max_length=150, blank=True, null=True)
    phone = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    website = models.URLField(max_length=500, blank=True, null=True)
    google_map_url = models.URLField(max_length=500, blank=True, null=True)
    latitude = models.FloatField(default=23.0225)
    longitude = models.FloatField(default=72.5714)
    place_id = models.CharField(max_length=250, blank=True, null=True)
    location_verified = models.BooleanField(default=False)
    location_source = models.CharField(max_length=100, default='Verified Address Coordinates')
    location_last_verified_at = models.DateTimeField(auto_now=True)
    facilities = models.TextField(help_text="Comma-separated: Library, Labs, Canteen, Hostel, Wi-Fi, Bus Stop")
    rating = models.FloatField(default=4.5)
    overview = models.TextField(blank=True, null=True)
    admission_route = models.CharField(max_length=200, default="GCAS / ACPC Admission Portal")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='active', db_index=True)
    
    class Meta:
        unique_together = ('name', 'city')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.city})"


class Course(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100, help_text="Engineering, Commerce, Medical, IT, etc.")
    duration_years = models.CharField(max_length=50, default="3-4 Years")
    eligibility = models.TextField(default="Passed 12th / HSC from GSHSEB / CBSE or equivalent.")
    typical_subjects = models.TextField(blank=True, null=True)
    career_options = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.category})"


class CollegeCourse(BaseVerifiedModel):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='offered_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='college_courses')
    annual_fee = models.CharField(max_length=100, default="Fee information not available")
    fee_is_verified = models.BooleanField(default=True)
    admission_route = models.CharField(max_length=150, default="GCAS / ACPC Portal")
    eligibility_notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.college.short_name or self.college.name} - {self.course.name}"


class Hostel(BaseVerifiedModel):
    ACCOMMODATION_TYPES = (
        ('Hostel', 'Student Hostel'),
        ('PG', 'Paying Guest (PG)'),
        ('Chhatralaya', 'Samaj Chhatralaya'),
        ('Student Residence', 'Student Co-Living Residence'),
    )
    HOSTEL_TYPES = (
        ('Government', 'Government Hostel'),
        ('University', 'University Hostel'),
        ('College', 'College Campus Hostel'),
        ('Trust/Community', 'Trust / Samaj Hostel'),
        ('Private', 'Private Hostel'),
        ('Student PG', 'Student PG'),
        ('Co-living', 'Co-Living Space'),
    )
    GENDER_TYPES = (
        ('Boys', 'Boys'),
        ('Girls', 'Girls'),
        ('Co-Ed', 'Co-Ed'),
    )
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('needs_review', 'Needs Review'),
    )
    
    name = models.CharField(max_length=250)
    short_name = models.CharField(max_length=50, blank=True, null=True)
    accommodation_type = models.CharField(max_length=50, choices=ACCOMMODATION_TYPES, default='Hostel', db_index=True)
    hostel_type = models.CharField(max_length=50, choices=HOSTEL_TYPES, default='Government', db_index=True)
    gender = models.CharField(max_length=20, choices=GENDER_TYPES, default='Boys', db_index=True)
    city = models.CharField(max_length=100, db_index=True)
    district = models.CharField(max_length=100, db_index=True)
    address = models.TextField()
    area = models.CharField(max_length=150, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    annual_fee_approx = models.CharField(max_length=100, default="Fee information not available")
    monthly_fee = models.CharField(max_length=100, blank=True, null=True)
    fee_type = models.CharField(max_length=50, default="Yearly / Monthly")
    fee_notes = models.TextField(blank=True, null=True)
    fee_verified = models.BooleanField(default=False)
    facilities = models.TextField(help_text="Mess, Wi-Fi, Laundry, AC, RO Water, Security, Power Backup")
    sharing_options = models.CharField(max_length=100, default="2 Sharing, 3 Sharing, 4 Sharing")
    has_food = models.BooleanField(default=True)
    has_wifi = models.BooleanField(default=True)
    has_ac = models.BooleanField(default=False)
    has_laundry = models.BooleanField(default=True)
    curfew_time = models.CharField(max_length=50, default="9:30 PM")
    contact_phone = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    website = models.URLField(max_length=500, blank=True, null=True)
    google_map_url = models.URLField(max_length=500, blank=True, null=True)
    latitude = models.FloatField(default=23.0225)
    longitude = models.FloatField(default=72.5714)
    place_id = models.CharField(max_length=250, blank=True, null=True)
    location_verified = models.BooleanField(default=False)
    location_source = models.CharField(max_length=100, default='Verified Address Coordinates')
    location_last_verified_at = models.DateTimeField(auto_now=True)
    distance_to_top_colleges = models.TextField(help_text="e.g. 0.8 km from college")
    community_eligibility = models.CharField(max_length=200, blank=True, null=True, help_text="Official community criteria if explicitly published by trust")
    availability_status = models.CharField(max_length=50, default="Available")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='active', db_index=True)

    class Meta:
        unique_together = ('name', 'city')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.gender}) - {self.city}"


class CollegeHostelDistance(models.Model):
    STATUS_CHOICES = (
        ('verified', 'Verified Road Distance'),
        ('haversine_fallback', 'Haversine Fallback'),
        ('unavailable', 'Distance Unavailable'),
    )
    PROVIDER_CHOICES = (
        ('google_routes', 'Google Maps Platform Routes API'),
        ('haversine', 'Haversine Geographic Calculator'),
        ('manual', 'Manual Admin Verified'),
    )

    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='hostel_distances')
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name='college_distances')
    distance_meters = models.IntegerField(null=True, blank=True, help_text="Precise road distance in meters")
    distance_km = models.FloatField(null=True, blank=True, help_text="Calculated road distance in kilometers")
    duration_seconds = models.IntegerField(null=True, blank=True, help_text="Approximate travel time in seconds")
    duration_text = models.CharField(max_length=50, blank=True, null=True, help_text="e.g. 6 mins")
    provider = models.CharField(max_length=50, choices=PROVIDER_CHOICES, default='google_routes')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='verified')
    calculated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('college', 'hostel')
        ordering = ['distance_meters']

    def __str__(self):
        return f"{self.college.short_name or self.college.name} -> {self.hostel.name} ({self.get_display_text()})"

    def get_display_text(self):
        if self.status == 'unavailable' or self.distance_meters is None:
            return "Distance unavailable"
        if self.distance_meters < 1000:
            return f"{self.distance_meters} m from college"
        return f"{round(self.distance_km, 1)} km from college"


class Scholarship(BaseVerifiedModel):
    title = models.CharField(max_length=250)
    provider = models.CharField(max_length=200, default="Government of Gujarat / Department of Higher Education")
    category_eligibility = models.CharField(max_length=200, default="SC / ST / SEBC / EWS / Open")
    income_limit = models.CharField(max_length=150, default="Rs. 2,50,000 to Rs. 6,00,000 per annum")
    financial_benefits = models.TextField()
    eligibility_criteria = models.TextField()
    documents_required = models.TextField()
    official_url = models.URLField(max_length=500)
    application_deadline = models.CharField(max_length=100, default="Check official portal for current cycle")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class GovernmentScheme(BaseVerifiedModel):
    title = models.CharField(max_length=250)
    department = models.CharField(max_length=200, default="Education Department, Govt of Gujarat")
    category = models.CharField(max_length=100, default="Education & Student Welfare")
    benefits = models.TextField()
    eligibility = models.TextField()
    how_to_apply = models.TextField()
    official_url = models.URLField(max_length=500)

    def __str__(self):
        return self.title


class DocumentItem(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, default="Academic")
    description = models.TextField(blank=True, null=True)
    is_mandatory = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title


class StudentChecklist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='checklist_items')
    item_title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, default="First-Year Steps")
    is_completed = models.BooleanField(default=False)
    notes = models.CharField(max_length=250, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.item_title}"


class FAQ(models.Model):
    question_en = models.TextField()
    question_gu = models.TextField(blank=True, null=True)
    question_hi = models.TextField(blank=True, null=True)
    answer_en = models.TextField()
    answer_gu = models.TextField(blank=True, null=True)
    answer_hi = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, default="General Admission")

    def __str__(self):
        return self.question_en[:60]


class Notice(BaseVerifiedModel):
    title = models.CharField(max_length=250)
    category = models.CharField(max_length=100, default="Admission Notice")
    summary = models.TextField()
    publish_date = models.DateField(default=timezone.now)
    expiry_date = models.DateField(blank=True, null=True)
    is_important = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class StudyResource(models.Model):
    course_category = models.CharField(max_length=100)
    subject_name = models.CharField(max_length=150)
    title = models.CharField(max_length=250)
    resource_type = models.CharField(max_length=50, default="Notes")
    url = models.URLField(max_length=500)
    author_organization = models.CharField(max_length=200, default="Official Open Resource")

    def __str__(self):
        return f"{self.subject_name} - {self.title}"


class Question(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='asked_questions')
    title = models.CharField(max_length=250)
    content = models.TextField()
    college_name = models.CharField(max_length=200, blank=True, null=True)
    course_name = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="Active")

    def __str__(self):
        return self.title


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_answers')
    content = models.TextField()
    is_verified_senior_answer = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer to: {self.question.title[:30]}"


class SavedItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_items')
    item_type = models.CharField(max_length=50)
    item_id = models.IntegerField()
    item_name = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'item_type', 'item_id')

    def __str__(self):
        return f"{self.user.username} saved {self.item_type} #{self.item_id}"


class DataReport(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Under Review', 'Under Review'),
        ('Corrected', 'Corrected'),
        ('Rejected', 'Rejected'),
    )
    user_email = models.EmailField(blank=True, null=True)
    item_type = models.CharField(max_length=50)
    item_id = models.IntegerField(default=0)
    item_name = models.CharField(max_length=250)
    report_reason = models.CharField(max_length=200)
    details = models.TextField()
    suggested_correction = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Report on {self.item_name} - {self.status}"


class VerificationRecord(models.Model):
    item_type = models.CharField(max_length=50)
    item_id = models.IntegerField()
    item_name = models.CharField(max_length=250)
    previous_status = models.CharField(max_length=50)
    new_status = models.CharField(max_length=50)
    source_url = models.URLField(max_length=500, blank=True, null=True)
    source_name = models.CharField(max_length=250, blank=True, null=True)
    verified_by = models.CharField(max_length=100, default='Admin')
    notes = models.TextField(blank=True, null=True)
    date_verified = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Verification update for {self.item_name} on {self.date_verified.strftime('%Y-%m-%d')}"


class TranslationString(models.Model):
    key = models.CharField(max_length=250, unique=True)
    text_en = models.TextField()
    text_gu = models.TextField(blank=True, null=True)
    text_hi = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.key

 erDiagram


   COUNTRIES ||--o{ CITIES : has
   CITIES ||--o{ UNIVERSITIES : contains
   UNIVERSITIES ||--o{ DEGREES : offers
   UNIVERSITIES ||--o{ UNIVERSITY_IMAGES : has
   UNIVERSITIES ||--o{ INTAKES : has
   UNIVERSITIES ||--o{ SCHOLARSHIPS : offers
   SCHOLARSHIPS ||--o{ SCHOLARSHIP_SCOPES : targets
   DEGREES ||--o{ FACULTIES : contains
   FACULTIES ||--o{ COURSES : provides


   COUNTRIES {
       bigint id PK
       string name
       string iso_code
       string currency
       boolean is_active
       datetime created_at
       datetime updated_at
   }


   CITIES {
       bigint id PK
       bigint country_id FK
       string name
       string state
       boolean is_active
       datetime created_at
       datetime updated_at
   }


   UNIVERSITIES {
       bigint id PK
       bigint country_id FK
       bigint city_id FK
       string name
       string short_name
       string slug
       string university_type
       string website
       string email
       string phone
       string address
       string postal_code
       string logo
       string banner
       text description
       boolean featured
       boolean is_active
       datetime created_at
       datetime updated_at
   }


   DEGREES {
       bigint id PK
       bigint university_id FK
       string name
       string level
       int duration_months
       string study_mode
       boolean is_active
       datetime created_at
       datetime updated_at
   }


   FACULTIES {
       bigint id PK
       bigint degree_id FK
       string name
       text description
       boolean is_active
       datetime created_at
       datetime updated_at
   }


   COURSES {
       bigint id PK
       bigint faculty_id FK
       string name
       string course_code
       decimal tuition_fee
       string currency
       int duration_months
       string intake
       decimal ielts_requirement
       decimal ielts_speaking
       decimal ielts_writing
       decimal ielts_reading
       decimal ielts_listening
       decimal pte_requirement
       decimal pte_speaking
       decimal pte_writing
       decimal pte_reading
       decimal pte_listening
       decimal toefl_requirement
       decimal toefl_speaking
       decimal toefl_writing
       decimal toefl_reading
       decimal toefl_listening
       text overview
       boolean scholarship_available
       boolean is_active
       datetime created_at
       datetime updated_at
   }


   UNIVERSITY_IMAGES {
       bigint id PK
       bigint university_id FK
       string url
       string alt_text
       string type
       int sort_order
       boolean is_active
       datetime created_at
       datetime updated_at
   }


   SCHOLARSHIPS {
       bigint id PK
       bigint university_id FK
       string name
       text description
       decimal percentage
       string type
       date deadline
       boolean is_active
       datetime created_at
       datetime updated_at
   }


   INTAKES {
       bigint id PK
       bigint university_id FK
       string name
       date start_date
       date end_date
       date deadline
       string status
       boolean is_active
       datetime created_at
       datetime updated_at
   }


   SCHOLARSHIP_SCOPES {
       bigint id PK
       bigint scholarship_id FK
       string scope_type
       uuid scope_id
       datetime created_at
   }

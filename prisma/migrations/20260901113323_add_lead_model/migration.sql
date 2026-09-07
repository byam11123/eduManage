-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "address" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "googleId" TEXT,
    "emailVerified" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "highestQualification" TEXT,
    "hsSchoolName" TEXT,
    "hsBoard" TEXT,
    "hsPassingYear" TEXT,
    "hsPercentage" TEXT,
    "hssSchoolName" TEXT,
    "hssBoard" TEXT,
    "hssStream" TEXT,
    "hssPassingYear" TEXT,
    "hssPercentage" TEXT,
    "gradCollegeName" TEXT,
    "gradUniversity" TEXT,
    "gradDegree" TEXT,
    "gradPassingYear" TEXT,
    "gradPercentage" TEXT,
    "pgCollegeName" TEXT,
    "pgUniversity" TEXT,
    "pgDegree" TEXT,
    "pgPassingYear" TEXT,
    "pgPercentage" TEXT,
    "fathersName" TEXT,
    "fathersPhone" TEXT,
    "gender" TEXT,
    "dateOfBirth" DATETIME,
    "experienceYears" INTEGER,
    "skills" TEXT,
    "referredBy" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "hsMarksheetUrl" TEXT,
    "hssMarksheetUrl" TEXT,
    "gradDegreeUrl" TEXT,
    "pgDegreeUrl" TEXT
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "industry" TEXT,
    "size" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "planName" TEXT DEFAULT 'Free Plan',
    "planAmount" REAL NOT NULL DEFAULT 0,
    "planStartDate" DATETIME,
    "planExpiryDate" DATETIME,
    "emailBalance" INTEGER NOT NULL DEFAULT 0,
    "textBalance" INTEGER NOT NULL DEFAULT 0,
    "whatsappMarketingBalance" INTEGER NOT NULL DEFAULT 0,
    "whatsappUtilityBalance" INTEGER NOT NULL DEFAULT 0,
    "attendanceRules" TEXT,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rechargeBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WalletTransaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL DEFAULT 'member',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "invitedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" DATETIME,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "Branch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserBranch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "employeeCode" TEXT,
    "designation" TEXT,
    "department" TEXT,
    "joiningDate" DATETIME,
    "salaryType" TEXT,
    "salaryAmount" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "appointmentLetterUrl" TEXT,
    "joiningReportUrl" TEXT,
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    CONSTRAINT "UserBranch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentDisplayId" TEXT,
    "studentYear" INTEGER,
    "studentSequence" INTEGER,
    "instituteCode" TEXT NOT NULL DEFAULT 'OCI',
    "admissionDisplayId" TEXT,
    "admissionYear" INTEGER,
    "admissionSequence" INTEGER,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,
    "enrollmentNo" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "enrollmentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "fathersName" TEXT,
    "fathersPhone" TEXT,
    "mothersName" TEXT,
    "category" TEXT,
    "maritalStatus" TEXT,
    "aadhaarNumber" TEXT,
    "alternatePhone" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "district" TEXT,
    "imageUrl" TEXT,
    "schoolCollege" TEXT,
    "referredBy" TEXT,
    "highestQualification" TEXT,
    "hsSchoolName" TEXT,
    "hsBoard" TEXT,
    "hsPassingYear" TEXT,
    "hsPercentage" TEXT,
    "hssSchoolName" TEXT,
    "hssBoard" TEXT,
    "hssStream" TEXT,
    "hssPassingYear" TEXT,
    "hssPercentage" TEXT,
    "gradCollegeName" TEXT,
    "gradUniversity" TEXT,
    "gradDegree" TEXT,
    "gradPassingYear" TEXT,
    "gradPercentage" TEXT,
    "pgCollegeName" TEXT,
    "pgUniversity" TEXT,
    "pgDegree" TEXT,
    "pgPassingYear" TEXT,
    "pgPercentage" TEXT,
    "totalAmount" REAL NOT NULL DEFAULT 0,
    "discountAmount" REAL NOT NULL DEFAULT 0,
    "netPayableFee" REAL NOT NULL DEFAULT 0,
    "isPartPayment" BOOLEAN NOT NULL DEFAULT false,
    "installmentPlan" TEXT,
    "installmentMode" TEXT,
    "fullPayment" TEXT,
    "receivedBy" TEXT,
    "aadhaarCardUrl" TEXT,
    "hsMarksheetUrl" TEXT,
    "hssMarksheetUrl" TEXT,
    "gradDegreeUrl" TEXT,
    "pgDegreeUrl" TEXT,
    "admissionFormUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "branchId" TEXT NOT NULL,
    "courseId" TEXT,
    "batchId" TEXT,
    CONSTRAINT "Student_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Student_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ongoing',
    "totalFee" REAL NOT NULL DEFAULT 0,
    "discountAmount" REAL NOT NULL DEFAULT 0,
    "netPayable" REAL NOT NULL DEFAULT 0,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentCourseBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentCourseId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    CONSTRAINT "StudentCourseBatch_studentCourseId_fkey" FOREIGN KEY ("studentCourseId") REFERENCES "StudentCourse" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentCourseBatch_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Installment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentCourseId" TEXT NOT NULL,
    "installmentNo" INTEGER NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "paidDate" DATETIME,
    "paidAmount" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "mode" TEXT,
    "receiptNo" TEXT,
    "transactionId" TEXT,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Installment_studentCourseId_fkey" FOREIGN KEY ("studentCourseId") REFERENCES "StudentCourse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "courseType" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'offline',
    "fee" REAL NOT NULL DEFAULT 0,
    "feeDescription" TEXT,
    "registrationFee" REAL NOT NULL DEFAULT 0,
    "discountAllowed" BOOLEAN NOT NULL DEFAULT false,
    "discountPercentage" REAL NOT NULL DEFAULT 0,
    "durationYears" INTEGER NOT NULL DEFAULT 0,
    "durationMonths" INTEGER NOT NULL DEFAULT 0,
    "maxInstallments" INTEGER NOT NULL DEFAULT 1,
    "installmentAmounts" TEXT,
    "eligibility" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "showInAdmissionForm" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "Course_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "startTime" TEXT,
    "endTime" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "courseId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Batch_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "courseId" TEXT NOT NULL,
    CONSTRAINT "Subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enquiryId" TEXT,
    "enquiryYear" INTEGER,
    "enquirySequence" INTEGER,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "courseId" TEXT,
    CONSTRAINT "Enquiry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enquiry_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enquiry_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "receiptNo" TEXT NOT NULL,
    "receiptYear" INTEGER NOT NULL,
    "receiptSequence" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mode" TEXT NOT NULL,
    "transactionId" TEXT,
    "remark" TEXT,
    "studentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Receipt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "source" TEXT NOT NULL DEFAULT 'website',
    "stage" TEXT NOT NULL DEFAULT 'new',
    "company" TEXT,
    "value" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "assignedTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT,
    CONSTRAINT "Lead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Lead_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Counter" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "remarks" TEXT,
    "studentId" TEXT,
    "employeeId" TEXT,
    "branchId" TEXT NOT NULL,
    "batchId" TEXT,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attendance_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attendance_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Attendance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModulePermission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "canAccess" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ModulePermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ModulePermission_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Referrer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "type" TEXT NOT NULL DEFAULT 'agent',
    "status" TEXT NOT NULL DEFAULT 'active',
    "defaultCommissionType" TEXT NOT NULL DEFAULT 'percentage',
    "defaultCommissionAmount" REAL NOT NULL DEFAULT 0,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Referrer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Referrer_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referrerId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rewardAmount" REAL NOT NULL DEFAULT 0,
    "rewardStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "paidDate" DATETIME,
    "payoutMode" TEXT,
    "payoutTransactionId" TEXT,
    "payoutRemarks" TEXT,
    "notes" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Referrer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Referral_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Referral_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EducationBoard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EducationUniversity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EducationCollege" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EducationSchool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EducationDegree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_googleId_idx" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "Otp_email_idx" ON "Otp"("email");

-- CreateIndex
CREATE INDEX "Otp_code_idx" ON "Otp"("code");

-- CreateIndex
CREATE INDEX "Otp_expiresAt_idx" ON "Otp"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");

-- CreateIndex
CREATE INDEX "PasswordReset_email_idx" ON "PasswordReset"("email");

-- CreateIndex
CREATE INDEX "PasswordReset_token_idx" ON "PasswordReset"("token");

-- CreateIndex
CREATE INDEX "PasswordReset_expiresAt_idx" ON "PasswordReset"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_ownerId_key" ON "Organization"("ownerId");

-- CreateIndex
CREATE INDEX "Organization_slug_idx" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_ownerId_idx" ON "Organization"("ownerId");

-- CreateIndex
CREATE INDEX "WalletTransaction_organizationId_idx" ON "WalletTransaction"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationMember_organizationId_idx" ON "OrganizationMember"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "Branch_organizationId_idx" ON "Branch"("organizationId");

-- CreateIndex
CREATE INDEX "UserBranch_userId_idx" ON "UserBranch"("userId");

-- CreateIndex
CREATE INDEX "UserBranch_branchId_idx" ON "UserBranch"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBranch_userId_branchId_key" ON "UserBranch"("userId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentDisplayId_key" ON "Student"("studentDisplayId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_admissionDisplayId_key" ON "Student"("admissionDisplayId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_enrollmentNo_key" ON "Student"("enrollmentNo");

-- CreateIndex
CREATE INDEX "Student_branchId_idx" ON "Student"("branchId");

-- CreateIndex
CREATE INDEX "Student_courseId_idx" ON "Student"("courseId");

-- CreateIndex
CREATE INDEX "Student_batchId_idx" ON "Student"("batchId");

-- CreateIndex
CREATE INDEX "Student_email_idx" ON "Student"("email");

-- CreateIndex
CREATE INDEX "Student_status_idx" ON "Student"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Student_instituteCode_studentYear_studentSequence_key" ON "Student"("instituteCode", "studentYear", "studentSequence");

-- CreateIndex
CREATE UNIQUE INDEX "Student_admissionYear_admissionSequence_key" ON "Student"("admissionYear", "admissionSequence");

-- CreateIndex
CREATE INDEX "StudentCourse_studentId_idx" ON "StudentCourse"("studentId");

-- CreateIndex
CREATE INDEX "StudentCourse_courseId_idx" ON "StudentCourse"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCourse_studentId_courseId_key" ON "StudentCourse"("studentId", "courseId");

-- CreateIndex
CREATE INDEX "StudentCourseBatch_studentCourseId_idx" ON "StudentCourseBatch"("studentCourseId");

-- CreateIndex
CREATE INDEX "StudentCourseBatch_batchId_idx" ON "StudentCourseBatch"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCourseBatch_studentCourseId_batchId_key" ON "StudentCourseBatch"("studentCourseId", "batchId");

-- CreateIndex
CREATE INDEX "Installment_studentCourseId_idx" ON "Installment"("studentCourseId");

-- CreateIndex
CREATE INDEX "Installment_status_idx" ON "Installment"("status");

-- CreateIndex
CREATE INDEX "Course_organizationId_idx" ON "Course"("organizationId");

-- CreateIndex
CREATE INDEX "Course_status_idx" ON "Course"("status");

-- CreateIndex
CREATE INDEX "Batch_courseId_idx" ON "Batch"("courseId");

-- CreateIndex
CREATE INDEX "Subject_courseId_idx" ON "Subject"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_enquiryId_key" ON "Enquiry"("enquiryId");

-- CreateIndex
CREATE INDEX "Enquiry_organizationId_idx" ON "Enquiry"("organizationId");

-- CreateIndex
CREATE INDEX "Enquiry_branchId_idx" ON "Enquiry"("branchId");

-- CreateIndex
CREATE INDEX "Enquiry_courseId_idx" ON "Enquiry"("courseId");

-- CreateIndex
CREATE INDEX "Enquiry_status_idx" ON "Enquiry"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_enquiryYear_enquirySequence_key" ON "Enquiry"("enquiryYear", "enquirySequence");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_receiptNo_key" ON "Receipt"("receiptNo");

-- CreateIndex
CREATE INDEX "Receipt_studentId_idx" ON "Receipt"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_receiptYear_receiptSequence_key" ON "Receipt"("receiptYear", "receiptSequence");

-- CreateIndex
CREATE INDEX "Lead_organizationId_idx" ON "Lead"("organizationId");

-- CreateIndex
CREATE INDEX "Lead_branchId_idx" ON "Lead"("branchId");

-- CreateIndex
CREATE INDEX "Lead_stage_idx" ON "Lead"("stage");

-- CreateIndex
CREATE INDEX "Attendance_date_idx" ON "Attendance"("date");

-- CreateIndex
CREATE INDEX "Attendance_studentId_idx" ON "Attendance"("studentId");

-- CreateIndex
CREATE INDEX "Attendance_employeeId_idx" ON "Attendance"("employeeId");

-- CreateIndex
CREATE INDEX "Attendance_branchId_idx" ON "Attendance"("branchId");

-- CreateIndex
CREATE INDEX "Attendance_batchId_idx" ON "Attendance"("batchId");

-- CreateIndex
CREATE INDEX "Attendance_organizationId_idx" ON "Attendance"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_date_studentId_type_key" ON "Attendance"("date", "studentId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_date_employeeId_type_key" ON "Attendance"("date", "employeeId", "type");

-- CreateIndex
CREATE INDEX "ModulePermission_userId_idx" ON "ModulePermission"("userId");

-- CreateIndex
CREATE INDEX "ModulePermission_organizationId_idx" ON "ModulePermission"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ModulePermission_userId_organizationId_module_key" ON "ModulePermission"("userId", "organizationId", "module");

-- CreateIndex
CREATE INDEX "Referrer_organizationId_idx" ON "Referrer"("organizationId");

-- CreateIndex
CREATE INDEX "Referrer_branchId_idx" ON "Referrer"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_studentId_key" ON "Referral"("studentId");

-- CreateIndex
CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");

-- CreateIndex
CREATE INDEX "Referral_studentId_idx" ON "Referral"("studentId");

-- CreateIndex
CREATE INDEX "Referral_organizationId_idx" ON "Referral"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "EducationBoard_name_key" ON "EducationBoard"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EducationUniversity_name_key" ON "EducationUniversity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EducationCollege_name_key" ON "EducationCollege"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EducationSchool_name_key" ON "EducationSchool"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EducationDegree_name_key" ON "EducationDegree"("name");

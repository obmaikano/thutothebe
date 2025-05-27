# School Admin User Guide - ThutoLMS

## 🎯 Welcome to School Admin Dashboard

This guide will help you navigate and effectively use the School Admin features in ThutoLMS. As a school administrator, you have access to powerful tools for managing your school's academic operations.

## 🚀 Getting Started

### Accessing Your Dashboard
1. **Login** to ThutoLMS with your school admin credentials
2. You'll be automatically directed to your **School Admin Dashboard**
3. Use the **sidebar navigation** to access different modules

### Dashboard Overview
Your dashboard provides:
- **Quick statistics** about your school
- **Recent activities** and notifications
- **Quick action buttons** for common tasks
- **Navigation menu** to all admin features

## 📚 Core Features

### 1. 🕒 Timetable Management

**Purpose:** Create and manage class schedules for your school.

#### Accessing Timetable Management
- Click **"Timetable Management"** in the sidebar
- Or navigate to `/app/timetable`

#### Key Features

**📊 Dashboard Overview**
- **Total Schedules:** View total number of scheduled classes
- **Active Classes:** See how many classes are currently active
- **Available Teachers:** Check teacher availability
- **Conflicts:** Monitor scheduling conflicts that need resolution

**📅 Weekly View**
- **Grid Layout:** Visual representation of weekly schedule
- **Time Slots:** Organized by time periods (8:00 AM - 5:00 PM)
- **Class Information:** Each slot shows class, teacher, and subject
- **Color Coding:** Different colors for different subjects/classes

**🔍 Filtering & Search**
- **Search Bar:** Find specific classes, teachers, or subjects
- **Class Filter:** Filter by specific classes
- **Type Filter:** Filter by schedule type (regular, exam, special)
- **Week Navigation:** Move between different weeks

#### How to Use

**Creating a New Schedule:**
1. Click **"Add Schedule"** button
2. Fill in the schedule form:
   - **Time:** Select start and end time
   - **Class:** Choose the class
   - **Teacher:** Assign a teacher
   - **Subject:** Select the subject
   - **Room:** Assign classroom (if applicable)
3. Click **"Save"** - the system will check for conflicts
4. If conflicts exist, you'll be notified to resolve them

**Editing Existing Schedules:**
1. Click on any **schedule slot** in the grid
2. Modify the details as needed
3. Save changes - conflict checking runs automatically

**Managing Conflicts:**
1. Click **"Check Conflicts"** to scan for issues
2. Review the **conflict alerts**
3. Resolve by:
   - Adjusting time slots
   - Reassigning teachers
   - Moving to different rooms

**Viewing Different Weeks:**
- Use **"Previous Week"** and **"Next Week"** buttons
- Or click on the **week selector** to jump to specific dates

### 2. 📝 Assessment Configuration

**Purpose:** Create and manage assessments, exams, and grading schemes.

#### Accessing Assessment Configuration
- Click **"Assessment Configuration"** in the sidebar
- Or navigate to `/app/assessments`

#### Key Features

**📊 Assessment Overview**
- **Total Assessments:** All assessments in your school
- **Active Assessments:** Currently running assessments
- **Draft Assessments:** Assessments being prepared
- **Completed Assessments:** Finished assessments

**📋 Assessment Cards**
Each assessment is displayed as a card showing:
- **Assessment name** and type
- **Class and subject** information
- **Due date** and status
- **Progress indicators** (submissions received)
- **Average scores** (for completed assessments)
- **Quick action buttons** (edit, view, delete)

**🔍 Filtering Options**
- **Type Filter:** Exam, Quiz, Assignment, Project
- **Status Filter:** Active, Draft, Completed, Overdue
- **Class Filter:** Filter by specific classes

#### How to Use

**Creating New Assessments:**
1. Click **"Create Assessment"** button
2. Fill in assessment details:
   - **Name:** Assessment title
   - **Type:** Choose from Exam, Quiz, Assignment, Project
   - **Class:** Select target class
   - **Subject:** Choose subject
   - **Due Date:** Set submission deadline
   - **Instructions:** Provide detailed instructions
   - **Grading Scheme:** Set marking criteria
3. **Save as Draft** or **Publish** immediately

**Managing Existing Assessments:**
- **View Details:** Click on assessment card to see full details
- **Edit:** Use edit button to modify assessment
- **Monitor Progress:** Track submission rates and scores
- **Generate Reports:** Export assessment results

**Configuring Grading Schemes:**
1. Click **"Configure Grading"** button
2. Set up:
   - **Grade boundaries** (A, B, C, D, F)
   - **Percentage ranges** for each grade
   - **Pass/fail criteria**
   - **Special considerations**

### 3. 👨‍🏫 Subject Allocation

**Purpose:** Allocate subjects to teachers and monitor curriculum delivery.

#### Accessing Subject Allocation
- Click **"Subject Allocation"** in the sidebar
- Or navigate to `/app/subject-allocation`

#### Key Features

**📊 Allocation Overview**
- **Total Allocations:** All subject-teacher assignments
- **Active Allocations:** Currently active assignments
- **Average Progress:** Overall curriculum delivery progress
- **Workload Distribution:** Teacher workload analysis

**👨‍🏫 Teacher Workload Cards**
Each teacher card shows:
- **Teacher name** and photo
- **Subjects assigned** with class information
- **Workload indicator:** Light (green), Moderate (yellow), Heavy (red)
- **Progress percentage** for curriculum delivery
- **Quick actions** for managing allocations

**🔍 Filtering & Management**
- **Subject Filter:** Filter by specific subjects
- **Status Filter:** Active, Pending, Completed allocations
- **Class Filter:** Filter by class levels
- **Workload Filter:** Light, Moderate, Heavy workloads

#### How to Use

**Allocating Subjects to Teachers:**
1. Click **"Allocate Subject"** button
2. Select:
   - **Teacher:** Choose from available teachers
   - **Subject:** Select subject to allocate
   - **Class:** Choose target class
   - **Academic Year:** Set time period
3. **Confirm allocation** - system checks for conflicts

**Managing Teacher Workloads:**
- **Monitor workload indicators:**
  - 🟢 **Light:** 1-3 subjects (healthy workload)
  - 🟡 **Moderate:** 4-6 subjects (manageable)
  - 🔴 **Heavy:** 7+ subjects (may need redistribution)

**Bulk Allocation:**
1. Click **"Bulk Allocate"** for multiple assignments
2. Upload CSV file with allocation data
3. Review and confirm bulk changes

**Tracking Progress:**
- **View curriculum delivery progress** for each teacher
- **Identify teachers** who may need support
- **Redistribute subjects** if workload becomes unmanageable

### 4. 📊 School Reports

**Purpose:** Generate comprehensive reports on school performance.

#### Accessing Reports
- Click **"Reports"** in the sidebar
- Or navigate to `/app/reports`

#### Available Reports

**📈 Student Performance Reports**
- Academic performance by class
- Subject-wise performance analysis
- Individual student progress reports
- Comparative analysis across terms

**📅 Attendance Reports**
- Daily attendance summaries
- Class-wise attendance patterns
- Individual student attendance records
- Attendance trends over time

**👥 Staff Activity Reports**
- Teacher performance metrics
- Curriculum delivery progress
- Professional development tracking
- Staff attendance and punctuality

#### How to Generate Reports

**Standard Reports:**
1. Select **report type** from available options
2. Choose **date range** for the report
3. Select **filters** (class, subject, teacher)
4. Click **"Generate Report"**
5. **Download** or **view online**

**Custom Reports:**
1. Click **"Create Custom Report"**
2. Select **data sources** you want to include
3. Choose **visualization type** (charts, tables, graphs)
4. Set **parameters** and filters
5. **Generate and save** for future use

### 5. ⚙️ School Settings

**Purpose:** Configure school-wide settings and preferences.

#### Accessing Settings
- Click **"Settings"** in the sidebar
- Or navigate to `/app/settings`

#### Settings Categories

**🏫 School Profile**
- School name and contact information
- Logo and branding settings
- Academic calendar configuration
- Term and semester settings

**👥 User Management**
- Admin delegate assignments
- Role permissions configuration
- User access controls
- Password policies

**🔔 Notifications**
- Email notification preferences
- SMS alert settings
- System notification rules
- Emergency communication setup

**🔒 Security Settings**
- Login security requirements
- Data backup configurations
- Privacy settings
- Audit log preferences

#### How to Configure Settings

**Updating School Profile:**
1. Go to **"School Profile"** section
2. **Edit** the information you want to change
3. **Upload new logo** if needed
4. **Save changes**

**Managing Admin Delegates:**
1. Navigate to **"User Management"**
2. Click **"Add Delegate"**
3. **Select user** to grant admin privileges
4. **Choose permission level**
5. **Confirm assignment**

## 🔧 Additional Features

### 📱 Mobile Responsiveness
- All features work on **tablets and smartphones**
- **Touch-friendly interface** for mobile devices
- **Responsive design** adapts to screen size

### 🔍 Search Functionality
- **Global search** across all modules
- **Quick filters** for common searches
- **Advanced search** with multiple criteria

### 📤 Export Capabilities
- **PDF exports** for reports and schedules
- **Excel exports** for data analysis
- **CSV exports** for data transfer

### 🔔 Notifications
- **Real-time alerts** for important events
- **Email notifications** for deadlines
- **Dashboard notifications** for quick updates

## 🆘 Troubleshooting

### Common Issues

**Can't Access a Feature:**
- Check your **user permissions**
- Ensure you're logged in as **school admin**
- Contact system administrator if needed

**Scheduling Conflicts:**
- Use **conflict checker** to identify issues
- **Adjust time slots** or reassign resources
- Consider **alternative arrangements**

**Slow Performance:**
- **Refresh the page** if loading is slow
- **Clear browser cache** if problems persist
- **Check internet connection**

**Data Not Saving:**
- Ensure all **required fields** are filled
- Check for **validation errors**
- Try **saving again** after corrections

### Getting Help

**In-App Help:**
- Look for **help icons** (?) next to features
- Check **tooltips** for quick guidance
- Use **help section** in settings

**Contact Support:**
- **Email:** support@thutolms.bw
- **Phone:** +267 XXX XXXX
- **Help Desk:** Available during school hours

**Training Resources:**
- **Video tutorials** available in help section
- **User manual** downloadable from settings
- **Training sessions** scheduled regularly

## 📋 Best Practices

### Timetable Management
- **Plan ahead:** Create schedules at least one week in advance
- **Check conflicts:** Always run conflict checker before finalizing
- **Backup plans:** Have alternative arrangements for teacher absences
- **Regular updates:** Review and update schedules weekly

### Assessment Management
- **Clear instructions:** Provide detailed assessment guidelines
- **Advance notice:** Give students adequate time for preparation
- **Fair grading:** Use consistent grading schemes
- **Timely feedback:** Provide results promptly

### Subject Allocation
- **Balanced workloads:** Monitor teacher assignments regularly
- **Teacher strengths:** Align subjects with teacher expertise
- **Curriculum coverage:** Ensure all subjects are adequately covered
- **Regular review:** Reassess allocations each term

### Data Management
- **Regular backups:** Export important data regularly
- **Data accuracy:** Verify information before saving
- **Privacy compliance:** Follow data protection guidelines
- **Secure access:** Use strong passwords and secure connections

## 🎯 Tips for Success

### Efficiency Tips
- **Use filters** to quickly find what you need
- **Bookmark frequently used pages**
- **Set up notifications** for important deadlines
- **Use bulk operations** for repetitive tasks

### Organization Tips
- **Create naming conventions** for consistency
- **Use categories and tags** for easy sorting
- **Regular cleanup** of old or unused data
- **Document procedures** for staff reference

### Communication Tips
- **Keep stakeholders informed** of changes
- **Use notification features** effectively
- **Provide clear instructions** to staff
- **Regular updates** to parents and students

## 📞 Support & Resources

### Quick Reference
- **Dashboard:** Overview of all activities
- **Timetable:** `/app/timetable` - Schedule management
- **Assessments:** `/app/assessments` - Assessment configuration
- **Allocations:** `/app/subject-allocation` - Subject assignments
- **Reports:** `/app/reports` - Performance analytics
- **Settings:** `/app/settings` - School configuration

### Keyboard Shortcuts
- **Ctrl + S:** Save current form
- **Ctrl + F:** Search on current page
- **Esc:** Close modal dialogs
- **Tab:** Navigate between form fields

### Browser Requirements
- **Chrome:** Version 90 or later
- **Firefox:** Version 88 or later
- **Safari:** Version 14 or later
- **Edge:** Version 90 or later

---

**Thank you for using ThutoLMS School Admin features!** 

For additional support or feature requests, please contact our support team. 
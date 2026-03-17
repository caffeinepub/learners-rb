# LEARNERS-RB

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Home page with welcoming banner, class-selector navigation, and featured subjects
- Class-wise course browsing: Class 1 through Class 12
- Each class has subjects: Math, Science, English, Social Studies, Hindi (and more per grade)
- Each subject contains chapters/lessons with text-based study content
- Individual lesson/chapter detail pages with full study material text
- Admin content management panel (protected by authorization) to CRUD classes, subjects, chapters, and lessons
- Navigation bar with class selector and subject category links
- Sample/seed content pre-populated for Class 6, 7, and 8 with a few subjects each

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan
1. Backend: Define data models for Class, Subject, Chapter, Lesson with CRUD APIs
2. Backend: Seed data for 3 classes with subjects and sample chapters
3. Backend: Role-based admin authorization for content management
4. Frontend: Home page with banner and class grid
5. Frontend: Class page listing subjects
6. Frontend: Subject page listing chapters/lessons
7. Frontend: Lesson detail page with full content
8. Frontend: Admin panel with forms to add/edit/delete all content types
9. Frontend: Responsive nav with class selector

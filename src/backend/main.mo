import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  type Class = {
    id : Nat;
    name : Text;
    grade : Nat;
    description : Text;
  };

  type Subject = {
    id : Nat;
    classId : Nat;
    name : Text;
    iconName : Text;
    color : Text;
    description : Text;
  };

  type Chapter = {
    id : Nat;
    subjectId : Nat;
    title : Text;
    orderIndex : Nat;
    description : Text;
  };

  type Lesson = {
    id : Nat;
    chapterId : Nat;
    title : Text;
    content : Text;
    orderIndex : Nat;
  };

  module Class {
    public func compare(a : Class, b : Class) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Subject {
    public func compare(a : Subject, b : Subject) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Chapter {
    public func compare(a : Chapter, b : Chapter) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Lesson {
    public func compare(a : Lesson, b : Lesson) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // Persistent Storage
  let classes = Map.empty<Nat, Class>();
  let subjects = Map.empty<Nat, Subject>();
  let chapters = Map.empty<Nat, Chapter>();
  let lessons = Map.empty<Nat, Lesson>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextClassId = 1;
  var nextSubjectId = 1;
  var nextChapterId = 1;
  var nextLessonId = 1;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Add new class (admin only)
  public shared ({ caller }) func addClass(newClass : Class) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add classes");
    };

    let id = nextClassId;
    nextClassId += 1;

    let finalClass : Class = { newClass with id };
    classes.add(id, finalClass);
    id;
  };

  // Update class (admin only)
  public shared ({ caller }) func updateClass(id : Nat, updatedClass : Class) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update classes");
    };

    switch (classes.get(id)) {
      case null {
        Runtime.trap("Class not found");
      };
      case (?_) {
        let finalClass : Class = { updatedClass with id };
        classes.add(id, finalClass);
      };
    };
  };

  // Delete class (admin only)
  public shared ({ caller }) func deleteClass(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete classes");
    };

    switch (classes.get(id)) {
      case null {
        Runtime.trap("Class not found");
      };
      case (?_) {
        classes.remove(id);
      };
    };
  };

  // Get all classes (public)
  public query func getAllClasses() : async [Class] {
    let iter = classes.values();
    iter.toArray().sort();
  };

  // Add new subject (admin only)
  public shared ({ caller }) func addSubject(newSubject : Subject) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add subjects");
    };

    let id = nextSubjectId;
    nextSubjectId += 1;

    let finalSubject : Subject = { newSubject with id };
    subjects.add(id, finalSubject);
    id;
  };

  // Update subject (admin only)
  public shared ({ caller }) func updateSubject(id : Nat, updatedSubject : Subject) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update subjects");
    };

    switch (subjects.get(id)) {
      case null {
        Runtime.trap("Subject not found");
      };
      case (?_) {
        let finalSubject : Subject = { updatedSubject with id };
        subjects.add(id, finalSubject);
      };
    };
  };

  // Delete subject (admin only)
  public shared ({ caller }) func deleteSubject(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete subjects");
    };

    switch (subjects.get(id)) {
      case null {
        Runtime.trap("Subject not found");
      };
      case (?_) {
        subjects.remove(id);
      };
    };
  };

  // Get subjects by class (public)
  public query func getSubjectsByClass(classId : Nat) : async [Subject] {
    subjects.values().toArray().filter(
      func(subject) {
        subject.classId == classId;
      }
    );
  };

  // Add new chapter (admin only)
  public shared ({ caller }) func addChapter(newChapter : Chapter) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add chapters");
    };

    let id = nextChapterId;
    nextChapterId += 1;

    let finalChapter : Chapter = { newChapter with id };
    chapters.add(id, finalChapter);
    id;
  };

  // Update chapter (admin only)
  public shared ({ caller }) func updateChapter(id : Nat, updatedChapter : Chapter) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update chapters");
    };

    switch (chapters.get(id)) {
      case null {
        Runtime.trap("Chapter not found");
      };
      case (?_) {
        let finalChapter : Chapter = { updatedChapter with id };
        chapters.add(id, finalChapter);
      };
    };
  };

  // Delete chapter (admin only)
  public shared ({ caller }) func deleteChapter(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete chapters");
    };

    switch (chapters.get(id)) {
      case null {
        Runtime.trap("Chapter not found");
      };
      case (?_) {
        chapters.remove(id);
      };
    };
  };

  // Get chapters by subject (public)
  public query func getChaptersBySubject(subjectId : Nat) : async [Chapter] {
    chapters.values().toArray().filter(
      func(chapter) {
        chapter.subjectId == subjectId;
      }
    );
  };

  // Add new lesson (admin only)
  public shared ({ caller }) func addLesson(newLesson : Lesson) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add lessons");
    };

    let id = nextLessonId;
    nextLessonId += 1;

    let finalLesson : Lesson = { newLesson with id };
    lessons.add(id, finalLesson);
    id;
  };

  // Update lesson (admin only)
  public shared ({ caller }) func updateLesson(id : Nat, updatedLesson : Lesson) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update lessons");
    };

    switch (lessons.get(id)) {
      case null {
        Runtime.trap("Lesson not found");
      };
      case (?_) {
        let finalLesson : Lesson = { updatedLesson with id };
        lessons.add(id, finalLesson);
      };
    };
  };

  // Delete lesson (admin only)
  public shared ({ caller }) func deleteLesson(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete lessons");
    };

    switch (lessons.get(id)) {
      case null {
        Runtime.trap("Lesson not found");
      };
      case (?_) {
        lessons.remove(id);
      };
    };
  };

  // Get lessons by chapter (public)
  public query func getLessonsByChapter(chapterId : Nat) : async [Lesson] {
    lessons.values().toArray().filter(
      func(lesson) {
        lesson.chapterId == chapterId;
      }
    );
  };

  // Get single lesson by id (public)
  public query func getLesson(lessonId : Nat) : async ?Lesson {
    lessons.get(lessonId);
  };

  // Search lessons/chapters by keyword (public)
  public query func searchContent(keyword : Text) : async {
    lessons : [Lesson];
    chapters : [Chapter];
  } {
    let filteredLessons = lessons.values().toArray().filter(
      func(lesson) {
        lesson.title.contains(#text(keyword)) or lesson.content.contains(#text(keyword));
      }
    );

    let filteredChapters = chapters.values().toArray().filter(
      func(chapter) {
        chapter.title.contains(#text(keyword));
      }
    );

    {
      lessons = filteredLessons.sort();
      chapters = filteredChapters.sort();
    };
  };

  // Seed data (run upon deployment, admin only)
  public shared ({ caller }) func addSeedData() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can run seed data");
    };

    // Add classes directly
    let class6Id = nextClassId;
    nextClassId += 1;
    classes.add(class6Id, {
      id = class6Id;
      name = "Class 6";
      grade = 6;
      description = "Class 6 Curriculum";
    });

    let class7Id = nextClassId;
    nextClassId += 1;
    classes.add(class7Id, {
      id = class7Id;
      name = "Class 7";
      grade = 7;
      description = "Class 7 Curriculum";
    });

    let class8Id = nextClassId;
    nextClassId += 1;
    classes.add(class8Id, {
      id = class8Id;
      name = "Class 8";
      grade = 8;
      description = "Class 8 Curriculum";
    });

    // Add subjects for each class
    for (classId in [class6Id, class7Id, class8Id].values()) {
      for (subjectName in ["Math", "Science", "English", "Social Studies"].values()) {
        let subjectId = nextSubjectId;
        nextSubjectId += 1;
        subjects.add(subjectId, {
          id = subjectId;
          classId;
          name = subjectName;
          iconName = "";
          color = "";
          description = subjectName # " for Class " # classId.toText();
        });

        // Add 2 sample chapters per subject
        for (chapterNum in [1, 2].values()) {
          let chapterId = nextChapterId;
          nextChapterId += 1;
          chapters.add(chapterId, {
            id = chapterId;
            subjectId;
            title = subjectName # " Chapter " # chapterNum.toText();
            orderIndex = chapterNum;
            description = "Introduction to " # subjectName # " Chapter " # chapterNum.toText();
          });

          // Add 1 sample lesson per chapter
          let lessonId = nextLessonId;
          nextLessonId += 1;
          lessons.add(lessonId, {
            id = lessonId;
            chapterId;
            title = "Lesson 1: Basics";
            content = "This is sample content for " # subjectName # " Chapter " # chapterNum.toText() # ". Students will learn fundamental concepts.";
            orderIndex = 1;
          });
        };
      };
    };
  };
};

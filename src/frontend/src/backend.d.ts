import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Class {
    id: bigint;
    name: string;
    description: string;
    grade: bigint;
}
export interface Lesson {
    id: bigint;
    title: string;
    content: string;
    chapterId: bigint;
    orderIndex: bigint;
}
export interface Subject {
    id: bigint;
    name: string;
    color: string;
    description: string;
    classId: bigint;
    iconName: string;
}
export interface UserProfile {
    name: string;
}
export interface Chapter {
    id: bigint;
    title: string;
    description: string;
    subjectId: bigint;
    orderIndex: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChapter(newChapter: Chapter): Promise<bigint>;
    addClass(newClass: Class): Promise<bigint>;
    addLesson(newLesson: Lesson): Promise<bigint>;
    addSeedData(): Promise<void>;
    addSubject(newSubject: Subject): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteChapter(id: bigint): Promise<void>;
    deleteClass(id: bigint): Promise<void>;
    deleteLesson(id: bigint): Promise<void>;
    deleteSubject(id: bigint): Promise<void>;
    getAllClasses(): Promise<Array<Class>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChaptersBySubject(subjectId: bigint): Promise<Array<Chapter>>;
    getLesson(lessonId: bigint): Promise<Lesson | null>;
    getLessonsByChapter(chapterId: bigint): Promise<Array<Lesson>>;
    getSubjectsByClass(classId: bigint): Promise<Array<Subject>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchContent(keyword: string): Promise<{
        lessons: Array<Lesson>;
        chapters: Array<Chapter>;
    }>;
    updateChapter(id: bigint, updatedChapter: Chapter): Promise<void>;
    updateClass(id: bigint, updatedClass: Class): Promise<void>;
    updateLesson(id: bigint, updatedLesson: Lesson): Promise<void>;
    updateSubject(id: bigint, updatedSubject: Subject): Promise<void>;
}

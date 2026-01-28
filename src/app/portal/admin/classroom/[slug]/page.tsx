"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    GripVertical,
    Video,
    FileText,
    Link as LinkIcon,
    Calendar,
    Clock,
    Play,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Loader2,
    Edit2,
    ExternalLink,
    Users,
    Settings,
    Upload,
    X,
    Bell,
    Pin,
    Send,
    Image as ImageIcon
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAlert } from "@/components/ui/AlertService";
import { useConfirmModal } from "@/components/ui/ConfirmModal";

interface Resource {
    name: string;
    url: string;
}

interface Lesson {
    id: string;
    title: string;
    description?: string;
    videoUrl?: string;
    recordingUrl?: string;
    duration?: string;
    isLiveClass?: boolean;
    liveClassUrl?: string;
    scheduledAt?: string;
    scheduledEndAt?: string;
    resources?: Resource[];
    order: number;
}

interface Module {
    id: string;
    title: string;
    description?: string;
    lessons: Lesson[];
    order: number;
}

interface Course {
    _id: string;
    title: string;
    slug: string;
    subtitle?: string;
    description: string;
    longDescription?: string;
    price: number;
    level: string;
    duration: string;
    modules: Module[];
    instructor: {
        name: string;
        bio?: string;
        avatar?: string;
    };
    features: string[];
    outcomes: string[];
    isPublished: boolean;
    enrolledCount: number;
}

interface Announcement {
    _id: string;
    title: string;
    content: string;
    imageUrl?: string;
    authorName: string;
    isPinned: boolean;
    createdAt: string;
}

interface Assignment {
    _id: string;
    courseSlug: string;
    lessonId: string;
    title: string;
    description: string;
    dueDate?: string;
    maxGrade: number;
    attachments?: { name: string; url: string }[];
    allowLateSubmission: boolean;
    totalSubmissions?: number;
    gradedSubmissions?: number;
    pendingSubmissions?: number;
    createdAt: string;
}

interface Submission {
    _id: string;
    userId: string;
    assignmentId: string;
    courseSlug: string;
    lessonId: string;
    fileUrl?: string;
    fileType?: string;
    fileName?: string;
    textContent?: string;
    grade?: number;
    feedback?: string;
    gradedAt?: string;
    status: 'pending' | 'submitted' | 'graded' | 'late';
    submittedAt: string;
    user?: { name: string; email: string; id?: string };
}

type TabType = 'content' | 'live-classes' | 'assignments' | 'announcements' | 'settings';

export default function CourseContentPage() {
    const { slug } = useParams();
    const router = useRouter();
    const alert = useAlert();
    const { showConfirm, ConfirmModal } = useConfirmModal();
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('content');
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const [editingLesson, setEditingLesson] = useState<string | null>(null);
    const [editingModule, setEditingModule] = useState<string | null>(null);

    // Auto-save
    const [hasChanges, setHasChanges] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialLoad = useRef(true);

    // Announcements
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', isPinned: false, imageUrl: '' });
    const [announcementImageFile, setAnnouncementImageFile] = useState<File | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const announcementImageInputRef = useRef<HTMLInputElement>(null);
    const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

    // Assignments
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
    const [isGradingSubmission, setIsGradingSubmission] = useState<string | null>(null);
    const [newAssignment, setNewAssignment] = useState({
        lessonId: '',
        title: '',
        description: '',
        dueDate: '',
        maxGrade: 100,
        allowLateSubmission: true
    });

    useEffect(() => {
        if (slug) {
            fetchCourse();
            fetchAnnouncements();
            fetchAssignments();
        }
    }, [slug]);

    // Auto-save effect
    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }

        if (!course || !hasChanges) return;

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveCourse(true); // true = auto-save (silent)
        }, 2000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [course]);

    const fetchCourse = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/courses?slug=${slug}`);
            const data = await res.json();
            if (data.course) {
                const courseData = {
                    ...data.course,
                    modules: data.course.modules || [],
                    features: data.course.features || [],
                    outcomes: data.course.outcomes || [],
                    instructor: data.course.instructor || { name: '', bio: '', avatar: '' }
                };
                setCourse(courseData);
                if (courseData.modules.length > 0) {
                    setExpandedModules(new Set([courseData.modules[0].id]));
                }
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            alert.error("Failed to load course", "Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch(`/api/admin/announcements?courseSlug=${slug}`);
            const data = await res.json();
            setAnnouncements(data.announcements || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const res = await fetch(`/api/admin/assignments?courseSlug=${slug}`);
            const data = await res.json();
            setAssignments(data.assignments || []);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const fetchSubmissions = async (assignmentId: string) => {
        try {
            const res = await fetch(`/api/admin/submissions?assignmentId=${assignmentId}`);
            const data = await res.json();
            setSubmissions(data.submissions || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const createAssignment = async () => {
        if (!newAssignment.lessonId || !newAssignment.title || !newAssignment.description) {
            alert.warning("Missing Fields", "Please fill in all required fields");
            return;
        }
        setIsCreatingAssignment(true);
        try {
            const res = await fetch('/api/admin/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseSlug: slug,
                    ...newAssignment
                })
            });
            if (res.ok) {
                setNewAssignment({
                    lessonId: '',
                    title: '',
                    description: '',
                    dueDate: '',
                    maxGrade: 100,
                    allowLateSubmission: true
                });
                fetchAssignments();
                alert.success("Assignment Created", "The assignment has been created successfully");
            } else {
                throw new Error('Failed to create assignment');
            }
        } catch (error) {
            console.error('Error creating assignment:', error);
            alert.error("Creation Failed", "Could not create assignment");
        } finally {
            setIsCreatingAssignment(false);
        }
    };

    const gradeSubmission = async (submissionId: string, grade: number, feedback: string) => {
        setIsGradingSubmission(submissionId);
        try {
            const res = await fetch('/api/admin/submissions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId,
                    grade,
                    feedback,
                    gradedBy: 'admin'
                })
            });
            if (res.ok) {
                if (selectedAssignment) {
                    fetchSubmissions(selectedAssignment._id);
                }
                fetchAssignments();
                alert.success("Graded", "Submission has been graded successfully");
            } else {
                throw new Error('Failed to grade submission');
            }
        } catch (error) {
            console.error('Error grading submission:', error);
            alert.error("Grading Failed", "Could not grade submission");
        } finally {
            setIsGradingSubmission(null);
        }
    };

    const deleteAssignment = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/assignments?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchAssignments();
                setSelectedAssignment(null);
                setSubmissions([]);
                alert.success("Deleted", "Assignment has been deleted");
            }
        } catch (error) {
            console.error('Error deleting assignment:', error);
            alert.error("Delete Failed", "Could not delete assignment");
        }
    };

    const saveCourse = async (isAutoSave = false) => {
        if (!course) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/classroom/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(course)
            });
            const data = await res.json();
            if (res.ok) {
                if (data.course) {
                    setCourse(data.course);
                }
                setHasChanges(false);
                setLastSaved(new Date());
                if (!isAutoSave) {
                    alert.success("Course Saved", "All changes have been saved successfully");
                }
            } else {
                throw new Error(data.message || 'Failed to save');
            }
        } catch (error: any) {
            console.error('Error saving course:', error);
            alert.error("Save Failed", error.message || 'Unknown error');
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to format date for datetime-local input
    const formatDateForInput = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Adjust for local timezone
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    // Mark changes for auto-save
    const markChanged = () => {
        setHasChanges(true);
    };

    const toggleModule = (moduleId: string) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(moduleId)) {
            newExpanded.delete(moduleId);
        } else {
            newExpanded.add(moduleId);
        }
        setExpandedModules(newExpanded);
    };

    const addModule = () => {
        if (!course) return;
        const newModule: Module = {
            id: `module-${Date.now()}`,
            title: 'New Module',
            description: '',
            lessons: [],
            order: course.modules.length + 1
        };
        setCourse({
            ...course,
            modules: [...course.modules, newModule]
        });
        setExpandedModules(new Set([...expandedModules, newModule.id]));
        setEditingModule(newModule.id);
        markChanged();
    };

    const updateModule = (moduleId: string, updates: Partial<Module>) => {
        if (!course) return;
        setCourse({
            ...course,
            modules: course.modules.map(m =>
                m.id === moduleId ? { ...m, ...updates } : m
            )
        });
        markChanged();
    };

    const deleteModule = (moduleId: string, moduleTitle: string) => {
        if (!course) return;
        showConfirm({
            title: "Delete Module",
            message: `Are you sure you want to delete "${moduleTitle}" and all its lessons? This action cannot be undone.`,
            type: "delete",
            confirmLabel: "Delete Module",
            onConfirm: async () => {
                setCourse({
                    ...course,
                    modules: course.modules.filter(m => m.id !== moduleId)
                });
                markChanged();
                alert.success("Module Deleted", "The module has been removed");
            }
        });
    };

    const addLesson = (moduleId: string, isLiveClass: boolean = false) => {
        if (!course) return;
        const module = course.modules.find(m => m.id === moduleId);
        if (!module) return;

        const newLesson: Lesson = {
            id: `lesson-${Date.now()}`,
            title: isLiveClass ? 'New Live Class' : 'New Lesson',
            description: '',
            isLiveClass,
            order: module.lessons.length + 1,
            resources: []
        };

        setCourse({
            ...course,
            modules: course.modules.map(m =>
                m.id === moduleId
                    ? { ...m, lessons: [...m.lessons, newLesson] }
                    : m
            )
        });
        setEditingLesson(newLesson.id);
    };

    const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
        if (!course) return;
        setCourse({
            ...course,
            modules: course.modules.map(m =>
                m.id === moduleId
                    ? {
                        ...m,
                        lessons: m.lessons.map(l =>
                            l.id === lessonId ? { ...l, ...updates } : l
                        )
                    }
                    : m
            )
        });
        markChanged();
    };

    const deleteLesson = (moduleId: string, lessonId: string, lessonTitle: string) => {
        if (!course) return;
        showConfirm({
            title: "Delete Lesson",
            message: `Are you sure you want to delete "${lessonTitle}"? This action cannot be undone.`,
            type: "delete",
            confirmLabel: "Delete Lesson",
            onConfirm: async () => {
                setCourse({
                    ...course,
                    modules: course.modules.map(m =>
                        m.id === moduleId
                            ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
                            : m
                    )
                });
                markChanged();
                alert.success("Lesson Deleted", "The lesson has been removed");
            }
        });
    };

    const addResource = (moduleId: string, lessonId: string) => {
        if (!course) return;
        setCourse({
            ...course,
            modules: course.modules.map(m =>
                m.id === moduleId
                    ? {
                        ...m,
                        lessons: m.lessons.map(l =>
                            l.id === lessonId
                                ? { ...l, resources: [...(l.resources || []), { name: '', url: '' }] }
                                : l
                        )
                    }
                    : m
            )
        });
    };

    const updateResource = (moduleId: string, lessonId: string, index: number, updates: Partial<Resource>) => {
        if (!course) return;
        setCourse({
            ...course,
            modules: course.modules.map(m =>
                m.id === moduleId
                    ? {
                        ...m,
                        lessons: m.lessons.map(l =>
                            l.id === lessonId
                                ? {
                                    ...l,
                                    resources: l.resources?.map((r, i) =>
                                        i === index ? { ...r, ...updates } : r
                                    )
                                }
                                : l
                        )
                    }
                    : m
            )
        });
    };

    const deleteResource = (moduleId: string, lessonId: string, index: number) => {
        if (!course) return;
        setCourse({
            ...course,
            modules: course.modules.map(m =>
                m.id === moduleId
                    ? {
                        ...m,
                        lessons: m.lessons.map(l =>
                            l.id === lessonId
                                ? { ...l, resources: l.resources?.filter((_, i) => i !== index) }
                                : l
                        )
                    }
                    : m
            )
        });
    };

    // Get live classes from all modules
    const getLiveClasses = () => {
        if (!course) return [];
        const liveClasses: (Lesson & { moduleName: string; moduleId: string })[] = [];
        course.modules.forEach(module => {
            module.lessons.filter(l => l.isLiveClass).forEach(lesson => {
                liveClasses.push({
                    ...lesson,
                    moduleName: module.title,
                    moduleId: module.id
                });
            });
        });
        return liveClasses.sort((a, b) => {
            if (!a.scheduledAt) return 1;
            if (!b.scheduledAt) return -1;
            return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Course not found</h2>
                <Link href="/portal/admin/classroom" className="text-indigo-600 hover:underline">
                    Back to Classroom
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/portal/admin/classroom"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
                        <p className="text-slate-500 text-sm">
                            {course.modules.length} modules • {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons • {course.enrolledCount} students
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    {hasChanges && (
                        <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Unsaved changes</span>
                    )}
                    {lastSaved && !hasChanges && (
                        <span className="text-sm text-slate-400">Saved</span>
                    )}
                    <button
                        onClick={() => saveCourse(false)}
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[
                    { id: 'content', label: 'Course Content', icon: BookOpen },
                    { id: 'live-classes', label: 'Live Classes', icon: Video },
                    { id: 'announcements', label: 'Announcements', icon: Bell },
                    { id: 'assignments', label: 'Assignments', icon: FileText },
                    { id: 'settings', label: 'Settings', icon: Settings }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
                <div className="space-y-4">
                    {/* Modules */}
                    {course.modules.map((module, mIdx) => (
                        <motion.div
                            key={module.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: mIdx * 0.05 }}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                        >
                            {/* Module Header */}
                            <div
                                className="p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => toggleModule(module.id)}
                            >
                                <GripVertical size={18} className="text-slate-400 cursor-grab" />
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                    {mIdx + 1}
                                </div>
                                <div className="flex-1">
                                    {editingModule === module.id ? (
                                        <input
                                            type="text"
                                            value={module.title}
                                            onChange={(e) => updateModule(module.id, { title: e.target.value })}
                                            onBlur={() => setEditingModule(null)}
                                            onKeyDown={(e) => e.key === 'Enter' && setEditingModule(null)}
                                            className="w-full px-2 py-1 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <h3 className="font-semibold text-slate-900">{module.title}</h3>
                                    )}
                                    <p className="text-sm text-slate-500">{module.lessons.length} lessons</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingModule(module.id);
                                        }}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteModule(module.id, module.title);
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    {expandedModules.has(module.id) ? (
                                        <ChevronUp size={20} className="text-slate-400" />
                                    ) : (
                                        <ChevronDown size={20} className="text-slate-400" />
                                    )}
                                </div>
                            </div>

                            {/* Module Content */}
                            <AnimatePresence>
                                {expandedModules.has(module.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-100"
                                    >
                                        {/* Lessons */}
                                        <div className="divide-y divide-slate-100">
                                            {module.lessons.map((lesson, lIdx) => (
                                                <div key={lesson.id} className="p-4 pl-14">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${lesson.isLiveClass
                                                            ? 'bg-gradient-to-br from-rose-500 to-orange-400'
                                                            : 'bg-slate-200 text-slate-600'
                                                            }`}>
                                                            {lesson.isLiveClass ? <Video size={14} /> : lIdx + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            {editingLesson === lesson.id ? (
                                                                <div className="space-y-3 bg-slate-50 p-4 rounded-xl -ml-3">
                                                                    <input
                                                                        type="text"
                                                                        value={lesson.title}
                                                                        onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                                                                        placeholder="Lesson title"
                                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                                    />
                                                                    <textarea
                                                                        value={lesson.description || ''}
                                                                        onChange={(e) => updateLesson(module.id, lesson.id, { description: e.target.value })}
                                                                        placeholder="Lesson description"
                                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 h-20"
                                                                    />

                                                                    {lesson.isLiveClass ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Meeting URL (Zoom/Google Meet)</label>
                                                                                <input
                                                                                    type="url"
                                                                                    value={lesson.liveClassUrl || ''}
                                                                                    onChange={(e) => updateLesson(module.id, lesson.id, { liveClassUrl: e.target.value })}
                                                                                    placeholder="https://zoom.us/j/..."
                                                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Recording URL (after class)</label>
                                                                                <input
                                                                                    type="url"
                                                                                    value={lesson.recordingUrl || ''}
                                                                                    onChange={(e) => updateLesson(module.id, lesson.id, { recordingUrl: e.target.value })}
                                                                                    placeholder="https://..."
                                                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Scheduled Start</label>
                                                                                <input
                                                                                    type="datetime-local"
                                                                                    value={formatDateForInput(lesson.scheduledAt)}
                                                                                    onChange={(e) => updateLesson(module.id, lesson.id, { scheduledAt: e.target.value })}
                                                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Scheduled End</label>
                                                                                <input
                                                                                    type="datetime-local"
                                                                                    value={formatDateForInput(lesson.scheduledEndAt)}
                                                                                    onChange={(e) => updateLesson(module.id, lesson.id, { scheduledEndAt: e.target.value })}
                                                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Video URL</label>
                                                                                <input
                                                                                    type="url"
                                                                                    value={lesson.videoUrl || ''}
                                                                                    onChange={(e) => updateLesson(module.id, lesson.id, { videoUrl: e.target.value })}
                                                                                    placeholder="https://youtube.com/..."
                                                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Duration</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={lesson.duration || ''}
                                                                                    onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                                                                                    placeholder="e.g., 15 min"
                                                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Resources */}
                                                                    <div>
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <label className="text-xs font-medium text-slate-500">Resources & Attachments</label>
                                                                            <button
                                                                                onClick={() => addResource(module.id, lesson.id)}
                                                                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                                                            >
                                                                                + Add Resource
                                                                            </button>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            {lesson.resources?.map((resource, rIdx) => (
                                                                                <div key={rIdx} className="flex gap-2">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={resource.name}
                                                                                        onChange={(e) => updateResource(module.id, lesson.id, rIdx, { name: e.target.value })}
                                                                                        placeholder="Resource name"
                                                                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                                                    />
                                                                                    <input
                                                                                        type="url"
                                                                                        value={resource.url}
                                                                                        onChange={(e) => updateResource(module.id, lesson.id, rIdx, { url: e.target.value })}
                                                                                        placeholder="URL"
                                                                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                                                    />
                                                                                    <button
                                                                                        onClick={() => deleteResource(module.id, lesson.id, rIdx)}
                                                                                        className="p-2 text-red-400 hover:text-red-600"
                                                                                    >
                                                                                        <X size={16} />
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex justify-end">
                                                                        <button
                                                                            onClick={() => setEditingLesson(null)}
                                                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                                                                        >
                                                                            Done
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <h4 className="font-medium text-slate-900">{lesson.title}</h4>
                                                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                                            {lesson.isLiveClass && lesson.scheduledAt && (
                                                                                <span className="flex items-center gap-1">
                                                                                    <Calendar size={12} />
                                                                                    {new Date(lesson.scheduledAt).toLocaleDateString('en-US', {
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    })}
                                                                                </span>
                                                                            )}
                                                                            {lesson.duration && (
                                                                                <span className="flex items-center gap-1">
                                                                                    <Clock size={12} />
                                                                                    {lesson.duration}
                                                                                </span>
                                                                            )}
                                                                            {lesson.resources && lesson.resources.length > 0 && (
                                                                                <span className="flex items-center gap-1">
                                                                                    <FileText size={12} />
                                                                                    {lesson.resources.length} resources
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <button
                                                                            onClick={() => setEditingLesson(lesson.id)}
                                                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                        >
                                                                            <Edit2 size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => deleteLesson(module.id, lesson.id, lesson.title)}
                                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add Lesson Buttons */}
                                        <div className="p-4 pl-14 bg-slate-50 flex gap-2">
                                            <button
                                                onClick={() => addLesson(module.id, false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                                            >
                                                <Plus size={16} />
                                                Add Lesson
                                            </button>
                                            <button
                                                onClick={() => addLesson(module.id, true)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                                            >
                                                <Video size={16} />
                                                Add Live Class
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}

                    {/* Add Module Button */}
                    <button
                        onClick={addModule}
                        className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus size={20} />
                        Add New Module
                    </button>
                </div>
            )}

            {/* Live Classes Tab */}
            {activeTab === 'live-classes' && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900">Scheduled Live Classes</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage all live sessions for this course</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {getLiveClasses().length === 0 ? (
                            <div className="p-12 text-center">
                                <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No Live Classes</h3>
                                <p className="text-slate-500 mb-4">Add live classes to your modules in the Course Content tab</p>
                            </div>
                        ) : (
                            getLiveClasses().map((liveClass) => (
                                <div key={liveClass.id} className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center text-white">
                                        <Video size={22} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900">{liveClass.title}</h3>
                                        <p className="text-sm text-slate-500">{liveClass.moduleName}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                            {liveClass.scheduledAt && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(liveClass.scheduledAt).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {liveClass.liveClassUrl && (
                                            <a
                                                href={liveClass.liveClassUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                                            >
                                                <ExternalLink size={14} />
                                                Join Link
                                            </a>
                                        )}
                                        <button
                                            onClick={() => {
                                                setActiveTab('content');
                                                setExpandedModules(new Set([liveClass.moduleId]));
                                                setEditingLesson(liveClass.id);
                                            }}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
                <div className="space-y-6">
                    {/* Create Announcement */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Create Announcement</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Announcement title..."
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                            <textarea
                                placeholder="Write your announcement..."
                                value={newAnnouncement.content}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[100px] resize-y"
                            />

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Attach Image (optional)</label>
                                <input
                                    ref={announcementImageInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        // Validate file size (5MB max)
                                        if (file.size > 5 * 1024 * 1024) {
                                            alert.error("File Too Large", "Image size must be less than 5MB");
                                            return;
                                        }

                                        setAnnouncementImageFile(file);
                                        setIsUploadingImage(true);

                                        try {
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            formData.append('folder', 'announcements');

                                            const res = await fetch('/api/upload', {
                                                method: 'POST',
                                                body: formData
                                            });

                                            if (res.ok) {
                                                const data = await res.json();
                                                setNewAnnouncement({ ...newAnnouncement, imageUrl: data.url });
                                                alert.success("Image Uploaded", "Image has been uploaded successfully");
                                            } else {
                                                throw new Error('Upload failed');
                                            }
                                        } catch (error) {
                                            console.error('Image upload error:', error);
                                            alert.error("Upload Failed", "Could not upload image");
                                            setAnnouncementImageFile(null);
                                        } finally {
                                            setIsUploadingImage(false);
                                        }
                                    }}
                                    className="hidden"
                                />

                                {/* Image Preview or Upload Button */}
                                {newAnnouncement.imageUrl ? (
                                    <div className="relative w-full max-w-md">
                                        <img
                                            src={newAnnouncement.imageUrl}
                                            alt="Announcement preview"
                                            className="w-full h-48 object-cover rounded-xl border border-slate-200"
                                        />
                                        <button
                                            onClick={() => {
                                                setNewAnnouncement({ ...newAnnouncement, imageUrl: '' });
                                                setAnnouncementImageFile(null);
                                                if (announcementImageInputRef.current) {
                                                    announcementImageInputRef.current.value = '';
                                                }
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => announcementImageInputRef.current?.click()}
                                        disabled={isUploadingImage}
                                        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
                                    >
                                        {isUploadingImage ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon size={18} />
                                                Add Image
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newAnnouncement.isPinned}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isPinned: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                    />
                                    <Pin size={16} className="text-slate-500" />
                                    <span className="text-sm text-slate-600">Pin this announcement</span>
                                </label>
                                <button
                                    onClick={async () => {
                                        if (!newAnnouncement.title || !newAnnouncement.content) {
                                            alert.warning("Missing Fields", "Please enter a title and content for the announcement");
                                            return;
                                        }
                                        setIsCreatingAnnouncement(true);
                                        try {
                                            const res = await fetch('/api/admin/announcements', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    courseSlug: slug,
                                                    title: newAnnouncement.title,
                                                    content: newAnnouncement.content,
                                                    imageUrl: newAnnouncement.imageUrl || null,
                                                    isPinned: newAnnouncement.isPinned,
                                                    authorId: 'admin', // This should come from session
                                                    authorName: 'Admin'
                                                })
                                            });
                                            if (res.ok) {
                                                setNewAnnouncement({ title: '', content: '', isPinned: false, imageUrl: '' });
                                                setAnnouncementImageFile(null);
                                                if (announcementImageInputRef.current) {
                                                    announcementImageInputRef.current.value = '';
                                                }
                                                fetchAnnouncements();
                                                alert.success("Announcement Created", "Your announcement has been posted");
                                            } else {
                                                throw new Error('Failed to create announcement');
                                            }
                                        } catch (error) {
                                            console.error('Error creating announcement:', error);
                                            alert.error("Creation Failed", "Could not create announcement");
                                        } finally {
                                            setIsCreatingAnnouncement(false);
                                        }
                                    }}
                                    disabled={isCreatingAnnouncement || isUploadingImage}
                                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {isCreatingAnnouncement ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    Post Announcement
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Announcements List */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200">
                            <h3 className="font-semibold text-slate-900">All Announcements ({announcements.length})</h3>
                        </div>
                        {announcements.length === 0 ? (
                            <div className="p-12 text-center">
                                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">No announcements yet. Create one above!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {announcements.map((announcement) => (
                                    <div key={announcement._id} className="p-4 hover:bg-slate-50">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {announcement.isPinned && (
                                                        <Pin size={14} className="text-indigo-500" />
                                                    )}
                                                    <h4 className="font-semibold text-slate-900">{announcement.title}</h4>
                                                </div>
                                                <p className="text-slate-600 text-sm mb-2">{announcement.content}</p>
                                                {announcement.imageUrl && (
                                                    <div className="mb-3">
                                                        <img
                                                            src={announcement.imageUrl}
                                                            alt={announcement.title}
                                                            className="max-w-md w-full h-48 object-cover rounded-xl border border-slate-200"
                                                        />
                                                    </div>
                                                )}
                                                <p className="text-xs text-slate-400">
                                                    Posted by {announcement.authorName} • {new Date(announcement.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await fetch('/api/admin/announcements', {
                                                                method: 'PUT',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    id: announcement._id,
                                                                    isPinned: !announcement.isPinned
                                                                })
                                                            });
                                                            fetchAnnouncements();
                                                        } catch (error) {
                                                            console.error('Error toggling pin:', error);
                                                        }
                                                    }}
                                                    className={`p-2 rounded-lg transition-colors ${announcement.isPinned
                                                        ? 'bg-indigo-100 text-indigo-600'
                                                        : 'text-slate-400 hover:bg-slate-100'
                                                        }`}
                                                    title={announcement.isPinned ? "Unpin" : "Pin"}
                                                >
                                                    <Pin size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        showConfirm({
                                                            title: "Delete Announcement",
                                                            message: `Are you sure you want to delete "${announcement.title}"?`,
                                                            type: "delete",
                                                            confirmLabel: "Delete",
                                                            onConfirm: async () => {
                                                                try {
                                                                    await fetch(`/api/admin/announcements?id=${announcement._id}`, {
                                                                        method: 'DELETE'
                                                                    });
                                                                    fetchAnnouncements();
                                                                    alert.success("Announcement Deleted", "The announcement has been removed");
                                                                } catch (error) {
                                                                    console.error('Error deleting announcement:', error);
                                                                    alert.error("Delete Failed", "Could not delete announcement");
                                                                }
                                                            }
                                                        });
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
                <div className="space-y-6">
                    {/* Create New Assignment */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Assignment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Lesson</label>
                                <select
                                    value={newAssignment.lessonId}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, lessonId: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                    <option value="">Select a lesson...</option>
                                    {course?.modules.map((module) => (
                                        <optgroup key={module.id} label={module.title}>
                                            {module.lessons.map((lesson) => (
                                                <option key={lesson.id} value={lesson.id}>
                                                    {lesson.title}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newAssignment.title}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                    placeholder="Assignment title..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={newAssignment.description}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                    placeholder="Assignment instructions..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[80px]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                                <input
                                    type="datetime-local"
                                    value={newAssignment.dueDate}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Max Grade</label>
                                <input
                                    type="number"
                                    value={newAssignment.maxGrade}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, maxGrade: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="allowLate"
                                    checked={newAssignment.allowLateSubmission}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, allowLateSubmission: e.target.checked })}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded"
                                />
                                <label htmlFor="allowLate" className="text-sm text-slate-600">Allow late submissions</label>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={createAssignment}
                                    disabled={isCreatingAssignment}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {isCreatingAssignment ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                    Create Assignment
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Assignment List */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-200">
                                <h3 className="font-semibold text-slate-900">All Assignments ({assignments.length})</h3>
                            </div>
                            {assignments.length === 0 ? (
                                <div className="p-12 text-center">
                                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">No assignments yet. Create one above!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                                    {assignments.map((assignment) => (
                                        <div
                                            key={assignment._id}
                                            onClick={() => {
                                                setSelectedAssignment(assignment);
                                                fetchSubmissions(assignment._id);
                                            }}
                                            className={`p-4 cursor-pointer transition-colors ${selectedAssignment?._id === assignment._id
                                                ? 'bg-indigo-50 border-l-4 border-indigo-600'
                                                : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-slate-900">{assignment.title}</h4>
                                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{assignment.description}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs">
                                                        {assignment.dueDate && (
                                                            <span className="text-orange-600 flex items-center gap-1">
                                                                <Clock size={12} />
                                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                        <span className="text-slate-400">Max: {assignment.maxGrade} pts</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                        {assignment.totalSubmissions || 0} submitted
                                                    </span>
                                                    {(assignment.pendingSubmissions || 0) > 0 && (
                                                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                                                            {assignment.pendingSubmissions} pending
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submissions Panel */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900">
                                    {selectedAssignment ? `Submissions: ${selectedAssignment.title}` : 'Select an Assignment'}
                                </h3>
                                {selectedAssignment && (
                                    <button
                                        onClick={() => {
                                            showConfirm({
                                                title: "Delete Assignment",
                                                message: `Are you sure you want to delete "${selectedAssignment.title}"? This will also delete all submissions.`,
                                                type: "delete",
                                                confirmLabel: "Delete",
                                                onConfirm: () => deleteAssignment(selectedAssignment._id)
                                            });
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            {!selectedAssignment ? (
                                <div className="p-12 text-center">
                                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">Click on an assignment to view submissions</p>
                                </div>
                            ) : submissions.length === 0 ? (
                                <div className="p-12 text-center">
                                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">No submissions yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                                    {submissions.map((submission) => (
                                        <div key={submission._id} className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-medium text-slate-900">
                                                        {submission.user?.name || 'Unknown Student'}
                                                        {submission.user?.name === 'Unknown Student' && submission.user?.id && (
                                                            <span className="text-xs text-slate-400 ml-2 font-normal">({String(submission.user.id).substring(0, 8)}...)</span>
                                                        )}
                                                    </h4>
                                                    <p className="text-sm text-slate-500">{submission.user?.email}</p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded ${submission.status === 'graded' ? 'bg-green-100 text-green-700' :
                                                    submission.status === 'late' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                                </span>
                                            </div>

                                            {/* Submission content */}
                                            {submission.fileUrl && (
                                                <a
                                                    href={submission.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-sm text-indigo-600 hover:bg-slate-100 mb-3"
                                                >
                                                    <ExternalLink size={14} />
                                                    {submission.fileName || 'View Attachment'}
                                                </a>
                                            )}
                                            {submission.textContent && (
                                                <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600 mb-3">
                                                    {submission.textContent}
                                                </div>
                                            )}

                                            {/* Grading Form */}
                                            {submission.status === 'graded' ? (
                                                <div className="p-3 bg-green-50 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-green-700">Grade</span>
                                                        <span className="text-lg font-bold text-green-700">
                                                            {submission.grade}/{selectedAssignment.maxGrade}
                                                        </span>
                                                    </div>
                                                    {submission.feedback && (
                                                        <p className="text-sm text-green-600">{submission.feedback}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            id={`grade-${submission._id}`}
                                                            placeholder="Grade"
                                                            max={selectedAssignment.maxGrade}
                                                            min={0}
                                                            className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                        />
                                                        <span className="text-sm text-slate-500">/ {selectedAssignment.maxGrade}</span>
                                                    </div>
                                                    <textarea
                                                        id={`feedback-${submission._id}`}
                                                        placeholder="Feedback (optional)..."
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[60px]"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const gradeInput = document.getElementById(`grade-${submission._id}`) as HTMLInputElement;
                                                            const feedbackInput = document.getElementById(`feedback-${submission._id}`) as HTMLTextAreaElement;
                                                            const grade = Number(gradeInput.value);
                                                            if (isNaN(grade) || grade < 0 || grade > selectedAssignment.maxGrade) {
                                                                alert.warning("Invalid Grade", `Grade must be between 0 and ${selectedAssignment.maxGrade}`);
                                                                return;
                                                            }
                                                            gradeSubmission(submission._id, grade, feedbackInput.value);
                                                        }}
                                                        disabled={isGradingSubmission === submission._id}
                                                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                                                    >
                                                        {isGradingSubmission === submission._id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <Save size={14} />
                                                        )}
                                                        Save Grade
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Course Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Course Title</label>
                                <input
                                    type="text"
                                    value={course.title}
                                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    value={course.subtitle || ''}
                                    onChange={(e) => setCourse({ ...course, subtitle: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Price (USD)</label>
                                <input
                                    type="number"
                                    value={course.price}
                                    onChange={(e) => { setCourse({ ...course, price: Number(e.target.value) }); markChanged(); }}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                                <input
                                    type="text"
                                    value={course.duration}
                                    onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                                    placeholder="e.g., 8 Weeks"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Level</label>
                                <select
                                    value={course.level}
                                    onChange={(e) => { setCourse({ ...course, level: e.target.value }); markChanged(); }}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Published</label>
                                <select
                                    value={course.isPublished ? 'true' : 'false'}
                                    onChange={(e) => { setCourse({ ...course, isPublished: e.target.value === 'true' }); markChanged(); }}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                                >
                                    <option value="true">Published</option>
                                    <option value="false">Draft</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                            value={course.description}
                            onChange={(e) => { setCourse({ ...course, description: e.target.value }); markChanged(); }}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 h-32"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Long Description</label>
                        <textarea
                            value={course.longDescription || ''}
                            onChange={(e) => { setCourse({ ...course, longDescription: e.target.value }); markChanged(); }}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 h-40"
                        />
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Instructor</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={course.instructor?.name || ''}
                                    onChange={(e) => setCourse({
                                        ...course,
                                        instructor: { ...course.instructor, name: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                                <input
                                    type="text"
                                    value={course.instructor?.bio || ''}
                                    onChange={(e) => {
                                        setCourse({
                                            ...course,
                                            instructor: { ...course.instructor, bio: e.target.value }
                                        });
                                        markChanged();
                                    }}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Confirm Modal */}
            <ConfirmModal />
        </div>
    );
}

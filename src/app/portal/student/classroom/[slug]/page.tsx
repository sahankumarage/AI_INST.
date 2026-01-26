"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Play,
    CheckCircle,
    Circle,
    ChevronDown,
    ChevronRight,
    FileText,
    Upload,
    BookOpen,
    Award,
    Bell,
    StickyNote,
    Clock,
    ArrowLeft,
    Download,
    Send,
    Plus,
    Trash2,
    Loader2,
    Lock,
    Video,
    GraduationCap,
    BarChart3,
    MessageSquare,
    Calendar,
    ExternalLink
} from "lucide-react";
import { useAlert } from "@/components/ui/AlertService";

interface Module {
    id: string;
    title: string;
    description?: string;
    order: number;
    lessons: Lesson[];
}

interface Lesson {
    id: string;
    title: string;
    description?: string;
    videoUrl?: string;
    recordingUrl?: string;
    duration?: string;
    order: number;
    resources?: { name: string; url: string }[];
    isCompleted?: boolean;
    hasAssignment?: boolean;
    submissionStatus?: string | null;
    // Live class support
    isLiveClass?: boolean;
    liveClassUrl?: string;
    scheduledAt?: string;
    scheduledEndAt?: string;
}

interface Assignment {
    _id: string;
    title: string;
    description: string;
    lessonId: string;
    dueDate?: string;
    maxGrade: number;
    attachments?: { name: string; url: string }[];
    submission?: {
        status: string;
        grade?: number;
        feedback?: string;
        submittedAt: string;
    };
}

interface Note {
    _id: string;
    lessonId: string;
    content: string;
    timestamp?: number;
    createdAt: string;
}

interface Announcement {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    isPinned: boolean;
    createdAt: string;
}

type TabType = 'content' | 'schedule' | 'assignments' | 'grades' | 'notes' | 'announcements';

export default function ClassroomPage() {
    const params = useParams();
    const router = useRouter();
    const alert = useAlert();
    const slug = typeof params?.slug === 'string' ? params.slug : '';

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState<string | null>(null);

    // Course data
    const [course, setCourse] = useState<any>(null);
    const [enrollment, setEnrollment] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    // UI state
    const [activeTab, setActiveTab] = useState<TabType>('content');
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [newNote, setNewNote] = useState("");
    const [isSavingNote, setIsSavingNote] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("lms_user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserId(user.id);
            fetchClassroomData(user.id);
        } else {
            router.push('/student-login');
        }
    }, [slug, router]);

    const fetchClassroomData = async (uid: string) => {
        try {
            const res = await fetch(`/api/student/classroom?userId=${uid}&courseSlug=${slug}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            setCourse(data.course);
            setEnrollment(data.enrollment);
            setStats(data.stats);
            setAssignments(data.assignments || []);
            setNotes(data.notes || []);
            setAnnouncements(data.announcements || []);

            // Expand first module by default and select first lesson
            if (data.course?.modules?.length > 0) {
                setExpandedModules([data.course.modules[0].id]);
                if (data.course.modules[0].lessons?.length > 0) {
                    setSelectedLesson(data.course.modules[0].lessons[0]);
                }
            }

        } catch (err: any) {
            setError(err.message || 'Failed to load classroom');
            alert.error("Failed to load classroom", err.message || "Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const markLessonComplete = async (lessonId: string) => {
        if (!userId) return;

        try {
            const res = await fetch('/api/student/classroom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    courseSlug: slug,
                    lessonId,
                    action: 'complete_lesson'
                })
            });

            const data = await res.json();
            if (res.ok) {
                // Update local state
                setEnrollment((prev: any) => ({
                    ...prev,
                    progress: data.progress,
                    completedLessons: data.completedLessons
                }));

                // Update lesson in course
                setCourse((prev: any) => ({
                    ...prev,
                    modules: prev.modules.map((m: Module) => ({
                        ...m,
                        lessons: m.lessons.map((l: Lesson) =>
                            l.id === lessonId ? { ...l, isCompleted: true } : l
                        )
                    }))
                }));

                alert.success("Lesson Completed! 🎉", `Progress updated to ${data.progress}%`);
            } else {
                alert.error("Failed to update progress", "Please try again");
            }
        } catch (err) {
            console.error('Failed to mark lesson complete:', err);
            alert.error("Failed to update progress", "Please try again");
        }
    };

    const saveNote = async () => {
        if (!userId || !selectedLesson || !newNote.trim()) return;

        setIsSavingNote(true);
        try {
            const res = await fetch('/api/student/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    courseSlug: slug,
                    lessonId: selectedLesson.id,
                    content: newNote
                })
            });

            const data = await res.json();
            if (res.ok) {
                setNotes(prev => [data.note, ...prev]);
                setNewNote("");
                alert.success("Note Saved", "Your note has been saved");
            } else {
                alert.error("Failed to save note", "Please try again");
            }
        } catch (err) {
            console.error('Failed to save note:', err);
            alert.error("Failed to save note", "Please try again");
        } finally {
            setIsSavingNote(false);
        }
    };

    const deleteNote = async (noteId: string) => {
        try {
            const res = await fetch(`/api/student/notes?noteId=${noteId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setNotes(prev => prev.filter(n => n._id !== noteId));
                alert.success("Note Deleted", "Your note has been removed");
            } else {
                alert.error("Failed to delete note", "Please try again");
            }
        } catch (err) {
            console.error('Failed to delete note:', err);
            alert.error("Failed to delete note", "Please try again");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-slate-500">Loading classroom...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h1>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <Link href="/portal/student/courses">
                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                            Back to Courses
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const lessonNotes = notes.filter(n => n.lessonId === selectedLesson?.id);
    const currentAssignment = assignments.find(a => a.lessonId === selectedLesson?.id);

    return (
        <div className="bg-slate-100">
            {/* Top Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/portal/student/courses" className="text-slate-400 hover:text-slate-600">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">{course?.title}</h1>
                            <p className="text-sm text-slate-500">{course?.instructor?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 bg-slate-100 rounded-full px-4 py-2">
                            <div className="text-sm text-slate-600">
                                <span className="font-bold text-indigo-600">{enrollment?.progress || 0}%</span> Complete
                            </div>
                            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                                    style={{ width: `${enrollment?.progress || 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 px-6 pb-0 overflow-x-auto">
                    {[
                        { id: 'content', label: 'Content', icon: BookOpen },
                        { id: 'schedule', label: 'Live Classes', icon: Video },
                        { id: 'assignments', label: 'Assignments', icon: FileText },
                        { id: 'grades', label: 'Grades', icon: BarChart3 },
                        { id: 'notes', label: 'Notes', icon: StickyNote },
                        { id: 'announcements', label: 'Announcements', icon: Bell }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {tab.id === 'announcements' && announcements.length > 0 && (
                                <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {announcements.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </header>

            <div className="flex">
                {/* Sidebar - Course Modules */}
                {activeTab === 'content' && (
                    <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto hidden lg:block" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                        <div className="p-4">
                            <h3 className="font-bold text-slate-900 mb-4">Course Content</h3>
                            <div className="space-y-2">
                                {course?.modules?.map((module: Module, idx: number) => (
                                    <div key={module.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">
                                                    {idx + 1}
                                                </span>
                                                <span className="font-medium text-slate-900 text-left text-sm">{module.title}</span>
                                            </div>
                                            {expandedModules.includes(module.id) ? (
                                                <ChevronDown size={18} className="text-slate-400" />
                                            ) : (
                                                <ChevronRight size={18} className="text-slate-400" />
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {expandedModules.includes(module.id) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    {module.lessons?.map((lesson: Lesson) => (
                                                        <button
                                                            key={lesson.id}
                                                            onClick={() => setSelectedLesson(lesson)}
                                                            className={`w-full flex items-center gap-3 p-3 pl-6 text-left transition-colors ${selectedLesson?.id === lesson.id
                                                                ? 'bg-indigo-50 border-l-4 border-indigo-600'
                                                                : 'hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {lesson.isCompleted ? (
                                                                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                                                            ) : (
                                                                <Circle size={18} className="text-slate-300 flex-shrink-0" />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm truncate ${selectedLesson?.id === lesson.id ? 'text-indigo-700 font-medium' : 'text-slate-700'
                                                                    }`}>
                                                                    {lesson.title}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                    {(lesson as any).isLiveClass && (
                                                                        <span className="text-xs text-red-500 flex items-center gap-1 bg-red-50 px-1.5 py-0.5 rounded">
                                                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                                            Live
                                                                        </span>
                                                                    )}
                                                                    {lesson.duration && (
                                                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                            <Clock size={10} /> {lesson.duration}
                                                                        </span>
                                                                    )}
                                                                    {lesson.hasAssignment && (
                                                                        <span className="text-xs text-orange-500 flex items-center gap-1">
                                                                            <FileText size={10} /> Assignment
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main Content Area */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {/* Content Tab */}
                    {activeTab === 'content' && selectedLesson && (
                        <div className="max-w-4xl mx-auto">
                            {/* Live Class / Video Section */}
                            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-8 mb-6 relative overflow-hidden">
                                {/* Background decoration */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
                                </div>

                                <div className="relative z-10">
                                    {(selectedLesson as any).isLiveClass || (selectedLesson as any).liveClassUrl ? (
                                        /* Live Class Mode */
                                        <div className="text-center">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-6">
                                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                Live Online Class
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">{selectedLesson.title}</h3>

                                            {(selectedLesson as any).scheduledAt && (
                                                <div className="flex items-center justify-center gap-4 text-slate-300 mb-6">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} />
                                                        <span>
                                                            {new Date((selectedLesson as any).scheduledAt).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <span>•</span>
                                                    <span>
                                                        {new Date((selectedLesson as any).scheduledAt).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            )}

                                            {(selectedLesson as any).liveClassUrl ? (
                                                <a
                                                    href={(selectedLesson as any).liveClassUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
                                                >
                                                    <Video size={24} />
                                                    Join Zoom Meeting
                                                </a>
                                            ) : (
                                                <div className="inline-flex items-center gap-3 px-8 py-4 bg-slate-700 text-slate-400 rounded-xl font-bold text-lg cursor-not-allowed">
                                                    <Video size={24} />
                                                    Meeting Link Coming Soon
                                                </div>
                                            )}

                                            {/* Recording link if available */}
                                            {(selectedLesson as any).recordingUrl && (
                                                <div className="mt-6">
                                                    <a
                                                        href={(selectedLesson as any).recordingUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors"
                                                    >
                                                        <Play size={16} />
                                                        Watch Recording
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ) : selectedLesson.videoUrl || (selectedLesson as any).recordingUrl ? (
                                        /* Pre-recorded Video Mode */
                                        <div>
                                            <video
                                                src={selectedLesson.videoUrl || (selectedLesson as any).recordingUrl}
                                                controls
                                                className="w-full rounded-xl"
                                            />
                                        </div>
                                    ) : (
                                        /* No content yet */
                                        <div className="text-center py-12">
                                            <Video size={64} className="mx-auto mb-4 text-slate-500" />
                                            <p className="text-slate-400">Content coming soon</p>
                                            <p className="text-slate-500 text-sm mt-2">Check announcements for class schedule updates</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Lesson Info */}
                            <div className="bg-white rounded-2xl p-6 mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedLesson.title}</h2>
                                        <p className="text-slate-500">{selectedLesson.description}</p>
                                    </div>
                                    {!selectedLesson.isCompleted && (
                                        <button
                                            onClick={() => markLessonComplete(selectedLesson.id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                                        >
                                            <CheckCircle size={18} />
                                            Mark Complete
                                        </button>
                                    )}
                                    {selectedLesson.isCompleted && (
                                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium flex items-center gap-2">
                                            <CheckCircle size={18} />
                                            Completed
                                        </span>
                                    )}
                                </div>

                                {/* Resources */}
                                {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <h3 className="font-bold text-slate-900 mb-4">Resources</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedLesson.resources.map((resource, idx) => (
                                                <a
                                                    key={idx}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                                >
                                                    <Download size={18} className="text-indigo-600" />
                                                    <span className="text-sm text-slate-700">{resource.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Assignment for this lesson */}
                            {currentAssignment && (
                                <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-orange-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                            <FileText className="text-orange-600" size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900">{currentAssignment.title}</h3>
                                            <p className="text-slate-500 text-sm mt-1">{currentAssignment.description}</p>
                                            {currentAssignment.dueDate && (
                                                <p className="text-orange-600 text-sm mt-2 flex items-center gap-1">
                                                    <Clock size={14} />
                                                    Due: {new Date(currentAssignment.dueDate).toLocaleDateString()}
                                                </p>
                                            )}
                                            {currentAssignment.submission ? (
                                                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                                    <p className="text-green-700 font-medium">
                                                        ✓ Submitted on {new Date(currentAssignment.submission.submittedAt).toLocaleDateString()}
                                                    </p>
                                                    {currentAssignment.submission.grade !== undefined && (
                                                        <p className="text-green-600 mt-1">
                                                            Grade: {currentAssignment.submission.grade}/{currentAssignment.maxGrade}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                                                    <Upload size={18} />
                                                    Submit Assignment
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quick Notes Section */}
                            <div className="bg-white rounded-2xl p-6">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <StickyNote size={18} className="text-yellow-500" />
                                    Notes for this lesson
                                </h3>
                                <div className="flex gap-3 mb-4">
                                    <input
                                        type="text"
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Add a quick note..."
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        onKeyPress={(e) => e.key === 'Enter' && saveNote()}
                                    />
                                    <button
                                        onClick={saveNote}
                                        disabled={isSavingNote || !newNote.trim()}
                                        className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSavingNote ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {lessonNotes.map(note => (
                                        <div key={note._id} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl group">
                                            <p className="flex-1 text-sm text-slate-700">{note.content}</p>
                                            <button
                                                onClick={() => deleteNote(note._id)}
                                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {lessonNotes.length === 0 && (
                                        <p className="text-slate-400 text-sm text-center py-4">No notes for this lesson yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Schedule / Live Classes Tab */}
                    {activeTab === 'schedule' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Live Class Schedule</h2>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    Live classes via Zoom
                                </div>
                            </div>

                            {/* Upcoming Classes */}
                            {(() => {
                                const allLessons: any[] = [];
                                course?.modules?.forEach((module: Module) => {
                                    module.lessons?.forEach((lesson: Lesson) => {
                                        if ((lesson as any).isLiveClass || (lesson as any).liveClassUrl) {
                                            allLessons.push({
                                                ...lesson,
                                                moduleName: module.title
                                            });
                                        }
                                    });
                                });

                                const now = new Date();
                                const upcomingClasses = allLessons
                                    .filter(l => l.scheduledAt && new Date(l.scheduledAt) >= now)
                                    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
                                const pastClasses = allLessons
                                    .filter(l => l.scheduledAt && new Date(l.scheduledAt) < now)
                                    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

                                if (allLessons.length === 0) {
                                    return (
                                        <div className="bg-white rounded-2xl p-12 text-center">
                                            <Video className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">No Live Classes Scheduled</h3>
                                            <p className="text-slate-500">Live class sessions will appear here when scheduled.</p>
                                        </div>
                                    );
                                }

                                return (
                                    <>
                                        {upcomingClasses.length > 0 && (
                                            <div className="mb-8">
                                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    <span className="w-3 h-3 bg-green-500 rounded-full" />
                                                    Upcoming Classes
                                                </h3>
                                                <div className="space-y-4">
                                                    {upcomingClasses.map((lesson, idx) => (
                                                        <div key={lesson.id} className="bg-white rounded-2xl p-6 border-2 border-green-200">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                                                                            {lesson.moduleName}
                                                                        </span>
                                                                        {idx === 0 && (
                                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                                                                NEXT CLASS
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <h4 className="text-lg font-bold text-slate-900">{lesson.title}</h4>
                                                                    <p className="text-slate-500 text-sm mt-1">{lesson.description}</p>
                                                                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock size={16} />
                                                                            <span>
                                                                                {new Date(lesson.scheduledAt).toLocaleDateString('en-US', {
                                                                                    weekday: 'short',
                                                                                    month: 'short',
                                                                                    day: 'numeric'
                                                                                })}
                                                                            </span>
                                                                        </div>
                                                                        <span>•</span>
                                                                        <span>
                                                                            {new Date(lesson.scheduledAt).toLocaleTimeString('en-US', {
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col items-end gap-2">
                                                                    {lesson.liveClassUrl ? (
                                                                        <a
                                                                            href={lesson.liveClassUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                                                                        >
                                                                            <Video size={18} />
                                                                            Join Zoom
                                                                        </a>
                                                                    ) : (
                                                                        <span className="px-6 py-3 bg-slate-200 text-slate-500 rounded-xl font-medium">
                                                                            Link Coming Soon
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {pastClasses.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                                                    <span className="w-3 h-3 bg-slate-400 rounded-full" />
                                                    Past Classes
                                                </h3>
                                                <div className="space-y-3">
                                                    {pastClasses.map(lesson => (
                                                        <div key={lesson.id} className="bg-white rounded-xl p-4 border border-slate-200">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h4 className="font-medium text-slate-800">{lesson.title}</h4>
                                                                    <p className="text-sm text-slate-400">
                                                                        {new Date(lesson.scheduledAt).toLocaleDateString('en-US', {
                                                                            weekday: 'short',
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </p>
                                                                </div>
                                                                {lesson.recordingUrl ? (
                                                                    <a
                                                                        href={lesson.recordingUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors flex items-center gap-2"
                                                                    >
                                                                        <Play size={14} />
                                                                        Watch Recording
                                                                    </a>
                                                                ) : (
                                                                    <span className="px-4 py-2 text-slate-400 text-sm">No recording available</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Assignments Tab */}
                    {activeTab === 'assignments' && (
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Assignments</h2>
                            {assignments.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center">
                                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Assignments Yet</h3>
                                    <p className="text-slate-500">Assignments will appear here when they're added to the course.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {assignments.map(assignment => (
                                        <div key={assignment._id} className="bg-white rounded-2xl p-6 border border-slate-200">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{assignment.title}</h3>
                                                    <p className="text-slate-500 text-sm mt-1">{assignment.description}</p>
                                                    {assignment.dueDate && (
                                                        <p className="text-orange-600 text-sm mt-2 flex items-center gap-1">
                                                            <Clock size={14} />
                                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    {assignment.submission?.status === 'graded' ? (
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                            {assignment.submission.grade}/{assignment.maxGrade}
                                                        </span>
                                                    ) : assignment.submission ? (
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                            Submitted
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                                            Pending
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Grades Tab */}
                    {activeTab === 'grades' && (
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Grades & Progress</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-2xl p-6 text-center">
                                    <div className="text-4xl font-bold text-indigo-600 mb-2">{enrollment?.progress || 0}%</div>
                                    <p className="text-slate-500">Course Progress</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 text-center">
                                    <div className="text-4xl font-bold text-green-600 mb-2">
                                        {stats?.completedLessons || 0}/{stats?.totalLessons || 0}
                                    </div>
                                    <p className="text-slate-500">Lessons Completed</p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 text-center">
                                    <div className="text-4xl font-bold text-purple-600 mb-2">
                                        {stats?.averageGrade !== null ? `${stats?.averageGrade}%` : 'N/A'}
                                    </div>
                                    <p className="text-slate-500">Average Grade</p>
                                </div>
                            </div>

                            {/* Graded Assignments */}
                            <div className="bg-white rounded-2xl p-6">
                                <h3 className="font-bold text-slate-900 mb-4">Assignment Grades</h3>
                                {assignments.filter(a => a.submission?.status === 'graded').length === 0 ? (
                                    <p className="text-slate-500 text-center py-8">No graded assignments yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {assignments.filter(a => a.submission?.status === 'graded').map(assignment => (
                                            <div key={assignment._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                                <div>
                                                    <h4 className="font-medium text-slate-900">{assignment.title}</h4>
                                                    {assignment.submission?.feedback && (
                                                        <p className="text-slate-500 text-sm mt-1">{assignment.submission.feedback}</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {assignment.submission?.grade}/{assignment.maxGrade}
                                                    </div>
                                                    <p className="text-xs text-slate-400">
                                                        {Math.round((assignment.submission?.grade || 0) / assignment.maxGrade * 100)}%
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notes Tab */}
                    {activeTab === 'notes' && (
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">All Notes ({notes.length})</h2>
                            {notes.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center">
                                    <StickyNote className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Notes Yet</h3>
                                    <p className="text-slate-500">Take notes while watching lessons to see them here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notes.map(note => (
                                        <div key={note._id} className="bg-white rounded-2xl p-6 border border-slate-200">
                                            <p className="text-slate-700">{note.content}</p>
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                                                <span className="text-xs text-slate-400">
                                                    {new Date(note.createdAt).toLocaleDateString()}
                                                </span>
                                                <button
                                                    onClick={() => deleteNote(note._id)}
                                                    className="text-red-400 hover:text-red-600 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Announcements Tab */}
                    {activeTab === 'announcements' && (
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Announcements</h2>
                            {announcements.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center">
                                    <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Announcements</h3>
                                    <p className="text-slate-500">Course announcements will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {announcements.map(announcement => (
                                        <div
                                            key={announcement._id}
                                            className={`bg-white rounded-2xl p-6 border ${announcement.isPinned ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-200'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                {announcement.isPinned && (
                                                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">PINNED</span>
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900">{announcement.title}</h3>
                                                    <p className="text-slate-600 mt-2">{announcement.content}</p>
                                                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
                                                        <span>{announcement.authorName}</span>
                                                        <span>•</span>
                                                        <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

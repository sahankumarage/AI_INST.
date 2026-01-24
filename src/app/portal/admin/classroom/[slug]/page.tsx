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
    X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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

type TabType = 'content' | 'live-classes' | 'assignments' | 'settings';

export default function CourseContentPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('content');
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const [editingLesson, setEditingLesson] = useState<string | null>(null);
    const [editingModule, setEditingModule] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            fetchCourse();
        }
    }, [slug]);

    const fetchCourse = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/courses?slug=${slug}`);
            const data = await res.json();
            if (data.course) {
                // Ensure modules array exists
                const courseData = {
                    ...data.course,
                    modules: data.course.modules || [],
                    features: data.course.features || [],
                    outcomes: data.course.outcomes || [],
                    instructor: data.course.instructor || { name: '', bio: '', avatar: '' }
                };
                setCourse(courseData);
                // Expand first module by default
                if (courseData.modules.length > 0) {
                    setExpandedModules(new Set([courseData.modules[0].id]));
                }
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveCourse = async () => {
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
                // Update local state with the saved course data
                if (data.course) {
                    setCourse(data.course);
                }
                alert('Course saved successfully!');
            } else {
                throw new Error(data.message || 'Failed to save');
            }
        } catch (error: any) {
            console.error('Error saving course:', error);
            alert('Failed to save course: ' + (error.message || 'Unknown error'));
        } finally {
            setIsSaving(false);
        }
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
    };

    const updateModule = (moduleId: string, updates: Partial<Module>) => {
        if (!course) return;
        setCourse({
            ...course,
            modules: course.modules.map(m =>
                m.id === moduleId ? { ...m, ...updates } : m
            )
        });
    };

    const deleteModule = (moduleId: string) => {
        if (!course) return;
        if (!confirm('Delete this module and all its lessons?')) return;
        setCourse({
            ...course,
            modules: course.modules.filter(m => m.id !== moduleId)
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
    };

    const deleteLesson = (moduleId: string, lessonId: string) => {
        if (!course) return;
        if (!confirm('Delete this lesson?')) return;
        setCourse({
            ...course,
            modules: course.modules.map(m =>
                m.id === moduleId
                    ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
                    : m
            )
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
                <div className="flex gap-3">
                    <button
                        onClick={saveCourse}
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
                                            deleteModule(module.id);
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
                                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Meeting URL (Zoom/Meet)</label>
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
                                                                                    value={lesson.scheduledAt ? new Date(lesson.scheduledAt).toISOString().slice(0, 16) : ''}
                                                                                    onChange={(e) => updateLesson(module.id, lesson.id, { scheduledAt: e.target.value })}
                                                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Scheduled End</label>
                                                                                <input
                                                                                    type="datetime-local"
                                                                                    value={lesson.scheduledEndAt ? new Date(lesson.scheduledEndAt).toISOString().slice(0, 16) : ''}
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
                                                                            onClick={() => deleteLesson(module.id, lesson.id)}
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

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Assignments Coming Soon</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        The assignments feature is under development. You'll be able to create, manage, and grade assignments here.
                    </p>
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
                                    onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
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
                                    onChange={(e) => setCourse({ ...course, level: e.target.value })}
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
                                    onChange={(e) => setCourse({ ...course, isPublished: e.target.value === 'true' })}
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
                            onChange={(e) => setCourse({ ...course, description: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 h-32"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Long Description</label>
                        <textarea
                            value={course.longDescription || ''}
                            onChange={(e) => setCourse({ ...course, longDescription: e.target.value })}
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
                                    onChange={(e) => setCourse({
                                        ...course,
                                        instructor: { ...course.instructor, bio: e.target.value }
                                    })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

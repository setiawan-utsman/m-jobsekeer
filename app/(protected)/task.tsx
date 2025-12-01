import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    RefreshControl,
    Alert,
    Modal,
} from 'react-native';
import { Plus, Trash2, Edit, X } from 'lucide-react-native';
import { TasksService } from '@/services/tasksService';

export default function TaskScreen() {
    const [dataTasks, setDataTasks] = useState<any>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);

    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        priority: '',
        dueDate: '',
        status: 'pending'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Simulasi fetch data - ganti dengan TasksService.getTasks()
            const mockTasks:any = await TasksService.getTasks();
            setDataTasks(mockTasks);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingTask(null);
        setTaskForm({
            title: '',
            description: '',
            priority: 'medium',
            dueDate: '',
            status: 'pending'
        });
        setShowTaskModal(true);
    };

    const openEditModal = (task:any) => {
        setEditingTask(task);
        setTaskForm({
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
            status: task.status
        });
        setShowTaskModal(true);
    };

    const handleSaveTask = async () => {
        // Validasi input
        if (!taskForm.title.trim()) {
            Alert.alert('Error', 'Title is required');
            return;
        }

        const validPriorities = ['low', 'medium', 'high'];
        if (taskForm.priority && !validPriorities.includes(taskForm.priority.toLowerCase())) {
            Alert.alert('Error', 'Priority must be low, medium, or high');
            return;
        }

        if (taskForm.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(taskForm.dueDate)) {
            Alert.alert('Error', 'Due date must be in YYYY-MM-DD format');
            return;
        }

        try {
            if (editingTask) {
                // UPDATE TASK
                const updatedTask = {
                    ...editingTask,
                    title: taskForm.title,
                    description: taskForm.description || '',
                    priority: taskForm.priority.toLowerCase() || 'medium',
                    dueDate: taskForm.dueDate || '',
                    status: taskForm.status,
                    updatedAt: new Date().toISOString()
                };

                // Update di service
                // await TasksService.updateTask(editingTask.id, updatedTask);

                // Update state local
                setDataTasks((prevTasks:any) =>
                    prevTasks.map((task:any) =>
                        task.id === editingTask.id ? updatedTask : task
                    )
                );

                Alert.alert('Success', 'Task updated successfully!');
            } else {
                // CREATE TASK
                const newTask = {
                    id: Date.now().toString(),
                    title: taskForm.title,
                    description: taskForm.description || '',
                    priority: taskForm.priority.toLowerCase() || 'medium',
                    dueDate: taskForm.dueDate || '',
                    status: taskForm.status || 'pending',
                    createdAt: new Date().toISOString()
                };

                // Save di service
                // await TasksService.createTask(newTask);

                // Update state local
                setDataTasks((prevTasks:any) => [...prevTasks, newTask]);

                Alert.alert('Success', 'Task added successfully!');
            }

            // Reset form dan tutup modal
            setTaskForm({
                title: '',
                description: '',
                priority: '',
                dueDate: '',
                status: 'pending'
            });
            setShowTaskModal(false);
            setEditingTask(null);
        } catch (error) {
            Alert.alert('Error', 'Failed to save task');
            console.error(error);
        }
    };

    const handleDeleteTask = (taskId:any) => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Delete di service
                            // await TasksService.deleteTask(taskId);

                            // Update state local
                            setDataTasks((prevTasks:any) =>
                                prevTasks.filter((task:any) => task.id !== taskId)
                            );

                            Alert.alert('Success', 'Task deleted successfully!');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete task');
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    const handleToggleStatus = async (task:any) => {
        const statusOrder = ['pending', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

        const updatedTask = {
            ...task,
            status: nextStatus,
            updatedAt: new Date().toISOString()
        };

        try {
            // await TasksService.updateTask(task.id, updatedTask);
            setDataTasks((prevTasks:any) =>
                prevTasks.map((t:any) => (t.id === task.id ? updatedTask : t))
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const getStatusColor:any = (status:any) => {
        switch (status) {
            case 'completed':
                return 'text-green-600';
            case 'in-progress':
                return 'text-yellow-600';
            default:
                return 'text-red-600';
        }
    };

    const getPriorityColor:any = (priority:any) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-green-100 text-green-700';
        }
    };

    const filteredTasks = dataTasks.filter((task:any) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                    placeholderTextColor="#999"
                />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchData} />
                }
            >
                <View style={{ marginTop: 16, gap: 8 }}>
                    {filteredTasks.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No tasks found</Text>
                            <Text style={styles.emptySubtext}>
                                {searchQuery ? 'Try different keywords' : 'Create your first task'}
                            </Text>
                        </View>
                    ) : (
                        filteredTasks.map((task:any) => (
                            <View key={task.id} style={styles.taskCard}>
                                <View style={styles.taskHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.taskTitle}>{task.title}</Text>
                                        <Text style={styles.taskDescription}>
                                            {task.description}
                                        </Text>
                                    </View>
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity
                                            onPress={() => openEditModal(task)}
                                            style={styles.iconButton}
                                        >
                                            <Edit size={18} color="#3b82f6" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDeleteTask(task.id)}
                                            style={styles.iconButton}
                                        >
                                            <Trash2 size={18} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.taskFooter}>
                                    <View style={{ flexDirection: 'row', gap: 8, flex: 1 }}>
                                        <View style={[styles.priorityBadge, getPriorityColor(task.priority)]}>
                                            <Text style={[styles.badgeText, { textTransform: 'capitalize' }]}>
                                                {task.priority}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => handleToggleStatus(task)}
                                            style={styles.statusBadge}
                                        >
                                            <Text
                                                style={[
                                                    styles.statusText,
                                                    getStatusColor(task.status)
                                                ]}
                                            >
                                                {task.status.replace('-', ' ')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {task.dueDate && (
                                        <Text style={styles.dueDate}>
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Modal Add/Edit Task */}
            <Modal
                visible={showTaskModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowTaskModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowTaskModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={styles.modalContent}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingTask ? 'Edit Task' : 'Add New Task'}
                            </Text>
                            <TouchableOpacity onPress={() => setShowTaskModal(false)}>
                                <X size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            <TextInput
                                placeholder="Title *"
                                value={taskForm.title}
                                onChangeText={(text) =>
                                    setTaskForm({ ...taskForm, title: text })
                                }
                                style={styles.input}
                                placeholderTextColor="#999"
                            />

                            <TextInput
                                placeholder="Description"
                                value={taskForm.description}
                                onChangeText={(text) =>
                                    setTaskForm({ ...taskForm, description: text })
                                }
                                style={[styles.input, styles.textArea]}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                placeholderTextColor="#999"
                            />

                            <View style={styles.inputRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Priority</Text>
                                    <View style={styles.priorityButtons}>
                                        {['low', 'medium', 'high'].map((priority) => (
                                            <TouchableOpacity
                                                key={priority}
                                                onPress={() =>
                                                    setTaskForm({ ...taskForm, priority })
                                                }
                                                style={[
                                                    styles.priorityButton,
                                                    taskForm.priority === priority &&
                                                        styles.priorityButtonActive
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.priorityButtonText,
                                                        taskForm.priority === priority &&
                                                            styles.priorityButtonTextActive
                                                    ]}
                                                >
                                                    {priority}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            <View style={styles.inputRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Status</Text>
                                    <View style={styles.priorityButtons}>
                                        {['pending', 'in-progress', 'completed'].map((status) => (
                                            <TouchableOpacity
                                                key={status}
                                                onPress={() =>
                                                    setTaskForm({ ...taskForm, status })
                                                }
                                                style={[
                                                    styles.priorityButton,
                                                    taskForm.status === status &&
                                                        styles.priorityButtonActive
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.priorityButtonText,
                                                        taskForm.status === status &&
                                                            styles.priorityButtonTextActive
                                                    ]}
                                                >
                                                    {status.replace('-', ' ')}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            <TextInput
                                placeholder="Due Date (YYYY-MM-DD)"
                                value={taskForm.dueDate}
                                onChangeText={(text) =>
                                    setTaskForm({ ...taskForm, dueDate: text })
                                }
                                style={styles.input}
                                placeholderTextColor="#999"
                            />
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                onPress={() => {
                                    setTaskForm({
                                        title: '',
                                        description: '',
                                        priority: '',
                                        dueDate: '',
                                        status: 'pending'
                                    });
                                    setShowTaskModal(false);
                                }}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSaveTask}
                                style={styles.saveButton}
                            >
                                <Text style={styles.saveButtonText}>
                                    {editingTask ? 'Update' : 'Add Task'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Floating Action Button */}
            <TouchableOpacity onPress={openAddModal} style={styles.fab}>
                <Plus size={32} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    searchContainer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    taskCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    taskDescription: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },
    taskFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priorityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    dueDate: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    emptyContainer: {
        padding: 60,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '90%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        marginBottom: 16,
    },
    textArea: {
        height: 80,
    },
    inputRow: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    priorityButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    priorityButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        alignItems: 'center',
    },
    priorityButtonActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    priorityButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'capitalize',
    },
    priorityButtonTextActive: {
        color: '#fff',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 20,
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#e5e7eb',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    saveButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#3b82f6',
    },
    saveButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    fab: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
    },
});
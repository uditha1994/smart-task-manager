import { format } from 'date-fns';

class ExportService {
    // Export tasks as JSON
    exportAsJSON(tasks) {
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-${format(new Date(), 'yyyy-MM-dd')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Export tasks as CSV
    exportAsCSV(tasks) {
        const headers = [
            'Title',
            'Description',
            'Category',
            'Priority',
            'Status',
            'Created At',
            'Due Date',
            'Completed At',
            'Estimated Time',
            'Actual Time'
        ];

        const csvContent = [
            headers.join(','),
            ...tasks.map(task => [
                this.escapeCsvField(task.title),
                this.escapeCsvField(task.description || ''),
                task.category,
                task.priority,
                task.status,
                task.createdAt,
                task.dueDate || '',
                task.completedAt || '',
                task.estimatedTime || 0,
                task.actualTime || 0
            ].join(','))
        ].join('\n');

        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Import tasks from JSON
    async importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const tasks = JSON.parse(e.target.result);
                    if (Array.isArray(tasks)) {
                        resolve(tasks);
                    } else {
                        reject(new Error('Invalid JSON format'));
                    }
                } catch (error) {
                    reject(new Error('Failed to parse JSON file'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Import tasks from CSV
    async importFromCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csv = e.target.result;
                    const lines = csv.split('\n');
                    const headers = lines[0].split(',');

                    const tasks = lines.slice(1)
                        .filter(line => line.trim())
                        .map((line, index) => {
                            const values = this.parseCsvLine(line);
                            return {
                                id: `imported-${Date.now()}-${index}`,
                                title: values[0] || `Imported Task ${index + 1}`,
                                description: values[1] || '',
                                category: values[2] || 'personal',
                                priority: values[3] || 'medium',
                                status: values[4] || 'pending',
                                createdAt: values[5] || new Date().toISOString(),
                                dueDate: values[6] || null,
                                completedAt: values[7] || null,
                                estimatedTime: parseFloat(values[8]) || 0,
                                actualTime: parseFloat(values[9]) || 0,
                                updatedAt: new Date().toISOString(),
                                tags: []
                            };
                        });

                    resolve(tasks);
                } catch (error) {
                    reject(new Error('Failed to parse CSV file'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Helper method to escape CSV fields
    escapeCsvField(field) {
        if (typeof field !== 'string') return field;
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
    }

    // Helper method to parse CSV line
    parseCsvLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current);
        return result;
    }
}

export const exportService = new ExportService();
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AdminCategories() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <Button onClick={() => alert('Coming soon')}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Category
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                <p>Category Management Implementation In Progress...</p>
                <p className="text-sm mt-2">Need to implement backend CRUD endpoints first.</p>
            </div>
        </div>
    );
}

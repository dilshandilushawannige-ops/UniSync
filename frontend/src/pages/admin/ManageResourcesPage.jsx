import React, { useEffect, useState } from 'react';
import ResourceForm from '../../components/resource/ResourceForm';
import ResourceTable from '../../components/resource/ResourceTable';
import {
	createResource,
	deleteResource,
	getAllResources,
	updateResource,
	updateResourceStatus,
} from '../../services/resourceService';

const ManageResourcesPage = () => {
	const [resources, setResources] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingResource, setEditingResource] = useState(null);
	const [message, setMessage] = useState({ type: '', text: '' });

	const showMessage = (type, text) => {
		setMessage({ type, text });
		window.setTimeout(() => {
			setMessage({ type: '', text: '' });
		}, 2800);
	};

	const loadResources = async () => {
		setIsLoading(true);
		try {
			const response = await getAllResources();
			setResources(response.data || []);
		} catch (error) {
			console.error('Failed to load resources', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadResources();
	}, []);

	const openCreateModal = () => {
		setEditingResource(null);
		setIsModalOpen(true);
	};

	const handleEdit = (resource) => {
		setEditingResource(resource);
		setIsModalOpen(true);
	};

	const handleDelete = async (id) => {
		const confirmed = window.confirm('Are you sure you want to delete this resource?');
		if (!confirmed) return;

		try {
			await deleteResource(id);
			showMessage('success', 'Resource deleted successfully.');
			await loadResources();
		} catch (error) {
			showMessage('error', 'Failed to delete resource.');
			console.error('Delete failed', error);
		}
	};

	const handleStatusToggle = async (id, newStatus) => {
		try {
			await updateResourceStatus(id, newStatus);
			showMessage('success', 'Resource status updated.');
			await loadResources();
		} catch (error) {
			showMessage('error', 'Failed to update status.');
			console.error('Status update failed', error);
		}
	};

	const handleSubmit = async (formData) => {
		try {
			if (editingResource?.id) {
				await updateResource(editingResource.id, formData);
			} else {
				await createResource(formData);
			}
			setIsModalOpen(false);
			setEditingResource(null);
			showMessage('success', editingResource?.id ? 'Resource updated successfully.' : 'Resource created successfully.');
			await loadResources();
		} catch (error) {
			showMessage('error', 'Failed to save resource.');
			console.error('Save failed', error);
		}
	};

	return (
		<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="mb-6 flex items-center justify-between gap-4">
				<h1 className="text-2xl font-bold text-[#0C447C]">Manage Resources</h1>
				<button
					onClick={openCreateModal}
					className="rounded-xl bg-gradient-to-r from-[#0C447C] to-[#378ADD] px-4 py-2.5 font-semibold text-white shadow-sm transition hover:opacity-95"
				>
					+ Add Resource
				</button>
			</div>

			{message.text && (
				<div
					className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
						message.type === 'success'
							? 'border-emerald-200 bg-emerald-50 text-emerald-700'
							: 'border-rose-200 bg-rose-50 text-rose-700'
					}`}
				>
					{message.text}
				</div>
			)}

			{isLoading ? (
				<div className="rounded-xl border border-[#D6E5F4] bg-white p-8 text-center text-slate-500">
					Loading resources...
				</div>
			) : (
				<ResourceTable
					resources={resources}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onStatusToggle={handleStatusToggle}
				/>
			)}

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 py-8">
					<div className="my-auto mx-4 w-full max-w-2xl rounded-2xl border border-[#D6E5F4] bg-white p-6 shadow-xl">
						<div className="mb-5 flex items-center justify-between border-b border-[#E6F1FB] pb-3">
							<h2 className="text-xl font-bold text-[#0C447C]">
								{editingResource ? 'Edit Resource' : 'Create Resource'}
							</h2>
							<button
								onClick={() => setIsModalOpen(false)}
								className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
							>
								Close
							</button>
						</div>

						<ResourceForm
							initialData={editingResource}
							onSubmit={handleSubmit}
							onCancel={() => setIsModalOpen(false)}
						/>
					</div>
				</div>
			)}
		</section>
	);
};

export default ManageResourcesPage;
